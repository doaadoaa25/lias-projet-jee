package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.entity.Membre;
import ma.lias.entity.Publication;
import ma.lias.repository.PublicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PublicationService {

    private final PublicationRepository publicationRepository;
    private final AuthService authService;

    public List<Publication> getAll() {
        return publicationRepository.findAllByOrderByAnneeDesc();
    }

    public Publication getById(UUID id) {
        return publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication non trouvée : " + id));
    }

    public List<Publication> getByMembre(UUID membreId) {
        return publicationRepository.findByMembreIdOrderByAnneeDesc(membreId);
    }

    public List<Publication> getByEquipe(UUID equipeId) {
        return publicationRepository.findByEquipeIdOrderByAnneeDesc(equipeId);
    }

    public List<Publication> getByAnnee(Integer annee) {
        return publicationRepository.findByAnneeOrderByAnneeDesc(annee);
    }

    public List<Integer> getAnnees() {
        return publicationRepository.findDistinctAnnees();
    }

    public List<Publication> getMesPublications() {
        Membre current = authService.getCurrentUser();
        return publicationRepository.findByMembreIdOrderByAnneeDesc(current.getId());
    }

    public List<Publication> search(String q) {
        return publicationRepository.search(q);
    }

    public Publication ajouter(Publication publication) {
        // Affecter automatiquement le membre connecté
        Membre current = authService.getCurrentUser();
        publication.setMembre(current);
        return publicationRepository.save(publication);
    }

    public Publication modifier(UUID id, Publication updated) {
        Publication existing = getById(id);

        // Seul l'auteur ou le directeur peut modifier
        Membre current = authService.getCurrentUser();
        if (!existing.getMembre().getId().equals(current.getId())) {
            throw new RuntimeException("Vous ne pouvez modifier que vos propres publications");
        }

        existing.setTitre(updated.getTitre());
        existing.setResume(updated.getResume());
        existing.setUrl(updated.getUrl());
        existing.setType(updated.getType());
        existing.setAnnee(updated.getAnnee());
        return publicationRepository.save(existing);
    }

    public void supprimer(UUID id) {
        publicationRepository.deleteById(id);
    }

    // Stats pour le rapport annuel
    public long countByAnnee(Integer annee) {
        return publicationRepository.countByAnnee(annee);
    }
}
