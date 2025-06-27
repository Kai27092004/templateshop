package com.nhanit.backend_templateshop.dto.response;

import lombok.Data;

@Data
public class OrderDetailResponse {
  private TemplateResponse template;
  private int quantity;
  private Long priceAtPurchase;
}
