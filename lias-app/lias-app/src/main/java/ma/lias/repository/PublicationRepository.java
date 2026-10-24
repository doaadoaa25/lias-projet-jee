package ma.lias.repository;

import ma.lias.entity.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, UUID> {
    List<Publication> findByMembreIdOrderByAnneeDesc(UUID membreId);
    List<Publication> findByEquipeIdOrderByAnneeDesc(UUID equipeId);
    List<Publication> findByAnneeOrderByAnneeDesc(Integer annee);
    List<Publication> findAllByOrderByAnneeDesc();

    @Query("SELECT DISTINCT p.annee FROM Publication p ORDER BY p.annee DESC")
    List<Integer> findDistinctAnnees();

    @Query("SELECT p FROM Publication p WHERE LOWER(p.titre) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(p.resume) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Publication> search(String q);

    @Query("SELECT COUNT(p) FROM Publication p WHERE p.annee = :annee")
    long countByAnnee(Integer annee);
}
