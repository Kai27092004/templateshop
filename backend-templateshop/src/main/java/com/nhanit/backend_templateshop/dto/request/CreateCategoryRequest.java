package com.nhanit.backend_templateshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Lớp này giống hệt UpdateCategoryRequest ở thời điểm hiện tại,
// nhưng nó phục vụ cho một mục đích ngữ nghĩa khác.
@Data
public class CreateCategoryRequest {

    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;

    @NotBlank(message = "Slug không được để trống")
    private String slug;
}