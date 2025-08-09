package com.nhanit.backend_templateshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhanit.backend_templateshop.dto.request.CreateCategoryRequest;
import com.nhanit.backend_templateshop.dto.request.UpdateCategoryRequest;
import com.nhanit.backend_templateshop.dto.response.CategoryResponse;
import com.nhanit.backend_templateshop.service.CategoryService;

import jakarta.validation.Valid;

@RestController
public class CategoryController {

  @Autowired
  private CategoryService categoryService;

  // Api này ai cũng có thể truy cập được
  @GetMapping("/api/v1/categories")
  public ResponseEntity<List<CategoryResponse>> getAllCategories() {
    return ResponseEntity.ok(categoryService.getAllCategories());
  }

  // Api này ai cũng có thể truy cập được
  @GetMapping("/api/v1/categories/{id}")
  public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable(name = "id") Long categoryId) {
    return ResponseEntity.ok(categoryService.getCategoryById(categoryId));
  }

  // @PreAuthorize("hasRole('ADMIN')"): Chỉ những người dùng có vai trò ADMIN
  // mới được phép gọi API này.
  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/api/v1/admin/categories")
  public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
    return new ResponseEntity<>(categoryService.createCategory(request), HttpStatus.CREATED);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/api/v1/admin/categories/{id}")
  public ResponseEntity<CategoryResponse> updateCategory(@PathVariable(name = "id") Long categoryId,
      @Valid @RequestBody UpdateCategoryRequest request) {
    return ResponseEntity.ok(categoryService.updateCategory(categoryId, request));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/api/v1/admin/categories/{id}")
  public ResponseEntity<String> deleteCategory(@PathVariable(name = "id") Long categoryId) {
    categoryService.deleteCategory(categoryId);
    return ResponseEntity.ok("Đã xóa danh mục thành công.");
  }

}
