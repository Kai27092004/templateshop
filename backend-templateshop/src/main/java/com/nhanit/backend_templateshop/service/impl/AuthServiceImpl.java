package com.nhanit.backend_templateshop.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nhanit.backend_templateshop.dto.request.LoginRequest;
import com.nhanit.backend_templateshop.dto.request.RegisterRequest;
import com.nhanit.backend_templateshop.entity.Role;
import com.nhanit.backend_templateshop.entity.User;
import com.nhanit.backend_templateshop.exception.AppException;
import com.nhanit.backend_templateshop.repository.UserRepository;
import com.nhanit.backend_templateshop.security.jwt.JwtTokenProvider;
import com.nhanit.backend_templateshop.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private AuthenticationManager authenticationManager;
  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  @Override
  public User register(RegisterRequest registerRequest) {
    // 1. Kiểm tra xem email đã tồn tại trong CSDL chưa
    if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
      throw new AppException("Email đã được đăng ký", HttpStatus.BAD_REQUEST);
    }

    // 2. Nếu email chưa tồn tại, tạo một đối tượng User mới
    User user = new User();
    user.setFullName(registerRequest.getFullName());
    user.setEmail(registerRequest.getEmail());
    // 3. Mã hóa mật khẩu trước khi lưu
    user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
    // 4. Thiết lập vai trò mặc định cho người dùng mới là USER
    user.setRole(Role.USER);
    // 5. Lưu đối tượng User vào CSDL
    return userRepository.save(user);
  }

  @Override
  public String login(LoginRequest loginRequest) {
    // 1. Xác thực người dùng bằng email và password
    Authentication authentication = authenticationManager
        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

    // 2. Nếu xác thực thành công, lưu thông tin vào SecurityContext
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // 3. Tạo và trả về JWT token
    return jwtTokenProvider.generationToken(authentication);
  }

}
