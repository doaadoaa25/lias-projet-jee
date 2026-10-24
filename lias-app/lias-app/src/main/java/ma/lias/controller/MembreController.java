package ma.lias.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.lias.dto.request.CreerMembreRequest;
import ma.lias.dto.response.MembreCreeResponse;
import ma.lias.entity.Membre;
import ma.lias.service.MembreService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/membres")
@RequiredArgsConstructor
public class MembreController {

    private final MembreService membreService;

    // Visible par tous les membres authentifiés
    @GetMapping
    public ResponseEntity<List<Membre>> getAllMembres() {
        return ResponseEntity.ok(membreService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Membre> getMembre(@PathVariable UUID id) {
        return ResponseEntity.ok(membreService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Membre>> search(@RequestParam String q) {
        return ResponseEntity.ok(membreService.search(q));
    }

    // ✅ Création manuelle d'un membre — Directeur et Vice-directeur seulement
    @PostMapping
    @PreAuthorize("hasAnyRole('DIRECTEUR', 'VICE_DIRECTEUR')")
    public ResponseEntity<MembreCreeResponse> creerMembre(@Valid @RequestBody CreerMembreRequest request) {
        return ResponseEntity.ok(membreService.creerMembre(request));
    }

    // Modification de son propre profil
    @PutMapping("/{id}")
    @PreAuthorize("authentication.name == @membreService.getById(#id).email or hasRole('DIRECTEUR')")
    public ResponseEntity<Membre> updateProfil(@PathVariable UUID id, @RequestBody Membre membre) {
        return ResponseEntity.ok(membreService.update(id, membre));
    }

    // Seul le directeur peut changer le statut
    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Membre> changerStatut(@PathVariable UUID id,
                                                 @RequestParam String statut) {
        return ResponseEntity.ok(membreService.changerStatut(id, statut));
    }

    // Geler / désactiver un compte
    @PatchMapping("/{id}/geler")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> gelerCompte(@PathVariable UUID id) {
        membreService.gelerCompte(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Suppression définitive — Directeur seulement
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> supprimerMembre(@PathVariable UUID id) {
        membreService.supprimerMembre(id);
        return ResponseEntity.noContent().build();
    }

    // Vue publique du labo
    @GetMapping("/public")
    public ResponseEntity<List<Membre>> getMembresPublic() {
        return ResponseEntity.ok(membreService.getMembresActifs());
    }
}
