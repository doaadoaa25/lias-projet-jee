package ma.lias.repository;

import ma.lias.entity.RapportAnnuel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RapportAnnuelRepository extends JpaRepository<RapportAnnuel, UUID> {
    Optional<RapportAnnuel> findByAnnee(Integer annee);
    boolean existsByAnnee(Integer annee);
    List<RapportAnnuel> findAllByOrderByAnneeDesc();
}
