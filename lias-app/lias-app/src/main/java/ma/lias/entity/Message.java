package ma.lias.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "expediteur_id", nullable = false)
    private Membre expediteur;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    // Canal : GENERAL, EQUIPE, EVENEMENT
    @Column(nullable = false)
    private String canal;

    // ID de l'équipe ou de l'événement si canal spécifique
    private UUID canalRefId;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
