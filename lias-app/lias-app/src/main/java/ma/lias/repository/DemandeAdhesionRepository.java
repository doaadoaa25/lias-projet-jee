package ma.lias.repository;

import ma.lias.entity.DemandeAdhesion;
import ma.lias.enums.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DemandeAdhesionRepository extends JpaRepository<DemandeAdhesion, UUID> {
    List<DemandeAdhesion> findByStatut(StatutDemande statut);
    boolean existsByEmailAndStatut(String email, StatutDemande statut);
}
