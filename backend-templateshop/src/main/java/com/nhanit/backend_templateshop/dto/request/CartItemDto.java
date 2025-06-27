package com.nhanit.backend_templateshop.dto.request;

import lombok.Data;

@Data
public class CartItemDto {
  private Long templateId;
  private int quantity;
}
