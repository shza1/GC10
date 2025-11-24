package com.inkhouse.ecommercebackend.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // If you’re calling from React without CSRF tokens, easiest is to disable CSRF for now
                .csrf(AbstractHttpConfigurer::disable)
                // Enable CORS so your @CrossOrigin on controllers works nicely
                .cors(Customizer.withDefaults())
                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()   // <--- everything is allowed
                );

        return http.build();
    }
}
