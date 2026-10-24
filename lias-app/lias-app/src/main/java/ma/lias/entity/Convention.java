package ma.lias.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "conventions")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Convention {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private String partenaire;      // nom de l'organisme partenaire

    private String typePartenaire;  // Université, Entreprise, ONG...

    private String pays;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate dateDebut;
    private LocalDate dateFin;      // null = en cours

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutConvention statut = StatutConvention.ACTIVE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "responsable_id")
    private Membre responsable;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum StatutConvention {
        ACTIVE, EXPIREE, EN_COURS_DE_RENOUVELLEMENT, SUSPENDUE
    }

    public boolean isEnCours() {
        return dateFin == null || dateFin.isAfter(LocalDate.now());
    }
}
