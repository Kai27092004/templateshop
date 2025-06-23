package com.nhanit.backend_templateshop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Đánh dấu đây là một lớp Controller xử lý các request API
@RequestMapping("/api/v1/test")
public class TestController {

    // Ánh xạ các HTTP GET request tới địa chỉ "/" đến phương thức này
    // API này không được bảo vệ, ai cũng có thể gọi
    @GetMapping("/public")
    public String home() {
        return "Backend server for Template Shop is running!";
    }

    // API này sẽ được bảo vệ vì đường dẫn của nó không khớp với
    // .requestMatchers("/api/v1/auth/**").permitAll() trong SecurityConfig
    @GetMapping("/user")
    public ResponseEntity<String> protectedEndpoint() {
        return ResponseEntity.ok("Chào mừng bạn! Đây là khu vực được bảo vệ cho người dùng đã đăng nhập.");
    }
}