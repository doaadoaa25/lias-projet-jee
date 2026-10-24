package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Message;
import ma.lias.entity.Membre;
import ma.lias.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final AuthService authService;

    // Messages du canal général
    public List<Message> getMessagesGeneraux() {
        return messageRepository.findByCanalOrderByCreatedAtAsc("GENERAL");
    }

    // Messages d'une équipe
    public List<Message> getMessagesEquipe(UUID equipeId) {
        return messageRepository.findByCanalAndCanalRefIdOrderByCreatedAtAsc("EQUIPE", equipeId);
    }

    // Messages d'un événement
    public List<Message> getMessagesEvenement(UUID evenementId) {
        return messageRepository.findByCanalAndCanalRefIdOrderByCreatedAtAsc("EVENEMENT", evenementId);
    }

    // Envoyer un message
    public Message envoyer(String contenu, String canal, UUID canalRefId) {
        Membre expediteur = authService.getCurrentUser();
        Message message = Message.builder()
                .expediteur(expediteur)
                .contenu(contenu)
                .canal(canal)
                .canalRefId(canalRefId)
                .build();
        return messageRepository.save(message);
    }

    public void supprimer(UUID id) {
        messageRepository.deleteById(id);
    }
}
