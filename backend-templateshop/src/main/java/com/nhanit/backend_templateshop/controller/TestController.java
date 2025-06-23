package com.nhanit.backend_templateshop.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Đánh dấu đây là một lớp Controller xử lý các request API
public class TestController {

    // Ánh xạ các HTTP GET request tới địa chỉ "/" đến phương thức này
    @GetMapping("/")
    public String home() {
        return "Backend server for Template Shop is running!";
    }
}