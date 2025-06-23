package com.nhanit.backend_templateshop.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.nhanit.backend_templateshop.entity.User;
import com.nhanit.backend_templateshop.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    // Tìm kiếm người dùng trong CSDL bằng email
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

    // Nếu tìm thấy, chuyển đổi đối tượng User của chúng ta thành một đối tượng UserDetails
    // mà Spring Security có thể hiểu được.
    return new org.springframework.security.core.userdetails.User(
        user.getEmail(),
        user.getPassword(),
        Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
  }
}
