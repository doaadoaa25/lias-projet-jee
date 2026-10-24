package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.dto.request.CreerMembreRequest;
import ma.lias.dto.response.MembreCreeResponse;
import ma.lias.entity.Affiliation;
import ma.lias.entity.Equipe;
import ma.lias.entity.Membre;
import ma.lias.enums.RoleMandat;
import ma.lias.enums.StatutMembre;
import ma.lias.repository.AffiliationRepository;
import ma.lias.repository.EquipeRepository;
import ma.lias.repository.MembreRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MembreService {

    private final MembreRepository membreRepository;
    private final EquipeRepository equipeRepository;
    private final AffiliationRepository affiliationRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public List<Membre> getAll() {
        return membreRepository.findAll();
    }

    public Membre getById(UUID id) {
        return membreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membre non trouvé : " + id));
    }

    public List<Membre> getMembresActifs() {
        return membreRepository.findByCompteActifTrue();
    }

    public List<Membre> search(String q) {
        return membreRepository.search(q);
    }

    public Membre update(UUID id, Membre updated) {
        Membre existing = getById(id);
        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setBiographie(updated.getBiographie());
        existing.setCentresInteret(updated.getCentresInteret());
        existing.setPhotoUrl(updated.getPhotoUrl());
        existing.setEtablissementOrigine(updated.getEtablissementOrigine());
        return membreRepository.save(existing);
    }

    public Membre changerStatut(UUID id, String statut) {
        Membre membre = getById(id);
        membre.setStatut(StatutMembre.valueOf(statut));

        if (statut.equals("RETRAITE")) {
            membre.setCompteGele(true);
        } else if (statut.equals("ANCIEN_MEMBRE")) {
            membre.setCompteActif(false);
        }

        return membreRepository.save(membre);
    }

    public void gelerCompte(UUID id) {
        Membre membre = getById(id);
        membre.setCompteGele(true);
        membreRepository.save(membre);
    }

    public void desactiverCompte(UUID id) {
        Membre membre = getById(id);
        membre.setCompteActif(false);
        membreRepository.save(membre);
    }

    // ══════════════════════════════════════════════════════════
    // CRÉATION D'UN MEMBRE PAR LE DIRECTEUR
    // ══════════════════════════════════════════════════════════

    public MembreCreeResponse creerMembre(CreerMembreRequest request) {
        if (membreRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Un membre avec cet email existe déjà");
        }

        // Génération d'un mot de passe temporaire sécurisé
        String motDePasseTemp = genererMotDePasse();

        Membre membre = Membre.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(motDePasseTemp))
                .statut(request.getStatut() != null ? request.getStatut() : StatutMembre.PERMANENT)
                .etablissementOrigine(request.getEtablissementOrigine())
                .laboratoireOrigine(request.getLaboratoireOrigine())
                .biographie(request.getBiographie())
                .compteActif(true)
                .compteGele(false)
                .build();

        Membre saved = membreRepository.save(membre);

        // Affecter à une équipe si précisé
        if (request.getEquipeId() != null) {
            Equipe equipe = equipeRepository.findById(request.getEquipeId())
                    .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));

            Affiliation affiliation = Affiliation.builder()
                    .membre(saved)
                    .equipe(equipe)
                    .dateDebut(LocalDate.now())
                    .role(RoleMandat.MEMBRE)
                    .build();
            affiliationRepository.save(affiliation);
        }

        // Notifier le directeur (confirmation)
        notificationService.notifierDirecteur(
            "Nouveau membre ajouté : " + saved.getPrenom() + " " + saved.getNom()
        );

        return MembreCreeResponse.builder()
                .membre(saved)
                .motDePasseTemporaire(motDePasseTemp)
                .build();
    }

    public void supprimerMembre(UUID id) {
        Membre membre = getById(id);
        membreRepository.delete(membre);
    }

    // Génère un mot de passe lisible mais sécurisé, ex: "Lk8#mP2xTr"
    private String genererMotDePasse() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
