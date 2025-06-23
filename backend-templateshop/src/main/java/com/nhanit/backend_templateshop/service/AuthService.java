package com.nhanit.backend_templateshop.service;

import com.nhanit.backend_templateshop.dto.request.LoginRequest;
import com.nhanit.backend_templateshop.dto.request.RegisterRequest;
import com.nhanit.backend_templateshop.entity.User;

public interface AuthService {
  User register(RegisterRequest registerRequest);
  String login(LoginRequest loginRequest);
}
