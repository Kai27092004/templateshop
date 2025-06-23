package com.nhanit.backend_templateshop.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {
  // Phương thức này sẽ được gọi mỗi khi một người dùng chưa được xác thực
  // cố gắng truy cập vào một tài nguyên yêu cầu xác thực.
  // Hoặc khi quá trình xác thực thất bại (ví dụ: sai mật khẩu).
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
      throws IOException, ServletException {
    // Thiết lập mã trạng thái là 401 Unauthorized
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    // Thiết lập kiểu nội dung là JSON
    response.setContentType("application/json; charset=UTF-8");
    response.setCharacterEncoding("UTF-8");
    // Ghi nội dung lỗi vào body của response
    response.getWriter()
        .write("{\"error\": \"Xác thực không thành công. Vui lòng kiểm tra lại email hoặc mật khẩu.\"}");
  }
}
