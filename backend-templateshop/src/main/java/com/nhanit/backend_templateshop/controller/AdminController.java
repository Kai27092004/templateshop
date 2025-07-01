package com.nhanit.backend_templateshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhanit.backend_templateshop.dto.request.AdminCreateUserRequest;
import com.nhanit.backend_templateshop.dto.request.AdminUpdateUserRequest;
import com.nhanit.backend_templateshop.dto.response.UserResponse;
import com.nhanit.backend_templateshop.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
  @Autowired
  private UserService userService;

  // API lấy danh sách tất cả người dùng
  @GetMapping("/users")
  public ResponseEntity<List<UserResponse>> getAllUsers() {
    List<UserResponse> users = userService.getAllUsers();
    return ResponseEntity.ok(users);
  }

  // API tạo người dùng mới
  @PostMapping("/users")
  public ResponseEntity<UserResponse> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
    UserResponse newUser = userService.createUserByAdmin(request);
    return new ResponseEntity<>(newUser, HttpStatus.CREATED);
  }

  // API cập nhật
  @PutMapping("/users/{id}")
  public ResponseEntity<UserResponse> updateUser(@PathVariable("id") Long userId,
      @Valid @RequestBody AdminUpdateUserRequest request) {
    UserResponse updatedUser = userService.updateUserByAdmin(userId, request);
    return ResponseEntity.ok(updatedUser);
  }

  // API xóa người dùng
  @DeleteMapping("/users/{id}")
  public ResponseEntity<String> deleteUser(@PathVariable("id") Long userId, Authentication authentication) {
    String adminEmail = authentication.getName();
    userService.deleteUser(userId, adminEmail);
    return ResponseEntity.ok("Đã xóa người dùng thành công");
  }
}
