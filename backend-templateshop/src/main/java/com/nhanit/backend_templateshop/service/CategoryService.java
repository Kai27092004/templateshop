package com.nhanit.backend_templateshop.service;

import com.nhanit.backend_templateshop.dto.request.CreateCategoryRequest; // Import mới
import com.nhanit.backend_templateshop.dto.request.UpdateCategoryRequest;
import com.nhanit.backend_templateshop.dto.response.CategoryResponse;
import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CreateCategoryRequest request);

    CategoryResponse getCategoryById(Long categoryId);

    List<CategoryResponse> getAllCategories();

    CategoryResponse updateCategory(Long categoryId, UpdateCategoryRequest request);

    void deleteCategory(Long categoryId);
}