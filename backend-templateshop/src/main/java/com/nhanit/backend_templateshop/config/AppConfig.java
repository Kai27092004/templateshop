package com.nhanit.backend_templateshop.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
  @Bean
  public ModelMapper modelMapper() {
    return new ModelMapper();
  }

  // @Bean
  // public CommandLineRunner commandLineRunner(PasswordEncoder passwordEncoder) {
  // return args -> {
  // System.out.println("====================================================================");
  // System.out.println("--- MÁY TẠO MẬT KHẨU BCrypt ---");
  // System.out.println("Mật khẩu 'user123' sau khi mã hóa là:");
  // // In ra chuỗi mật khẩu đã được mã hóa
  // System.out.println(passwordEncoder.encode("user123"));
  // System.out.println("=> HÃY SAO CHÉP CHUỖI MÃ HÓA Ở TRÊN (BẮT ĐẦU BẰNG$2a$)");
  // System.out.println("====================================================================");
  // };
  // }
}
