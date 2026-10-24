package ma.lias.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.lias.enums.RoleMandat;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "mandats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mandat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membre_id", nullable = false)
    private Membre membre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleMandat typeRole;

    @Column(nullable = false)
    private LocalDate dateDebut;

    private LocalDate dateFin;   // null = mandat en cours

    @Builder.Default
    private boolean actif = true;

    public boolean isEnCours() {
        return actif && dateFin == null;
    }
}
