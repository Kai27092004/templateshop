package com.nhanit.backend_templateshop.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.nhanit.backend_templateshop.security.JwtAuthEntryPoint;
import com.nhanit.backend_templateshop.security.UserDetailsServiceImpl;
import com.nhanit.backend_templateshop.security.jwt.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Autowired
  private JwtAuthEntryPoint authEntryPoint;

  @Autowired
  private JwtAuthFilter jwtAuthFilter;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // 1. Cấu hình CORS bằng cách sử dụng một Bean tùy chỉnh
        .cors(cors -> {
          CorsConfiguration configuration = new CorsConfiguration();
          configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
          configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
          configuration.setAllowedHeaders(Collections.singletonList("*"));
          configuration.setAllowCredentials(true);
          UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
          source.registerCorsConfiguration("/api/**", configuration);
          cors.configurationSource(source);
        })
        .csrf(csrf -> csrf.disable()) // Vô hiệu hóa CSRF vì chúng ta dùng API
        .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint))
        // Cấu hình quản lý session: không tạo session vì dùng JWT
        .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // Liên kết AuthenticationProvider đã tạo
        .authenticationProvider(authenticationProvider())
        // Chạy jwtAuthFilter trước bộ lọc UsernamePasswordAuthenticationFilter mặc định
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        // Cho phép tất cả các request tới /api/v1/auth/** (đăng ký, đăng nhập)
        .authorizeHttpRequests(auth -> auth
            // Cho phép tất cả các request với phương thức OPTIONS đi qua
            .requestMatchers("/api/v1/files/**").permitAll()
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/api/v1/auth/**").permitAll()
            // Cho phép các request GET tới /api/v1/categories/**
            .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
            // Cho phép các request GET tới /api/v1/templates/**
            .requestMatchers(HttpMethod.GET, "/api/v1/templates/**").permitAll()
            // Tất cả các API dưới /api/v1/admin/ đều yêu cầu vai trò ADMIN
            .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
            // Tất cả các request còn lại đều yêu cầu phải xác thực
            .anyRequest().authenticated());
    // .authorizeHttpRequests(auth -> auth.requestMatchers("/**").permitAll());
    return http.build();
  }

  // Bean này sẽ cung cấp AuthenticationManager để sử dụng trong toàn bộ ứng dụng,
  // đặc biệt là trong AuthServiceImpl để xác thực người dùng.
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
    return configuration.getAuthenticationManager();
  }
}
