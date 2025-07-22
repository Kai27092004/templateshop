package com.nhanit.backend_templateshop.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nhanit.backend_templateshop.dto.request.AdminCreateUserRequest;
import com.nhanit.backend_templateshop.dto.request.AdminUpdateUserRequest;
import com.nhanit.backend_templateshop.dto.response.UserProfileResponse;
import com.nhanit.backend_templateshop.dto.response.UserResponse;
import com.nhanit.backend_templateshop.entity.Order;
import com.nhanit.backend_templateshop.entity.OrderStatus;
import com.nhanit.backend_templateshop.entity.User;
import com.nhanit.backend_templateshop.exception.AppException;
import com.nhanit.backend_templateshop.exception.ResourceNotFoundException;
import com.nhanit.backend_templateshop.repository.UserRepository;
import com.nhanit.backend_templateshop.service.UserService;

@Service
public class UserServiceImpl implements UserService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ModelMapper modelMapper;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Override
  public UserProfileResponse getUserProfile(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    return modelMapper.map(user, UserProfileResponse.class);
  }

  @Override
  public List<UserResponse> getAllUsers() {
    List<User> users = userRepository.findAll();
    return users.stream().map(user -> {
      UserResponse userResponse = modelMapper.map(user, UserResponse.class);

      // Tính toán thống kê đơn hàng cho mỗi user
      List<Order> orders = user.getOrders();
      userResponse.setOrderCount(orders.size());

      long totalSpent = orders.stream()
          .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
          .mapToLong(Order::getTotalAmount)
          .sum();
      userResponse.setTotalSpent(totalSpent);

      return userResponse;
    }).collect(Collectors.toList());
  }

  @Override
  public UserResponse createUserByAdmin(AdminCreateUserRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new AppException("Email đã được đăng ký", HttpStatus.BAD_REQUEST);
    }

    User user = new User();
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());

    User savedUser = userRepository.save(user);
    return modelMapper.map(savedUser, UserResponse.class);
  }

  @Override
  public UserResponse updateUserByAdmin(Long userId, AdminUpdateUserRequest request) {
    User userToUpdate = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

    userRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
      if (!existingUser.getId().equals(userId)) {
        throw new AppException("Email đã được sử dụng bởi một tài khoản khác.", HttpStatus.BAD_REQUEST);
      }
    });

    userToUpdate.setFullName(request.getFullName());
    userToUpdate.setEmail(request.getEmail());
    userToUpdate.setRole(request.getRole());

    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
      if (request.getPassword().length() < 6) {
        throw new AppException("Mật khẩu mới phải có ít nhất 6 ký tự.", HttpStatus.BAD_REQUEST);
      }
      userToUpdate.setPassword(passwordEncoder.encode(request.getPassword()));
    }

    User updatedUser = userRepository.save(userToUpdate);
    return modelMapper.map(updatedUser, UserResponse.class);
  }

  @Override
  public void deleteUser(Long userId, String adminEmail) {
    User userToDelete = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

    if (userToDelete.getEmail().equals(adminEmail)) {
      throw new AppException("Admin không thể tự xóa chính mình", HttpStatus.BAD_REQUEST);
    }

    userRepository.delete(userToDelete);
  }
}
