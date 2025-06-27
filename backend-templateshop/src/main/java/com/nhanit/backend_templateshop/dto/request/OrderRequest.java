package com.nhanit.backend_templateshop.dto.request;

import java.util.List;
import lombok.Data;

@Data
public class OrderRequest {
  private List<CartItemDto> cartItems;
}
