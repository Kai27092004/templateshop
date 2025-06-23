package com.nhanit.backend_templateshop.security;

import com.nhanit.backend_templateshop.entity.User;
import com.nhanit.backend_templateshop.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import com.nhanit.backend_templateshop.entity.Role;


// Sử dụng Mockito để giả lập các dependency
@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    // @Mock: Tạo một đối tượng giả (mock) của UserRepository.
    // Chúng ta không muốn test này kết nối đến CSDL thật.
    @Mock
    private UserRepository userRepository;

    // @InjectMocks: Tạo một instance của UserDetailsServiceImpl và
    // tự động tiêm (inject) các mock đã tạo (ở đây là userRepository) vào nó.
    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User adminUser;

    // @BeforeEach: Phương thức này sẽ chạy trước mỗi bài test.
    // Dùng để khởi tạo dữ liệu mẫu.
    @BeforeEach
    void setUp() {
        adminUser = User.builder()
                .id(1L)
                .email("admin@email.com")
                .password("$2a$10$e.ExV0jL3C9CI2dGbYF8w.K.0a8F2gOKeK51.fvr9GfXodQRXTmI.") // Mật khẩu đã mã hóa
                .role(Role.ADMIN)
                .build();
    }

    @Test
    void whenLoadUserByUsername_withExistingEmail_thenReturnUserDetails() {
        // Given: Giả lập rằng khi userRepository.findByEmail được gọi với email của admin,
        // nó sẽ trả về đối tượng adminUser mà chúng ta đã tạo.
        when(userRepository.findByEmail("admin@email.com")).thenReturn(Optional.of(adminUser));

        // When: Khi chúng ta gọi phương thức loadUserByUsername
        UserDetails userDetails = userDetailsService.loadUserByUsername("admin@email.com");

        // Then: Thì chúng ta mong đợi kết quả trả về không rỗng và có thông tin chính xác.
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("admin@email.com");
        assertThat(userDetails.getPassword()).isEqualTo(adminUser.getPassword());
        // Kiểm tra quyền hạn có đúng là "ROLE_ADMIN" hay không
        assertThat(userDetails.getAuthorities()).anyMatch(grantedAuthority ->
                grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
    }

    @Test
    void whenLoadUserByUsername_withNonExistentEmail_thenThrowException() {
        // Given: Giả lập rằng khi userRepository.findByEmail được gọi với một email không tồn tại,
        // nó sẽ trả về một Optional rỗng.
        when(userRepository.findByEmail("nonexistent@email.com")).thenReturn(Optional.empty());

        // When & Then: Chúng ta mong đợi một ngoại lệ UsernameNotFoundException sẽ được ném ra.
        // assertThrows sẽ bắt và kiểm tra ngoại lệ này.
        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("nonexistent@email.com");
        });
    }
}