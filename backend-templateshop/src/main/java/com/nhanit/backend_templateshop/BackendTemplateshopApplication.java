package com.nhanit.backend_templateshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })

public class BackendTemplateshopApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendTemplateshopApplication.class, args);
	}

}
