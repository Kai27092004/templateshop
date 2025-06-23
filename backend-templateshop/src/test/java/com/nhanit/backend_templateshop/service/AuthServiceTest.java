package com.nhanit.backend_templateshop.service;

import com.nhanit.backend_templateshop.dto.request.RegisterRequest;
import com.nhanit.backend_templateshop.entity.Role;
import com.nhanit.backend_templateshop.entity.User;
import com.nhanit.backend_templateshop.exception.AppException;
import com.nhanit.backend_templateshop.repository.UserRepository;
import com.nhanit.backend_templateshop.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @InjectMocks
  private AuthServiceImpl authService;

  private RegisterRequest registerRequest;

  @BeforeEach
  void setUp() {
    registerRequest = RegisterRequest.builder()
        .fullName("Test User")
        .email("test@email.com")
        .password("password123")
        .build();
  }

  @Test
  void whenRegister_withNewEmail_thenSucceed() {
    // Given: Giả lập rằng email chưa tồn tại và mật khẩu sau khi mã hóa
    when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    // Giả lập hành vi của hàm save
    when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When: Khi gọi phương thức register
    User savedUser = authService.register(registerRequest);

    // Then: Kiểm tra kết quả trả về
    assertThat(savedUser).isNotNull();
    assertThat(savedUser.getEmail()).isEqualTo("test@email.com");
    assertThat(savedUser.getPassword()).isEqualTo("encodedPassword");
    assertThat(savedUser.getRole()).isEqualTo(Role.USER);
  }

  @Test
  void whenRegister_withExistingEmail_thenThrowException() {
    // Given: Giả lập rằng email đã tồn tại trong CSDL
    when(userRepository.findByEmail("test@email.com")).thenReturn(Optional.of(new User()));

    // When & Then: Mong đợi một AppException sẽ được ném ra
    assertThrows(AppException.class, () -> {
      authService.register(registerRequest);
    });
  }
}