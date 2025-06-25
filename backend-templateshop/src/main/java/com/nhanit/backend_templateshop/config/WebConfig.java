package com.nhanit.backend_templateshop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**") // Áp dụng CORS cho tất cả các API bắt đầu bằng /api/
        .allowedOrigins("http://localhost:3000") // Cho phép các yêu cầu từ địa chỉ này
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép các phương thức này
        .allowedHeaders("*") // Cho phép tất cả các header
        .allowCredentials(true); // Cho phép gửi cookie hoặc thông tin xác thực
  }
}
