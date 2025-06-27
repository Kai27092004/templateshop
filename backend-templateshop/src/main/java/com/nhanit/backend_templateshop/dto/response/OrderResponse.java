package com.nhanit.backend_templateshop.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderResponse {
  private Long id;
  private LocalDateTime orderDate;
  private Long totalAmount;
  private String status;
  private List<OrderDetailResponse> orderDetails;
}
