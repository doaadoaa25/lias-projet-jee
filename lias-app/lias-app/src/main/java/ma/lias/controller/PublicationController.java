package ma.lias.controller;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Publication;
import ma.lias.service.PublicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/publications")
@RequiredArgsConstructor
public class PublicationController {

    private final PublicationService publicationService;

    // ✅ PUBLIC — tout le monde peut voir les publications
    @GetMapping("/public")
    public ResponseEntity<List<Publication>> getPublic() {
        return ResponseEntity.ok(publicationService.getAll());
    }

    // Tous les membres authentifiés
    @GetMapping
    public ResponseEntity<List<Publication>> getAll() {
        return ResponseEntity.ok(publicationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publication> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(publicationService.getById(id));
    }

    // Mes publications
    @GetMapping("/mes-publications")
    public ResponseEntity<List<Publication>> getMesPublications() {
        return ResponseEntity.ok(publicationService.getMesPublications());
    }

    // Par membre
    @GetMapping("/membre/{membreId}")
    public ResponseEntity<List<Publication>> getByMembre(@PathVariable UUID membreId) {
        return ResponseEntity.ok(publicationService.getByMembre(membreId));
    }

    // Par équipe
    @GetMapping("/equipe/{equipeId}")
    public ResponseEntity<List<Publication>> getByEquipe(@PathVariable UUID equipeId) {
        return ResponseEntity.ok(publicationService.getByEquipe(equipeId));
    }

    // Par année
    @GetMapping("/annee/{annee}")
    public ResponseEntity<List<Publication>> getByAnnee(@PathVariable Integer annee) {
        return ResponseEntity.ok(publicationService.getByAnnee(annee));
    }

    // Liste des années disponibles
    @GetMapping("/annees")
    public ResponseEntity<List<Integer>> getAnnees() {
        return ResponseEntity.ok(publicationService.getAnnees());
    }

    // Recherche
    @GetMapping("/search")
    public ResponseEntity<List<Publication>> search(@RequestParam String q) {
        return ResponseEntity.ok(publicationService.search(q));
    }

    // ✅ Ajouter — membres ET doctorants peuvent ajouter
    @PostMapping
    @PreAuthorize("hasAnyRole('PERMANENT', 'ASSOCIE', 'DOCTORANT', 'DIRECTEUR')")
    public ResponseEntity<Publication> ajouter(@RequestBody Publication publication) {
        return ResponseEntity.ok(publicationService.ajouter(publication));
    }

    // Modifier — seulement l'auteur
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PERMANENT', 'ASSOCIE', 'DOCTORANT', 'DIRECTEUR')")
    public ResponseEntity<Publication> modifier(@PathVariable UUID id,
                                                 @RequestBody Publication publication) {
        return ResponseEntity.ok(publicationService.modifier(id, publication));
    }

    // Supprimer — directeur seulement
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> supprimer(@PathVariable UUID id) {
        publicationService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
