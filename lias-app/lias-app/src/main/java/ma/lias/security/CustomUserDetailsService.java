package ma.lias.security;
 
import lombok.RequiredArgsConstructor;
import ma.lias.entity.Membre;
import ma.lias.repository.MembreRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.List;
 
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
 
    private final MembreRepository membreRepository;
 
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Membre membre = membreRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Membre non trouvé : " + email));
 
        if (!membre.isActive()) {
            throw new UsernameNotFoundException("Compte désactivé ou gelé : " + email);
        }
 
        // Le rôle est déterminé selon le statut + mandats actifs
        String role = determinerRole(membre);
 
        return User.builder()
                .username(membre.getEmail())
                .password(membre.getMotDePasse())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + role)))
                .build();
    }
 
    private String determinerRole(Membre membre) {
        // Priorité aux mandats actifs (gouvernance) sur le statut
        boolean isDirecteur = membre.getMandats().stream()
                .anyMatch(m -> m.getTypeRole().name().equals("DIRECTEUR") && m.isEnCours());
        if (isDirecteur) return "DIRECTEUR";
 
        boolean isViceDirecteur = membre.getMandats().stream()
                .anyMatch(m -> m.getTypeRole().name().equals("VICE_DIRECTEUR") && m.isEnCours());
        if (isViceDirecteur) return "VICE_DIRECTEUR";
 
        boolean isChefEquipe = membre.getMandats().stream()
                .anyMatch(m -> m.getTypeRole().name().equals("CHEF_EQUIPE") && m.isEnCours());
        if (isChefEquipe) return "CHEF_EQUIPE";
 
        return switch (membre.getStatut()) {
            case PERMANENT -> "PERMANENT";
            case ASSOCIE -> "ASSOCIE";
            case DOCTORANT -> "DOCTORANT";
            default -> "MEMBRE";
        };
    }
}
