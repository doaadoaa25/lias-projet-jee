package ma.lias;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LiasApplication {
    public static void main(String[] args) {
        SpringApplication.run(LiasApplication.class, args);
    }
}
