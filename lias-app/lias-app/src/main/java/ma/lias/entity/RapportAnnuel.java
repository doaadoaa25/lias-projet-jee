package ma.lias.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rapports_annuels")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RapportAnnuel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private Integer annee;

    // Statistiques sauvegardées
    private long nombreMembres;
    private long nombrePublications;
    private long nombreEvenements;
    private long nombreDoctorants;
    private long nombreConferences;
    private long nombreSeminaires;
    private long nombreWorkshops;

    private String urlPdf;   // si on génère un PDF

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime genereLE;
}
