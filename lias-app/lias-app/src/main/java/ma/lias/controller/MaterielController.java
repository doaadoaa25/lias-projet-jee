package ma.lias.controller;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Materiel;
import ma.lias.entity.ReservationMateriel;
import ma.lias.service.MaterielService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/materiels")
@RequiredArgsConstructor
public class MaterielController {

    private final MaterielService materielService;

    // ── MATÉRIEL ────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<Materiel>> getAll() {
        return ResponseEntity.ok(materielService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Materiel> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(materielService.getById(id));
    }

    // Vérifier disponibilité
    @GetMapping("/{id}/disponibilite")
    public ResponseEntity<Map<String, Object>> verifierDisponibilite(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {
        boolean dispo = materielService.estDisponible(id, dateDebut, dateFin);
        return ResponseEntity.ok(Map.of(
            "disponible", dispo,
            "dateDebut", dateDebut.toString(),
            "dateFin", dateFin.toString()
        ));
    }

    // Calendrier des réservations d'un matériel
    @GetMapping("/{id}/calendrier")
    public ResponseEntity<List<ReservationMateriel>> getCalendrier(@PathVariable UUID id) {
        return ResponseEntity.ok(materielService.getCalendrier(id));
    }

    // Directeur : CRUD matériel
    @PostMapping
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Materiel> creer(@RequestBody Materiel materiel) {
        return ResponseEntity.ok(materielService.creer(materiel));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Materiel> modifier(@PathVariable UUID id, @RequestBody Materiel materiel) {
        return ResponseEntity.ok(materielService.modifier(id, materiel));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> supprimer(@PathVariable UUID id) {
        materielService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    // ── RÉSERVATIONS ────────────────────────────────────────

    // Mes réservations
    @GetMapping("/reservations/mes")
    public ResponseEntity<List<ReservationMateriel>> getMesReservations() {
        return ResponseEntity.ok(materielService.getMesReservations());
    }

    // Directeur : voir toutes les demandes en attente
    @GetMapping("/reservations/en-attente")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<List<ReservationMateriel>> getDemandesEnAttente() {
        return ResponseEntity.ok(materielService.getDemandesEnAttente());
    }

    // Toutes les réservations
    @GetMapping("/reservations")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<List<ReservationMateriel>> getToutesReservations() {
        return ResponseEntity.ok(materielService.getToutesReservations());
    }

    // Demander une réservation
    @PostMapping("/{id}/reserver")
    public ResponseEntity<ReservationMateriel> reserver(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false) String motif) {
        return ResponseEntity.ok(materielService.demanderReservation(id, dateDebut, dateFin, motif));
    }

    // Directeur : accepter une réservation
    @PostMapping("/reservations/{id}/accepter")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<ReservationMateriel> accepter(@PathVariable UUID id) {
        return ResponseEntity.ok(materielService.accepter(id));
    }

    // Directeur : refuser une réservation
    @PostMapping("/reservations/{id}/refuser")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<ReservationMateriel> refuser(@PathVariable UUID id,
                                                        @RequestParam String commentaire) {
        return ResponseEntity.ok(materielService.refuser(id, commentaire));
    }

    // Annuler ma propre réservation
    @PostMapping("/reservations/{id}/annuler")
    public ResponseEntity<Void> annuler(@PathVariable UUID id) {
        materielService.annuler(id);
        return ResponseEntity.noContent().build();
    }
}
