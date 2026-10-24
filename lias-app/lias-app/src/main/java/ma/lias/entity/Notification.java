package ma.lias.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinataire_id", nullable = false)
    private Membre destinataire;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private String type;   // EVENEMENT, DEMANDE, DOCUMENT, etc.

    @Builder.Default
    private boolean lu = false;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
