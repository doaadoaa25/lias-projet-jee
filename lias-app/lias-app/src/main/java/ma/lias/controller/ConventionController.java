package ma.lias.controller;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Convention;
import ma.lias.service.ConventionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/conventions")
@RequiredArgsConstructor
public class ConventionController {

    private final ConventionService conventionService;

    @GetMapping
    public ResponseEntity<List<Convention>> getAll() {
        return ResponseEntity.ok(conventionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Convention> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(conventionService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Convention>> search(@RequestParam String q) {
        return ResponseEntity.ok(conventionService.search(q));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<Convention> creer(@RequestBody Convention convention) {
        return ResponseEntity.ok(conventionService.creer(convention));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<Convention> modifier(@PathVariable UUID id,
                                                @RequestBody Convention convention) {
        return ResponseEntity.ok(conventionService.modifier(id, convention));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> supprimer(@PathVariable UUID id) {
        conventionService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
