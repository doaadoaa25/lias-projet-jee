package ma.lias.repository;

import ma.lias.entity.Mandat;
import ma.lias.enums.RoleMandat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MandatRepository extends JpaRepository<Mandat, UUID> {
    Optional<Mandat> findByTypeRoleAndActifTrue(RoleMandat typeRole);
    boolean existsByTypeRoleAndActifTrue(RoleMandat typeRole);
}
