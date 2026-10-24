package ma.lias.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.lias.entity.*;
import ma.lias.enums.RoleMandat;
import ma.lias.enums.StatutMembre;
import ma.lias.enums.TypeEvenement;
import ma.lias.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final MembreRepository membreRepository;
    private final MandatRepository mandatRepository;
    private final EquipeRepository equipeRepository;
    private final AffiliationRepository affiliationRepository;
    private final PublicationRepository publicationRepository;
    private final EvenementRepository evenementRepository;
    private final PasswordEncoder passwordEncoder;

    // Mot de passe par défaut pour tous les comptes générés
    private static final String DEFAULT_PASSWORD = "lias2026";

    @Override
    public void run(String... args) {
        if (membreRepository.count() > 0) {
            log.info("Données déjà présentes, initialisation ignorée.");
            return;
        }

        log.info("Initialisation des données réelles du laboratoire LIAS...");

        // ── 1. ÉQUIPES ──────────────────────────────────────────
        Equipe isdiac = creerEquipe("ISDIAC", "Ingénierie des Systèmes de Données, IA et Cloud");
        Equipe sima   = creerEquipe("SIMA", "Systèmes Intelligents et Modélisation Avancée");
        Equipe sdtic  = creerEquipe("SDTIC", "Systèmes et Données pour les TIC");
        Equipe ilias  = creerEquipe("ILIAS", "Ingénierie Logicielle et Architectures de données");

        // ── 2. DIRECTION ────────────────────────────────────────
        Membre benabbou = creerMembre("Benabbou", "Faouzia", "f.benabbou@lias.ma",
                StatutMembre.PERMANENT, "Directrice du laboratoire LIAS. Spécialiste IA, Cloud, NLP.");
        creerMandat(benabbou, RoleMandat.DIRECTEUR);
        creerAffiliation(benabbou, isdiac);

        Membre belangour = creerMembre("Belangour", "Abdessamad", "a.belangour@lias.ma",
                StatutMembre.PERMANENT, "Directeur adjoint. Ingénierie logicielle, architectures de données.");
        creerMandat(belangour, RoleMandat.VICE_DIRECTEUR);
        creerAffiliation(belangour, ilias);

        // ── 3. CHEFS D'ÉQUIPE ───────────────────────────────────
        Membre sael = creerMembre("Sael", "Nawal", "n.sael@lias.ma",
                StatutMembre.PERMANENT, "Cheffe d'équipe ISDIAC. Sciences de données.");
        creerMandat(sael, RoleMandat.CHEF_EQUIPE);
        creerAffiliation(sael, isdiac);

        Membre aitDaoud = creerMembre("Ait Daoud", "Mohammed", "m.aitdaoud@lias.ma",
                StatutMembre.PERMANENT, "Chef d'équipe SIMA. Systèmes intelligents.");
        creerMandat(aitDaoud, RoleMandat.CHEF_EQUIPE);
        creerAffiliation(aitDaoud, sima);

        Membre ouahabi = creerMembre("Ouahabi", "Sara", "s.ouahabi@lias.ma",
                StatutMembre.PERMANENT, "Cheffe d'équipe SDTIC. Technologie intelligente.");
        creerMandat(ouahabi, RoleMandat.CHEF_EQUIPE);
        creerAffiliation(ouahabi, sdtic);

        Membre ettaoufik = creerMembre("Ettaoufik", "Abdelaziz", "a.ettaoufik@lias.ma",
                StatutMembre.PERMANENT, "Chef d'équipe ILIAS.");
        creerMandat(ettaoufik, RoleMandat.CHEF_EQUIPE);
        creerAffiliation(ettaoufik, ilias);

        // ── 4. AUTRES MEMBRES PERMANENTS ────────────────────────
        Membre elazzaby = creerMembre("Elazzaby", "Fouzia", "f.elazzaby@lias.ma", StatutMembre.PERMANENT, "Traitement de signal et d'images");
        creerAffiliation(elazzaby, isdiac);

        Membre achtaichK = creerMembre("Achtaich", "Khadija", "k.achtaich@lias.ma", StatutMembre.PERMANENT, "Technologies Cognitives");
        creerAffiliation(achtaichK, sima);

        Membre hanoune = creerMembre("Hanoune", "Mostafa", "m.hanoune@lias.ma", StatutMembre.PERMANENT, "Systèmes Intelligents");
        creerAffiliation(hanoune, sima);

        Membre elfilali = creerMembre("El Filali", "Sanaa", "s.elfilali@lias.ma", StatutMembre.PERMANENT, "Technologie intelligente");
        creerAffiliation(elfilali, sdtic);

        Membre aitAbdelouahid = creerMembre("Ait Abdelouahid", "Rachida", "r.aitabdelouahid@lias.ma", StatutMembre.PERMANENT, "Architecture IoT");
        creerAffiliation(aitAbdelouahid, sdtic);

        Membre sekhara = creerMembre("Sekhara", "Youssef", "y.sekhara@lias.ma", StatutMembre.PERMANENT, "Informatique");
        creerAffiliation(sekhara, ilias);

        // ── 5. DOCTORANTS (auteurs des publications réelles) ────
        Membre jannani = creerMembre("Jannani", "Abderrahim", "a.jannani@lias.ma", StatutMembre.DOCTORANT, "Doctorant — IA pour la qualité de vie");
        creerAffiliation(jannani, isdiac);

        Membre ellaky = creerMembre("Ellaky", "Zakaria", "z.ellaky@lias.ma", StatutMembre.DOCTORANT, "Doctorant — Deep Learning, détection de bots");
        creerAffiliation(ellaky, isdiac);

        Membre bouraya = creerMembre("Bouraya", "Soukaina", "s.bouraya@lias.ma", StatutMembre.DOCTORANT, "Doctorante — Vision par ordinateur");
        creerAffiliation(bouraya, ilias);

        // ── 6. PUBLICATIONS RÉELLES 2024 ────────────────────────
        creerPublication("Artificial Intelligence for Quality of Life Study",
                "Étude sur l'utilisation de l'IA pour l'amélioration de la qualité de vie.",
                "Article", 2024, sael, isdiac);

        creerPublication("Hybrid Deep Learning for Bot Detection",
                "Approche hybride de deep learning pour la détection de bots. Publié dans IEEE Access.",
                "Article", 2024, benabbou, isdiac);

        creerPublication("Breast Cancer Therapy Prediction",
                "Prédiction de thérapie pour le cancer du sein via le Machine Learning. Publié dans iJOE.",
                "Article", 2024, elfilali, sdtic);

        creerPublication("Two-Stage Object Detection Models",
                "Modèles de détection d'objets en deux étapes. Publié dans BEEI.",
                "Article", 2024, belangour, ilias);

        // ── 7. ÉVÉNEMENTS RÉELS ──────────────────────────────────
        creerEvenement("International Conference on AI and Systems (ICAIS 2025)",
                TypeEvenement.CONFERENCE,
                "Rendez-vous scientifique majeur dédié à l'innovation en IA, organisé par le LIAS.",
                LocalDate.of(2025, 11, 27), LocalDate.of(2025, 11, 28), "FSBM, Casablanca", benabbou);

        creerEvenement("Journée Doctorale",
                TypeEvenement.SEMINAIRE,
                "Journée dédiée à la recherche scientifique, l'IA et l'innovation.",
                LocalDate.of(2025, 7, 3), null, "FSBM, Casablanca", sael);

        creerEvenement("ICISCT 2026 — Smart City Technologies",
                TypeEvenement.CONFERENCE,
                "Conférence réunissant chercheurs et décideurs autour des villes intelligentes et durables.",
                LocalDate.of(2026, 9, 1), null, "FSBM, Casablanca", benabbou);

        log.info("✅ Données réelles LIAS initialisées avec succès !");
        log.info("   Mot de passe pour tous les comptes : {}", DEFAULT_PASSWORD);
        log.info("   Directrice : f.benabbou@lias.ma");
        log.info("   Vice-directeur : a.belangour@lias.ma");
    }

    // ══════════════════════════════════════════════════════════
    // MÉTHODES UTILITAIRES
    // ══════════════════════════════════════════════════════════

    private final Map<String, Equipe> equipeCache = new HashMap<>();

    private Equipe creerEquipe(String nom, String description) {
        Equipe equipe = Equipe.builder().nom(nom).description(description).build();
        return equipeRepository.save(equipe);
    }

    private Membre creerMembre(String nom, String prenom, String email, StatutMembre statut, String bio) {
        Membre membre = Membre.builder()
                .nom(nom)
                .prenom(prenom)
                .email(email)
                .motDePasse(passwordEncoder.encode(DEFAULT_PASSWORD))
                .statut(statut)
                .biographie(bio)
                .etablissementOrigine("FSBM - Université Hassan II")
                .compteActif(true)
                .compteGele(false)
                .build();
        return membreRepository.save(membre);
    }

    private void creerMandat(Membre membre, RoleMandat role) {
        Mandat mandat = Mandat.builder()
                .membre(membre)
                .typeRole(role)
                .dateDebut(LocalDate.of(2023, 1, 1))
                .actif(true)
                .build();
        mandatRepository.save(mandat);
    }

    private void creerAffiliation(Membre membre, Equipe equipe) {
        Affiliation affiliation = Affiliation.builder()
                .membre(membre)
                .equipe(equipe)
                .dateDebut(LocalDate.of(2021, 1, 1))
                .role(RoleMandat.MEMBRE)
                .build();
        affiliationRepository.save(affiliation);
    }

    private void creerPublication(String titre, String resume, String type, Integer annee, Membre membre, Equipe equipe) {
        Publication publication = Publication.builder()
                .titre(titre)
                .resume(resume)
                .type(type)
                .annee(annee)
                .membre(membre)
                .equipe(equipe)
                .build();
        publicationRepository.save(publication);
    }

    private void creerEvenement(String titre, TypeEvenement type, String description,
                                  LocalDate dateDebut, LocalDate dateFin, String lieu, Membre organisateur) {
        Evenement evenement = Evenement.builder()
                .titre(titre)
                .type(type)
                .description(description)
                .dateDebut(dateDebut)
                .dateFin(dateFin)
                .lieu(lieu)
                .organisateur(organisateur)
                .build();
        evenementRepository.save(evenement);
    }
}
