package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Convention;
import ma.lias.entity.Membre;
import ma.lias.repository.ConventionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ConventionService {

    private final ConventionRepository conventionRepository;
    private final AuthService authService;

    public List<Convention> getAll() {
        return conventionRepository.findAllByOrderByDateDebutDesc();
    }

    public Convention getById(UUID id) {
        return conventionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Convention non trouvée : " + id));
    }

    public List<Convention> search(String q) {
        return conventionRepository.search(q);
    }

    public Convention creer(Convention convention) {
        Membre responsable = authService.getCurrentUser();
        convention.setResponsable(responsable);
        return conventionRepository.save(convention);
    }

    public Convention modifier(UUID id, Convention updated) {
        Convention existing = getById(id);
        existing.setTitre(updated.getTitre());
        existing.setPartenaire(updated.getPartenaire());
        existing.setTypePartenaire(updated.getTypePartenaire());
        existing.setPays(updated.getPays());
        existing.setDescription(updated.getDescription());
        existing.setDateDebut(updated.getDateDebut());
        existing.setDateFin(updated.getDateFin());
        existing.setStatut(updated.getStatut());
        return conventionRepository.save(existing);
    }

    public void supprimer(UUID id) {
        conventionRepository.deleteById(id);
    }
}
