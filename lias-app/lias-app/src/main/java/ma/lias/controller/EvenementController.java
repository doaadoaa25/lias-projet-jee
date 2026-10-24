package ma.lias.controller;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Evenement;
import ma.lias.enums.TypeEvenement;
import ma.lias.service.EvenementService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/evenements")
@RequiredArgsConstructor
public class EvenementController {

    private final EvenementService evenementService;

    // ✅ PUBLIC — tout le monde peut voir les événements
    @GetMapping("/public")
    public ResponseEntity<List<Evenement>> getEvenementsPublic() {
        return ResponseEntity.ok(evenementService.getAll());
    }

    // ✅ Tous les membres authentifiés
    @GetMapping
    public ResponseEntity<List<Evenement>> getAll() {
        return ResponseEntity.ok(evenementService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evenement> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(evenementService.getById(id));
    }

    // Filtrer par type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Evenement>> getByType(@PathVariable TypeEvenement type) {
        return ResponseEntity.ok(evenementService.getByType(type));
    }

    // Filtrer par période (pour le calendrier)
    @GetMapping("/calendrier")
    public ResponseEntity<List<Evenement>> getByPeriode(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(evenementService.getByPeriode(debut, fin));
    }

    // Mes événements organisés
    @GetMapping("/mes-evenements")
    public ResponseEntity<List<Evenement>> getMesEvenements() {
        return ResponseEntity.ok(evenementService.getMesEvenements());
    }

    // ✅ Créer un événement — membres permanents et directeur
    @PostMapping
    @PreAuthorize("hasAnyRole('PERMANENT', 'DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<Evenement> creer(@RequestBody Evenement evenement) {
        return ResponseEntity.ok(evenementService.creer(evenement));
    }

    // ✅ Modifier un événement
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PERMANENT', 'DIRECTEUR')")
    public ResponseEntity<Evenement> modifier(@PathVariable UUID id,
                                               @RequestBody Evenement evenement) {
        return ResponseEntity.ok(evenementService.modifier(id, evenement));
    }

    // ✅ Supprimer — directeur seulement
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> supprimer(@PathVariable UUID id) {
        evenementService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    // Recherche par titre
    @GetMapping("/search")
    public ResponseEntity<List<Evenement>> search(@RequestParam String q) {
        return ResponseEntity.ok(evenementService.search(q));
    }
}
