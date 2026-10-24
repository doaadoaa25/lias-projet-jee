package ma.lias.repository;

import ma.lias.entity.ReservationMateriel;
import ma.lias.entity.ReservationMateriel.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationMaterielRepository extends JpaRepository<ReservationMateriel, UUID> {

    List<ReservationMateriel> findByMembreIdOrderByDateDebutDesc(UUID membreId);
    List<ReservationMateriel> findByStatutOrderByDateDebutAsc(StatutReservation statut);
    List<ReservationMateriel> findByMaterielIdOrderByDateDebutAsc(UUID materielId);

    // Vérifier si un matériel est disponible sur une période
    @Query("SELECT r FROM ReservationMateriel r WHERE r.materiel.id = :materielId " +
           "AND r.statut = 'ACCEPTEE' " +
           "AND r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut")
    List<ReservationMateriel> findConflits(UUID materielId, LocalDate dateDebut, LocalDate dateFin);

    // Toutes les réservations actives d'un matériel (pour le calendrier)
    @Query("SELECT r FROM ReservationMateriel r WHERE r.materiel.id = :materielId " +
           "AND r.statut IN ('ACCEPTEE', 'EN_ATTENTE') " +
           "AND r.dateFin >= :today ORDER BY r.dateDebut ASC")
    List<ReservationMateriel> findReservationsActives(UUID materielId, LocalDate today);
}
