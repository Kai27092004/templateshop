package com.nhanit.backend_templateshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;

    @NotBlank(message = "Slug không được để trống")
    private String slug;
}