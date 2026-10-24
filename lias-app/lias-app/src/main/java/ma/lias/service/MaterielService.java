package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Materiel;
import ma.lias.entity.Membre;
import ma.lias.entity.ReservationMateriel;
import ma.lias.entity.ReservationMateriel.StatutReservation;
import ma.lias.repository.MaterielRepository;
import ma.lias.repository.ReservationMaterielRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MaterielService {

    private final MaterielRepository materielRepository;
    private final ReservationMaterielRepository reservationRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    // ── MATÉRIEL ────────────────────────────────────────────

    public List<Materiel> getAll() {
        return materielRepository.findByActifTrue();
    }

    public Materiel getById(UUID id) {
        return materielRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matériel non trouvé : " + id));
    }

    public Materiel creer(Materiel materiel) {
        return materielRepository.save(materiel);
    }

    public Materiel modifier(UUID id, Materiel updated) {
        Materiel existing = getById(id);
        existing.setNom(updated.getNom());
        existing.setDescription(updated.getDescription());
        existing.setCategorie(updated.getCategorie());
        existing.setQuantiteTotal(updated.getQuantiteTotal());
        return materielRepository.save(existing);
    }

    public void supprimer(UUID id) {
        Materiel materiel = getById(id);
        materiel.setActif(false);
        materielRepository.save(materiel);
    }

    // Vérifier disponibilité d'un matériel
    public boolean estDisponible(UUID materielId, LocalDate dateDebut, LocalDate dateFin) {
        List<ReservationMateriel> conflits = reservationRepository.findConflits(materielId, dateDebut, dateFin);
        Materiel materiel = getById(materielId);
        return conflits.size() < materiel.getQuantiteTotal();
    }

    // Calendrier — réservations actives d'un matériel
    public List<ReservationMateriel> getCalendrier(UUID materielId) {
        return reservationRepository.findReservationsActives(materielId, LocalDate.now());
    }

    // ── RÉSERVATIONS ────────────────────────────────────────

    public List<ReservationMateriel> getMesReservations() {
        Membre current = authService.getCurrentUser();
        return reservationRepository.findByMembreIdOrderByDateDebutDesc(current.getId());
    }

    public List<ReservationMateriel> getDemandesEnAttente() {
        return reservationRepository.findByStatutOrderByDateDebutAsc(StatutReservation.EN_ATTENTE);
    }

    public List<ReservationMateriel> getToutesReservations() {
        return reservationRepository.findAll();
    }

    public ReservationMateriel demanderReservation(UUID materielId, LocalDate dateDebut,
                                                    LocalDate dateFin, String motif) {
        Materiel materiel = getById(materielId);
        Membre membre = authService.getCurrentUser();

        if (!estDisponible(materielId, dateDebut, dateFin)) {
            throw new RuntimeException("Ce matériel n'est pas disponible sur cette période");
        }

        if (dateDebut.isAfter(dateFin)) {
            throw new RuntimeException("La date de début doit être avant la date de fin");
        }

        if (dateDebut.isBefore(LocalDate.now())) {
            throw new RuntimeException("Impossible de réserver dans le passé");
        }

        ReservationMateriel reservation = ReservationMateriel.builder()
                .materiel(materiel)
                .membre(membre)
                .dateDebut(dateDebut)
                .dateFin(dateFin)
                .motif(motif)
                .statut(StatutReservation.EN_ATTENTE)
                .build();

        ReservationMateriel saved = reservationRepository.save(reservation);

        // Notifier le directeur
        notificationService.notifierDirecteur(
            membre.getNomComplet() + " demande : " + materiel.getNom() +
            " du " + dateDebut + " au " + dateFin
        );

        return saved;
    }

    public ReservationMateriel accepter(UUID reservationId) {
        ReservationMateriel reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        // Vérifier encore une fois la disponibilité
        if (!estDisponible(reservation.getMateriel().getId(),
                           reservation.getDateDebut(), reservation.getDateFin())) {
            throw new RuntimeException("Plus disponible sur cette période");
        }

        Membre directeur = authService.getCurrentUser();
        reservation.setStatut(StatutReservation.ACCEPTEE);
        reservation.setValidePar(directeur);
        return reservationRepository.save(reservation);
    }

    public ReservationMateriel refuser(UUID reservationId, String commentaire) {
        ReservationMateriel reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        Membre directeur = authService.getCurrentUser();
        reservation.setStatut(StatutReservation.REFUSEE);
        reservation.setValidePar(directeur);
        reservation.setCommentaireRefus(commentaire);
        return reservationRepository.save(reservation);
    }

    public void annuler(UUID reservationId) {
        ReservationMateriel reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        reservation.setStatut(StatutReservation.ANNULEE);
        reservationRepository.save(reservation);
    }
}
