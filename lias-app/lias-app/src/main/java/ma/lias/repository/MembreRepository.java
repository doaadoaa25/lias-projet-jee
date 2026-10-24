package ma.lias.repository;

import ma.lias.entity.Membre;
import ma.lias.enums.StatutMembre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MembreRepository extends JpaRepository<Membre, UUID> {
    Optional<Membre> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Membre> findByStatut(StatutMembre statut);
    List<Membre> findByCompteActifTrue();

    @Query("SELECT m FROM Membre m WHERE LOWER(m.nom) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(m.prenom) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(m.email) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Membre> search(String q);
}
