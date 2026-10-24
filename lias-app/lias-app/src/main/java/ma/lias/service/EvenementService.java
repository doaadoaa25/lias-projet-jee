package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Evenement;
import ma.lias.entity.Membre;
import ma.lias.enums.TypeEvenement;
import ma.lias.repository.EvenementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EvenementService {

    private final EvenementRepository evenementRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    public List<Evenement> getAll() {
        return evenementRepository.findAllByOrderByDateDebutDesc();
    }

    public Evenement getById(UUID id) {
        return evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé : " + id));
    }

    public List<Evenement> getByType(TypeEvenement type) {
        return evenementRepository.findByTypeOrderByDateDebutDesc(type);
    }

    public List<Evenement> getByPeriode(LocalDate debut, LocalDate fin) {
        return evenementRepository.findByDateDebutBetweenOrderByDateDebutAsc(debut, fin);
    }

    public List<Evenement> getMesEvenements() {
        Membre current = authService.getCurrentUser();
        return evenementRepository.findByOrganisateurIdOrderByDateDebutDesc(current.getId());
    }

    public List<Evenement> search(String q) {
        return evenementRepository.search(q);
    }

    public Evenement creer(Evenement evenement) {
        // Affecter l'organisateur = membre connecté
        Membre organisateur = authService.getCurrentUser();
        evenement.setOrganisateur(organisateur);

        Evenement saved = evenementRepository.save(evenement);

        // Notifier le directeur
        notificationService.notifierDirecteur(
            "Nouvel événement créé : " + saved.getTitre() + " par " + organisateur.getNomComplet()
        );

        return saved;
    }

    public Evenement modifier(UUID id, Evenement updated) {
        Evenement existing = getById(id);
        existing.setTitre(updated.getTitre());
        existing.setType(updated.getType());
        existing.setDescription(updated.getDescription());
        existing.setDateDebut(updated.getDateDebut());
        existing.setDateFin(updated.getDateFin());
        existing.setLieu(updated.getLieu());
        return evenementRepository.save(existing);
    }

    public void supprimer(UUID id) {
        Evenement evenement = getById(id);
        evenementRepository.delete(evenement);
    }
}
