package ma.lias.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import ma.lias.enums.StatutMembre;

import java.util.UUID;

@Data
public class CreerMembreRequest {
    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @Email
    @NotBlank
    private String email;

    private StatutMembre statut;

    private String etablissementOrigine;
    private String laboratoireOrigine;
    private String biographie;

    // Équipe à laquelle affecter le membre (optionnel)
    private UUID equipeId;
}
