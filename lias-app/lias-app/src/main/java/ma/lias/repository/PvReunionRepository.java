package ma.lias.repository;

import ma.lias.entity.PvReunion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PvReunionRepository extends JpaRepository<PvReunion, UUID> {
    List<PvReunion> findAllByOrderByDateReunionDesc();
    List<PvReunion> findByCreeParIdOrderByDateReunionDesc(UUID membreId);
}
