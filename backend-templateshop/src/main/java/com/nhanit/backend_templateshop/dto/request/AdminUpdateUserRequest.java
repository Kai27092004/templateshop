package com.nhanit.backend_templateshop.dto.request;

import com.nhanit.backend_templateshop.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminUpdateUserRequest {
  @NotBlank(message = "Họ và tên không được để trống")
  private String fullName;

  @NotBlank(message = "Email không được để trống")
  @Email(message = "Email không hợp lệ")
  private String email;

  private String password;

  @NotNull(message = "Vai trò không được để trống")
  private Role role;
}
