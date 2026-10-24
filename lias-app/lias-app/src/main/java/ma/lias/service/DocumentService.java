package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Document;
import ma.lias.entity.Evenement;
import ma.lias.entity.Membre;
import ma.lias.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final EvenementService evenementService;
    private final AuthService authService;

    @Value("${app.upload.dir:./uploads/}")
    private String uploadDir;

    public List<Document> getAll() {
        return documentRepository.findAll();
    }

    public Document getById(UUID id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé : " + id));
    }

    public List<Document> getByEvenement(UUID evenementId) {
        return documentRepository.findByEvenementIdOrderByCreatedAtDesc(evenementId);
    }

    public Document upload(UUID evenementId, MultipartFile file, String type) {
        Evenement evenement = evenementService.getById(evenementId);
        Membre uploadedBy = authService.getCurrentUser();

        // Créer le dossier uploads s'il n'existe pas
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Nom unique pour éviter les conflits
            String nomFichier = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(nomFichier);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Document document = Document.builder()
                    .nom(file.getOriginalFilename())
                    .type(type)
                    .url(nomFichier)
                    .evenement(evenement)
                    .uploadedBy(uploadedBy)
                    .build();

            return documentRepository.save(document);

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'upload du fichier : " + e.getMessage());
        }
    }

    public Resource download(UUID id) {
        Document document = getById(id);
        try {
            Path filePath = Paths.get(uploadDir).resolve(document.getUrl());
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            }
            throw new RuntimeException("Fichier non trouvé sur le serveur");
        } catch (MalformedURLException e) {
            throw new RuntimeException("Erreur lors du téléchargement : " + e.getMessage());
        }
    }

    public void supprimer(UUID id) {
        Document document = getById(id);
        // Supprimer le fichier physique
        try {
            Path filePath = Paths.get(uploadDir).resolve(document.getUrl());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log l'erreur mais continue
        }
        documentRepository.delete(document);
    }
}
