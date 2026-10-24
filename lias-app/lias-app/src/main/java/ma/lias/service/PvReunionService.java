package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Membre;
import ma.lias.entity.PvReunion;
import ma.lias.repository.PvReunionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PvReunionService {

    private final PvReunionRepository pvRepository;
    private final AuthService authService;

    @Value("${app.upload.dir:./uploads/}")
    private String uploadDir;

    public List<PvReunion> getAll() {
        return pvRepository.findAllByOrderByDateReunionDesc();
    }

    public PvReunion getById(UUID id) {
        return pvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PV non trouvé : " + id));
    }

    public PvReunion creer(String titre, String ordreDuJour, LocalDate dateReunion) {
        Membre creePar = authService.getCurrentUser();
        PvReunion pv = PvReunion.builder()
                .titre(titre)
                .ordreDuJour(ordreDuJour)
                .dateReunion(dateReunion)
                .creePar(creePar)
                .build();
        return pvRepository.save(pv);
    }

    public PvReunion uploadPv(UUID id, MultipartFile file) {
        PvReunion pv = getById(id);
        try {
            Path uploadPath = Paths.get(uploadDir + "pv/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String nomFichier = "pv_" + UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(nomFichier);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            pv.setPvUrl("pv/" + nomFichier);
            return pvRepository.save(pv);
        } catch (IOException e) {
            throw new RuntimeException("Erreur upload PV : " + e.getMessage());
        }
    }

    public void supprimer(UUID id) {
        pvRepository.deleteById(id);
    }
}
