package ma.lias.controller;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Document;
import ma.lias.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    // Tous les documents
    @GetMapping
    public ResponseEntity<List<Document>> getAll() {
        return ResponseEntity.ok(documentService.getAll());
    }

    // Documents d'un événement
    @GetMapping("/evenement/{evenementId}")
    public ResponseEntity<List<Document>> getByEvenement(@PathVariable UUID evenementId) {
        return ResponseEntity.ok(documentService.getByEvenement(evenementId));
    }

    // Upload un document lié à un événement
    @PostMapping("/upload/{evenementId}")
    @PreAuthorize("hasAnyRole('PERMANENT', 'DIRECTEUR')")
    public ResponseEntity<Document> upload(
            @PathVariable UUID evenementId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "AUTRE") String type) {
        return ResponseEntity.ok(documentService.upload(evenementId, file, type));
    }

    // Télécharger un document
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable UUID id) {
        Resource resource = documentService.download(id);
        Document doc = documentService.getById(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + doc.getNom() + "\"")
                .body(resource);
    }

    // Supprimer un document
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTEUR')")
    public ResponseEntity<Void> supprimer(@PathVariable UUID id) {
        documentService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
