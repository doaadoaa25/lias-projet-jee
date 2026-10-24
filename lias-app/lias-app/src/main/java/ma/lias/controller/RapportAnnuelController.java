package ma.lias.controller;

import lombok.RequiredArgsConstructor;
import ma.lias.dto.response.RapportAnnuelDTO;
import ma.lias.entity.RapportAnnuel;
import ma.lias.service.RapportAnnuelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
@RequiredArgsConstructor
public class RapportAnnuelController {

    private final RapportAnnuelService rapportService;

    // Générer le rapport de l'année actuelle — directeur seulement
    @PostMapping("/generer")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<RapportAnnuelDTO> genererAnneeActuelle() {
        return ResponseEntity.ok(rapportService.genererAnneeActuelle());
    }

    // Générer le rapport d'une année précise
    @PostMapping("/generer/{annee}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<RapportAnnuelDTO> genererParAnnee(@PathVariable Integer annee) {
        return ResponseEntity.ok(rapportService.generer(annee));
    }

    // Consulter le rapport d'une année (tous les membres)
    @GetMapping("/{annee}")
    public ResponseEntity<RapportAnnuelDTO> getRapport(@PathVariable Integer annee) {
        return ResponseEntity.ok(rapportService.generer(annee));
    }

    // Historique de tous les rapports sauvegardés
    @GetMapping("/historique")
    public ResponseEntity<List<RapportAnnuel>> getHistorique() {
        return ResponseEntity.ok(rapportService.getHistorique());
    }

    // Rapport de l'année courante en lecture
    @GetMapping("/actuel")
    public ResponseEntity<RapportAnnuelDTO> getRapportActuel() {
        return ResponseEntity.ok(rapportService.genererAnneeActuelle());
    }
}
