package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.DemandeAdhesion;
import ma.lias.entity.Membre;
import ma.lias.enums.StatutDemande;
import ma.lias.enums.StatutMembre;
import ma.lias.repository.DemandeAdhesionRepository;
import ma.lias.repository.MembreRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DemandeAdhesionService {

    private final DemandeAdhesionRepository demandeRepository;
    private final MembreRepository membreRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public DemandeAdhesion soumettre(DemandeAdhesion demande) {
        // Vérifier pas de demande en attente pour cet email
        if (demandeRepository.existsByEmailAndStatut(demande.getEmail(), StatutDemande.EN_ATTENTE)) {
            throw new RuntimeException("Une demande est déjà en cours pour cet email");
        }
        demande.setStatut(StatutDemande.EN_ATTENTE);
        DemandeAdhesion saved = demandeRepository.save(demande);

        // Notifier le directeur
        notificationService.notifierDirecteur(
            "Nouvelle demande d'adhésion de " + demande.getPrenom() + " " + demande.getNom()
        );

        return saved;
    }

    public List<DemandeAdhesion> getAll() {
        return demandeRepository.findAll();
    }

    public Membre accepter(UUID id) {
        DemandeAdhesion demande = demandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        Membre directeur = authService.getCurrentUser();
        demande.setStatut(StatutDemande.ACCEPTEE);
        demande.setValidePar(directeur);
        demande.setDateDecision(LocalDateTime.now());
        demandeRepository.save(demande);

        // Créer le compte membre
        Membre nouveau = Membre.builder()
                .nom(demande.getNom())
                .prenom(demande.getPrenom())
                .email(demande.getEmail())
                .motDePasse(passwordEncoder.encode(genererMotDePasseTemp()))
                .statut(StatutMembre.PERMANENT)
                .compteActif(true)
                .compteGele(false)
                .build();

        return membreRepository.save(nouveau);
    }

    public void refuser(UUID id, String motif) {
        DemandeAdhesion demande = demandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        Membre directeur = authService.getCurrentUser();
        demande.setStatut(StatutDemande.REFUSEE);
        demande.setValidePar(directeur);
        demande.setDateDecision(LocalDateTime.now());
        demande.setCommentaireRefus(motif);
        demandeRepository.save(demande);
    }

    private String genererMotDePasseTemp() {
        // Générer un mot de passe temporaire à envoyer par email
        return "LIAS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
