package com.nhanit.backend_templateshop.dto.response;

import lombok.Data;

@Data
public class CategoryResponse {
  private Long id;
  private String name;
  private String slug;
}
