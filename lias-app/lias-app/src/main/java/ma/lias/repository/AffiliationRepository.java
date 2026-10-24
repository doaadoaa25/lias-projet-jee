package ma.lias.repository;

import ma.lias.entity.Affiliation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AffiliationRepository extends JpaRepository<Affiliation, UUID> {
    List<Affiliation> findByMembreId(UUID membreId);
    List<Affiliation> findByEquipeId(UUID equipeId);
    List<Affiliation> findByMembreIdAndDateFinIsNull(UUID membreId);
}
