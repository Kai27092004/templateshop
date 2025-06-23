package com.nhanit.backend_templateshop.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TemplateResponse {
  private Long id;
  private String name;
  private String slug;
  private String description;
  private Long price;
  private String thumbnailUrl;
  private String liveDemoUrl;
  private LocalDateTime createdAt;
  private CategoryResponse category;
  // Chúng ta không trả về filePath vì đó là thông tin nhạy cảm.
}
