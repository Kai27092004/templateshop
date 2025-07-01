package com.nhanit.backend_templateshop.service;

import java.util.List;

import com.nhanit.backend_templateshop.dto.request.AdminCreateUserRequest;
import com.nhanit.backend_templateshop.dto.request.AdminUpdateUserRequest;
import com.nhanit.backend_templateshop.dto.response.UserProfileResponse;
import com.nhanit.backend_templateshop.dto.response.UserResponse;

public interface UserService {
  UserProfileResponse getUserProfile(String email);

  List<UserResponse> getAllUsers();

  UserResponse createUserByAdmin(AdminCreateUserRequest request);

  UserResponse updateUserByAdmin(Long userId, AdminUpdateUserRequest request);

  void deleteUser(Long userId, String adminEmail);
}
