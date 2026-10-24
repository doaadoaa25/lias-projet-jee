package ma.lias.repository;

import ma.lias.entity.Evenement;
import ma.lias.enums.TypeEvenement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface EvenementRepository extends JpaRepository<Evenement, UUID> {

    List<Evenement> findByTypeOrderByDateDebutDesc(TypeEvenement type);

    List<Evenement> findByDateDebutBetweenOrderByDateDebutAsc(LocalDate debut, LocalDate fin);

    List<Evenement> findByOrganisateurIdOrderByDateDebutDesc(UUID organisateurId);

    @Query("SELECT e FROM Evenement e WHERE LOWER(e.titre) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(e.description) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Evenement> search(String q);

    List<Evenement> findAllByOrderByDateDebutDesc();
}
