package ma.lias.entity;
 
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import ma.lias.enums.StatutMembre;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
 
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
 
@Entity
@Table(name = "membres")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membre {
 
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
 
    @Column(nullable = false)
    private String nom;
 
    @Column(nullable = false)
    private String prenom;
 
    @Column(nullable = false, unique = true)
    private String email;
 
    @Column(nullable = false)
    @JsonIgnore
    private String motDePasse;
 
    private String photoUrl;
 
    @Column(columnDefinition = "TEXT")
    private String biographie;
 
    @Column(columnDefinition = "TEXT")
    private String centresInteret;
 
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;   // confidentielle
 
    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;
 
    private String etablissementOrigine;
    private String laboratoireOrigine;
 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutMembre statut;
 
    @Column(nullable = false)
    @Builder.Default
    private boolean compteActif = true;
 
    @Column(nullable = false)
    @Builder.Default
    private boolean compteGele = false;
 
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
 
    @LastModifiedDate
    private LocalDateTime updatedAt;
 
    // Relations
    @OneToMany(mappedBy = "membre", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Affiliation> affiliations = new ArrayList<>();
 
    @OneToMany(mappedBy = "membre", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Mandat> mandats = new ArrayList<>();
 
    @OneToMany(mappedBy = "membre", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Publication> publications = new ArrayList<>();
 
    // Méthode utilitaire
    public String getNomComplet() {
        return prenom + " " + nom;
    }
 
    public boolean isActive() {
        return compteActif && !compteGele;
    }
}
