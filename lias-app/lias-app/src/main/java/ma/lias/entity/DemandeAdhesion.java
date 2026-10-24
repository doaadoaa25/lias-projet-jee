package ma.lias.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.lias.enums.StatutDemande;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "demandes_adhesion")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeAdhesion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String motivation;

    private String cvUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutDemande statut = StatutDemande.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "valide_par")
    private Membre validePar;   // directeur qui a traité la demande

    private LocalDateTime dateDecision;

    private String commentaireRefus;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
