package com.nhanit.backend_templateshop.service;

import com.nhanit.backend_templateshop.dto.response.UserProfileResponse;

public interface UserService {
  UserProfileResponse getUserProfile(String email);
}
