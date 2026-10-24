package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Membre;
import ma.lias.entity.Notification;
import ma.lias.enums.RoleMandat;
import ma.lias.repository.MandatRepository;
import ma.lias.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final MandatRepository mandatRepository;

    public void notifierMembre(Membre membre, String message, String type) {
        Notification notif = Notification.builder()
                .destinataire(membre)
                .message(message)
                .type(type)
                .lu(false)
                .build();
        notificationRepository.save(notif);
    }

    public void notifierDirecteur(String message) {
        mandatRepository.findByTypeRoleAndActifTrue(RoleMandat.DIRECTEUR)
                .ifPresent(mandat -> notifierMembre(mandat.getMembre(), message, "ADHESION"));
    }

    public List<Notification> getMesNotifications(UUID membreId) {
        return notificationRepository.findByDestinataireIdOrderByCreatedAtDesc(membreId);
    }

    public long getNombreNonLues(UUID membreId) {
        return notificationRepository.countByDestinataireIdAndLuFalse(membreId);
    }

    public void marquerCommeLue(UUID notifId) {
        notificationRepository.findById(notifId).ifPresent(n -> {
            n.setLu(true);
            notificationRepository.save(n);
        });
    }
}
