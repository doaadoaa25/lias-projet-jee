package ma.lias.service;

import lombok.RequiredArgsConstructor;
import ma.lias.dto.response.RapportAnnuelDTO;
import ma.lias.entity.Evenement;
import ma.lias.entity.Publication;
import ma.lias.entity.RapportAnnuel;
import ma.lias.enums.StatutMembre;
import ma.lias.enums.TypeEvenement;
import ma.lias.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RapportAnnuelService {

    private final RapportAnnuelRepository rapportRepository;
    private final MembreRepository membreRepository;
    private final PublicationRepository publicationRepository;
    private final EvenementRepository evenementRepository;

    // Générer le rapport pour une année donnée
    public RapportAnnuelDTO generer(Integer annee) {

        // ── Données membres ──────────────────────────────
        long totalMembres    = membreRepository.findByCompteActifTrue().size();
        long totalPermanents = membreRepository.findByStatut(StatutMembre.PERMANENT).size();
        long totalAssocies   = membreRepository.findByStatut(StatutMembre.ASSOCIE).size();
        long totalDoctorants = membreRepository.findByStatut(StatutMembre.DOCTORANT).size();

        // ── Données publications ─────────────────────────
        List<Publication> publications = publicationRepository.findByAnneeOrderByAnneeDesc(annee);
        long totalPublications = publications.size();

        // ── Données événements ───────────────────────────
        LocalDate debut = LocalDate.of(annee, 1, 1);
        LocalDate fin   = LocalDate.of(annee, 12, 31);
        List<Evenement> evenements = evenementRepository
                .findByDateDebutBetweenOrderByDateDebutAsc(debut, fin);

        long totalConferences = evenements.stream()
                .filter(e -> e.getType() == TypeEvenement.CONFERENCE).count();
        long totalSeminaires  = evenements.stream()
                .filter(e -> e.getType() == TypeEvenement.SEMINAIRE).count();
        long totalWorkshops   = evenements.stream()
                .filter(e -> e.getType() == TypeEvenement.WORKSHOP).count();

        // ── Sauvegarder en base ──────────────────────────
        sauvegarderRapport(annee, totalMembres, totalPublications,
                           evenements.size(), totalDoctorants,
                           totalConferences, totalSeminaires, totalWorkshops);

        // ── Construire le résumé texte ───────────────────
        String resume = String.format(
            "Rapport d'activité %d du laboratoire LIAS — " +
            "%d membres actifs dont %d doctorants, " +
            "%d publications, " +
            "%d événements (%d conférences, %d séminaires, %d workshops).",
            annee, totalMembres, totalDoctorants,
            totalPublications,
            evenements.size(), totalConferences, totalSeminaires, totalWorkshops
        );

        return RapportAnnuelDTO.builder()
                .annee(annee)
                .totalMembres(totalMembres)
                .totalPermanents(totalPermanents)
                .totalAssocies(totalAssocies)
                .totalDoctorants(totalDoctorants)
                .totalPublications(totalPublications)
                .publications(publications)
                .totalEvenements(evenements.size())
                .totalConferences(totalConferences)
                .totalSeminaires(totalSeminaires)
                .totalWorkshops(totalWorkshops)
                .evenements(evenements)
                .resume(resume)
                .build();
    }

    // Rapport de l'année courante
    public RapportAnnuelDTO genererAnneeActuelle() {
        return generer(LocalDate.now().getYear());
    }

    // Historique de tous les rapports
    public List<RapportAnnuel> getHistorique() {
        return rapportRepository.findAllByOrderByAnneeDesc();
    }

    // Récupérer un rapport sauvegardé
    public RapportAnnuel getRapportByAnnee(Integer annee) {
        return rapportRepository.findByAnnee(annee)
                .orElseThrow(() -> new RuntimeException("Rapport non trouvé pour l'année : " + annee));
    }

    // Sauvegarder les stats en base
    private void sauvegarderRapport(Integer annee, long membres, long publications,
                                     long evenements, long doctorants,
                                     long conferences, long seminaires, long workshops) {
        RapportAnnuel rapport;

        if (rapportRepository.existsByAnnee(annee)) {
            // Mettre à jour si déjà existe
            rapport = rapportRepository.findByAnnee(annee).get();
        } else {
            rapport = RapportAnnuel.builder().annee(annee).build();
        }

        rapport.setNombreMembres(membres);
        rapport.setNombrePublications(publications);
        rapport.setNombreEvenements(evenements);
        rapport.setNombreDoctorants(doctorants);
        rapport.setNombreConferences(conferences);
        rapport.setNombreSeminaires(seminaires);
        rapport.setNombreWorkshops(workshops);

        rapportRepository.save(rapport);
    }
}
