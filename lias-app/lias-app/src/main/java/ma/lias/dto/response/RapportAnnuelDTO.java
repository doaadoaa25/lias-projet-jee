package ma.lias.dto.response;

import lombok.Builder;
import lombok.Data;
import ma.lias.entity.Evenement;
import ma.lias.entity.Publication;

import java.util.List;

@Data
@Builder
public class RapportAnnuelDTO {

    private Integer annee;

    // ── Membres ──────────────────────────────
    private long totalMembres;
    private long totalPermanents;
    private long totalAssocies;
    private long totalDoctorants;

    // ── Publications ─────────────────────────
    private long totalPublications;
    private List<Publication> publications;

    // ── Événements ───────────────────────────
    private long totalEvenements;
    private long totalConferences;
    private long totalSeminaires;
    private long totalWorkshops;
    private List<Evenement> evenements;

    // ── Message résumé ───────────────────────
    private String resume;
}
