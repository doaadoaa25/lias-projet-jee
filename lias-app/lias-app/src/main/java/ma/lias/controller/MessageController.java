package ma.lias.controller;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Message;
import ma.lias.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // Canal général — tous les membres
    @GetMapping("/general")
    public ResponseEntity<List<Message>> getGeneraux() {
        return ResponseEntity.ok(messageService.getMessagesGeneraux());
    }

    // Canal équipe
    @GetMapping("/equipe/{equipeId}")
    public ResponseEntity<List<Message>> getEquipe(@PathVariable UUID equipeId) {
        return ResponseEntity.ok(messageService.getMessagesEquipe(equipeId));
    }

    // Canal événement
    @GetMapping("/evenement/{evenementId}")
    public ResponseEntity<List<Message>> getEvenement(@PathVariable UUID evenementId) {
        return ResponseEntity.ok(messageService.getMessagesEvenement(evenementId));
    }

    // Envoyer un message
    @PostMapping
    public ResponseEntity<Message> envoyer(
            @RequestParam String contenu,
            @RequestParam(defaultValue = "GENERAL") String canal,
            @RequestParam(required = false) UUID canalRefId) {
        return ResponseEntity.ok(messageService.envoyer(contenu, canal, canalRefId));
    }

    // Supprimer son propre message
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable UUID id) {
        messageService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
