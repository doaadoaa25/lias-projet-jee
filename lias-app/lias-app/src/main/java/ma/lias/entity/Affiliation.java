package ma.lias.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.lias.enums.RoleMandat;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "affiliations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Affiliation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membre_id", nullable = false)
    private Membre membre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipe_id", nullable = false)
    private Equipe equipe;

    @Column(nullable = false)
    private LocalDate dateDebut;

    private LocalDate dateFin;   // null = affiliation en cours

    @Enumerated(EnumType.STRING)
    private RoleMandat role;

    public boolean isActive() {
        return dateFin == null;
    }
}
