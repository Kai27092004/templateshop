package com.nhanit.backend_templateshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhanit.backend_templateshop.dto.request.OrderRequest;
import com.nhanit.backend_templateshop.entity.Order;
import com.nhanit.backend_templateshop.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
  @Autowired
  private OrderService orderService;

  @PostMapping
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest, Authentication authentication) {
    // Lấy email của người dùng đã đăng nhập từ đối tượng Authentication
    String userEmail = authentication.getName();

    Order createdOrder = orderService.createOrder(orderRequest, userEmail);

    // Trả về thông báo thành công
    return ResponseEntity.ok("Đã tạo đơn hàng thành công với ID: " + createdOrder.getId());
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')") // Bảo vệ riêng phương thức này cho ADMIN
  public ResponseEntity<String> deleteOrder(@PathVariable("id") Long orderId) {
    orderService.deleteOrder(orderId);
    return ResponseEntity.ok("Đã xóa đơn hàng thành công.");
  }

}
