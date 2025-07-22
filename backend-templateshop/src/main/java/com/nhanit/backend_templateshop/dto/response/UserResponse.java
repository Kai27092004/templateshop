package com.nhanit.backend_templateshop.dto.response;

import java.time.LocalDateTime;

import com.nhanit.backend_templateshop.entity.Role;

import lombok.Data;

@Data
public class UserResponse {
  private Long id;
  private String fullName;
  private String email;
  private Role role;
  private LocalDateTime createdAt;

  private Integer orderCount;
  private Long totalSpent;
}
