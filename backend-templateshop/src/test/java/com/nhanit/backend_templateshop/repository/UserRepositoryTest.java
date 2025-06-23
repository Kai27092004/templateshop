package com.nhanit.backend_templateshop.repository;

import com.nhanit.backend_templateshop.entity.Role;
import com.nhanit.backend_templateshop.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

// @DataJpaTest: Annotation này cung cấp mọi thứ cần thiết để test tầng repository.
// Nó sẽ chỉ cấu hình các thành phần liên quan đến JPA (Entity, Repository), không load các tầng khác như Service hay Controller.
@DataJpaTest
// Annotation này bảo Spring Boot sử dụng CSDL thật đã được cấu hình trong application.properties,
// thay vì dùng một CSDL ảo trong bộ nhớ.
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {

    // Sử dụng @Autowired để Spring tự động tiêm (inject) một instance của UserRepository vào.
    @Autowired
    private UserRepository userRepository;

    // @Test: Đánh dấu đây là một phương thức kiểm thử.
    @Test
    public void whenFindByEmail_thenReturnUser() {
        // Given: Chúng ta biết rằng có một user với email 'admin@email.com' đã tồn tại trong CSDL
        // (được chèn từ script SQL).
        String adminEmail = "admin@email.com";

        // When: Khi chúng ta gọi phương thức findByEmail
        Optional<User> foundUserOptional = userRepository.findByEmail(adminEmail);

        // Then: Thì chúng ta mong đợi sẽ tìm thấy người dùng đó.
        // 1. Kiểm tra rằng Optional không rỗng (tức là đã tìm thấy user)
        assertThat(foundUserOptional).isPresent();

        // 2. Lấy user ra từ Optional và kiểm tra các thuộc tính
        User foundUser = foundUserOptional.get();
        assertThat(foundUser.getEmail()).isEqualTo(adminEmail);
        assertThat(foundUser.getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    public void whenFindByEmail_withNonExistentEmail_thenReturnEmpty() {
        // Given: Một email chắc chắn không tồn tại trong CSDL.
        String nonExistentEmail = "nonexistent@email.com";

        // When: Khi chúng ta gọi phương thức findByEmail với email này
        Optional<User> foundUserOptional = userRepository.findByEmail(nonExistentEmail);

        // Then: Thì chúng ta mong đợi Optional sẽ rỗng.
        assertThat(foundUserOptional).isNotPresent();
    }
}