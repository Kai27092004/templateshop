package com.nhanit.backend_templateshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhanit.backend_templateshop.dto.response.OrderResponse;
import com.nhanit.backend_templateshop.service.OrderService;

@RestController
@RequestMapping("/api/v1/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

  @Autowired
  private OrderService orderService;

  @GetMapping
  public ResponseEntity<List<OrderResponse>> getAllOrders() {
    return ResponseEntity.ok(orderService.getAllOrders());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteOrder(@PathVariable("id") Long orderId) {
    orderService.deleteOrder(orderId);
    return ResponseEntity.ok("Đã xóa đơn hàng thành công");
  }
}
