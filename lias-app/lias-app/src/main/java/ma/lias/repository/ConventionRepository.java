package ma.lias.repository;

import ma.lias.entity.Convention;
import ma.lias.entity.Convention.StatutConvention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConventionRepository extends JpaRepository<Convention, UUID> {
    List<Convention> findByStatutOrderByDateDebutDesc(StatutConvention statut);
    List<Convention> findAllByOrderByDateDebutDesc();

    @Query("SELECT c FROM Convention c WHERE LOWER(c.titre) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(c.partenaire) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Convention> search(String q);
}
