package ma.lias.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import ma.lias.enums.StatutMembre;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UUID id;
    private String nomComplet;
    private String email;
    private StatutMembre statut;
    private String role;
}
