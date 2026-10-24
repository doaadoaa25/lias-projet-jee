package ma.lias.entity;
 
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
 
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
 
@Entity
@Table(name = "equipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipe {
 
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
 
    @Column(nullable = false, unique = true)
    private String nom;
 
    @Column(columnDefinition = "TEXT")
    private String description;
 
    @OneToMany(mappedBy = "equipe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Affiliation> affiliations = new ArrayList<>();
 
    @OneToMany(mappedBy = "equipe", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Publication> publications = new ArrayList<>();
}
