package com.nhanit.backend_templateshop.dto.request;

import com.nhanit.backend_templateshop.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminCreateUserRequest {
  @NotBlank(message = "Họ và tên không được để trống")
  private String fullName;

  @NotBlank(message = "Email không được để trống")
  @Email(message = "Email không hợp lệ")
  private String email;

  @NotBlank(message = "Mật khẩu không được để trống")
  @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
  private String password;

  @NotNull(message = "Vai trò không được để trống")
  private Role role; // Admin có thể gán vai trò là USER hoặc ADMIN
}
