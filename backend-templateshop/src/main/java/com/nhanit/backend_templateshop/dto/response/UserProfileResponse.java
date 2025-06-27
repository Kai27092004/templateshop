package com.nhanit.backend_templateshop.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserProfileResponse {
  private Long id;
  private String fullName;
  private String email;
  private LocalDateTime createdAt;
}
