package ma.lias.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import ma.lias.entity.Membre;

@Data
@Builder
@AllArgsConstructor
public class MembreCreeResponse {
    private Membre membre;
    private String motDePasseTemporaire;  // affiché UNE SEULE FOIS au directeur
}
