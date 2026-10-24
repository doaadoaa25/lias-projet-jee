package ma.lias.repository;

import ma.lias.entity.Materiel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MaterielRepository extends JpaRepository<Materiel, UUID> {
    List<Materiel> findByActifTrue();
    List<Materiel> findByCategorie(String categorie);
}
