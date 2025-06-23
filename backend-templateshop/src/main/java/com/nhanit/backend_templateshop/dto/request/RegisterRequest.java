package com.nhanit.backend_templateshop.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class RegisterRequest {
  // @NotBlank: Đảm bảo trường này không được rỗng hoặc chỉ chứa khoảng trắng
  @NotBlank(message = "Họ và tên không được để trống")
  private String fullName;

  @NotBlank(message = "Email không được để trống")
  @Email(message = "Email không hợp lệ") // Kiểm tra định dạng email
  private String email;

  @NotBlank(message = "Mật khẩu không được để trống")
  @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự") // Kiểm tra độ dài tối thiểu
  private String password;

}
