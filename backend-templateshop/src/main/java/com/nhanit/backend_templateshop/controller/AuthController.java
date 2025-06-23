package com.nhanit.backend_templateshop.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhanit.backend_templateshop.dto.request.LoginRequest;
import com.nhanit.backend_templateshop.dto.request.RegisterRequest;
import com.nhanit.backend_templateshop.dto.response.AuthResponse;
import com.nhanit.backend_templateshop.entity.User;
import com.nhanit.backend_templateshop.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  @Autowired
  private AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
    // Gọi service để thực hiện logic đăng ký
    User registeredUser = authService.register(registerRequest);
    return ResponseEntity.created(URI.create("/api/v1/users/" + registeredUser.getId()))
        .body("Đăng ký thành công!");
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
    // Gọi service để thực hiện logic đăng nhập
    String token = authService.login(loginRequest);

    // Tạo đối tượng AuthResponse để trả về token cho client
    AuthResponse authResponse = new AuthResponse(token);

    // Trả về token trong body của response với HTTP Status 200 OK
    return ResponseEntity.ok(authResponse);
  }
}
