package com.nhanit.backend_templateshop.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "full_name", length = 100)
  private String fullName;

  @Column(name = "email", nullable = false, unique = true, length = 100)
  private String email;

  @Column(name = "password", nullable = false, length = 100)
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(name = "role", nullable = false, length = 20)
  private Role role;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  // Hàm này sẽ được tự động gọi trước khi một User mới được lưu vào CSDL
  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    // Nếu role chưa được set mặc định là USER
    if (role == null) {
      role = Role.USER;
    }
  }


}
