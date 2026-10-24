package ma.lias.controller;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.PvReunion;
import ma.lias.service.PvReunionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pv-reunions")
@RequiredArgsConstructor
public class PvReunionController {

    private final PvReunionService pvService;

    @GetMapping
    public ResponseEntity<List<PvReunion>> getAll() {
        return ResponseEntity.ok(pvService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PvReunion> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(pvService.getById(id));
    }

    // Créer une réunion avec ordre du jour
    @PostMapping
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<PvReunion> creer(
            @RequestParam String titre,
            @RequestParam String ordreDuJour,
            @RequestParam String dateReunion) {
        return ResponseEntity.ok(pvService.creer(titre, ordreDuJour, LocalDate.parse(dateReunion)));
    }

    // Uploader le PV d'une réunion
    @PostMapping("/{id}/upload-pv")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<PvReunion> uploadPv(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(pvService.uploadPv(id, file));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> supprimer(@PathVariable UUID id) {
        pvService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
