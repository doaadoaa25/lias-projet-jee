package ma.lias.entity;
 
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import ma.lias.enums.TypeEvenement;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
 
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
 
@Entity
@Table(name = "evenements")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evenement {
 
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
 
    @Column(nullable = false)
    private String titre;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeEvenement type;
 
    @Column(columnDefinition = "TEXT")
    private String description;
 
    @Column(nullable = false)
    private LocalDate dateDebut;
 
    private LocalDate dateFin;
 
    private String lieu;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organisateur_id")
    private Membre organisateur;
 
    @OneToMany(mappedBy = "evenement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Document> documents = new ArrayList<>();
 
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
