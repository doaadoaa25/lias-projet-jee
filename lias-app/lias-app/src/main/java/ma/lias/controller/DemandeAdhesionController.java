package ma.lias.controller;

import ma.lias.entity.Membre;
import lombok.RequiredArgsConstructor;
import ma.lias.entity.DemandeAdhesion;
import ma.lias.service.DemandeAdhesionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/adhesions")
@RequiredArgsConstructor
public class DemandeAdhesionController {

    private final DemandeAdhesionService demandeService;

    // Public : soumission d'une demande
    @PostMapping("/soumettre")
    public ResponseEntity<DemandeAdhesion> soumettre(@RequestBody DemandeAdhesion demande) {
        return ResponseEntity.ok(demandeService.soumettre(demande));
    }

    // Directeur : voir toutes les demandes en attente
    @GetMapping
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<List<DemandeAdhesion>> getAll() {
        return ResponseEntity.ok(demandeService.getAll());
    }

    // Directeur : accepter une demande
    @PostMapping("/{id}/accepter")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Membre> accepter(@PathVariable UUID id) {
        return ResponseEntity.ok(demandeService.accepter(id));
    }

    // Directeur : refuser une demande
    @PostMapping("/{id}/refuser")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> refuser(@PathVariable UUID id,
                                         @RequestParam String motif) {
        demandeService.refuser(id, motif);
        return ResponseEntity.noContent().build();
    }
}
