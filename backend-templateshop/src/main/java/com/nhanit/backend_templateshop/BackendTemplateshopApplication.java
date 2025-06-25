package com.nhanit.backend_templateshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


//@SpringBootApplication(exclude = { SecurityAutoConfiguration.class }) // Bỏ qua cấu hình bảo mật tự động
@SpringBootApplication // Bỏ qua cấu hình bảo mật tự động
public class BackendTemplateshopApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendTemplateshopApplication.class, args);
	}

}
