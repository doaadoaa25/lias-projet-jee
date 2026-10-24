package ma.lias.service;
 
import lombok.RequiredArgsConstructor;
import ma.lias.dto.request.LoginRequest;
import ma.lias.dto.response.AuthResponse;
import ma.lias.entity.Membre;
import ma.lias.enums.RoleMandat;
import ma.lias.repository.MembreRepository;
import ma.lias.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
@Service
@RequiredArgsConstructor
public class AuthService {
 
    private final AuthenticationManager authenticationManager;
    private final MembreRepository membreRepository;
    private final JwtUtil jwtUtil;
 
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );
 
        Membre membre = membreRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Membre non trouvé"));
 
        String role = determinerRole(membre);
        String token = jwtUtil.generateToken(membre.getEmail(), role);
 
        return AuthResponse.builder()
                .token(token)
                .id(membre.getId())
                .nomComplet(membre.getNomComplet())
                .email(membre.getEmail())
                .statut(membre.getStatut())
                .role(role)
                .build();
    }
 
    public Membre getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return membreRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur courant non trouvé"));
    }
 
    private String determinerRole(Membre membre) {
        boolean isDirecteur = membre.getMandats().stream()
                .anyMatch(m -> m.getTypeRole() == RoleMandat.DIRECTEUR && m.isEnCours());
        if (isDirecteur) return "DIRECTEUR";
 
        boolean isViceDirecteur = membre.getMandats().stream()
                .anyMatch(m -> m.getTypeRole() == RoleMandat.VICE_DIRECTEUR && m.isEnCours());
        if (isViceDirecteur) return "VICE_DIRECTEUR";
 
        return membre.getStatut().name();
    }
}
