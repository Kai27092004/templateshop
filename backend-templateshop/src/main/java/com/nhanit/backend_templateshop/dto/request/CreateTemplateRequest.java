package com.nhanit.backend_templateshop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTemplateRequest {
  @NotBlank(message = "Tên template không được để trống")
  private String name;

  @NotBlank(message = "Slug không được để trống")
  private String slug;

  private String description;

  @NotBlank(message = "Giá không được để trống")
  @Min(value = 0, message = "Giá không được nhỏ hơn 0")
  private Long price;

  @NotNull(message = "ID danh mục không được để trống")
  private Long categoryId;

  private String liveDemoUrl;

}
