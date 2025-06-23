package com.nhanit.backend_templateshop.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nhanit.backend_templateshop.dto.request.CreateCategoryRequest;
import com.nhanit.backend_templateshop.dto.request.UpdateCategoryRequest;
import com.nhanit.backend_templateshop.dto.response.CategoryResponse;
import com.nhanit.backend_templateshop.entity.Category;
import com.nhanit.backend_templateshop.exception.ResourceNotFoundException;
import com.nhanit.backend_templateshop.repository.CategoryRepository;
import com.nhanit.backend_templateshop.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {
  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private ModelMapper modelMapper;

  @Override
  public CategoryResponse createCategory(CreateCategoryRequest request) { // Nhận CreateCategoryRequest
    Category category = new Category();
    category.setName(request.getName());
    category.setSlug(request.getSlug());

    Category savedCategory = categoryRepository.save(category);
    return modelMapper.map(savedCategory, CategoryResponse.class);
  }

  @Override
  public CategoryResponse getCategoryById(Long categoryId) {
    Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    return modelMapper.map(category, CategoryResponse.class);
  }

  @Override
  public List<CategoryResponse> getAllCategories() {
    List<Category> categories = categoryRepository.findAll();
    // Dùng stream để chuyển đổi một List<Category> thành List<CategoryResponse>
    return categories.stream()
        .map(category -> modelMapper.map(category, CategoryResponse.class))
        .collect(Collectors.toList());
  }

  @Override
  public CategoryResponse updateCategory(Long categoryId, UpdateCategoryRequest request) {
    Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));

    category.setName(request.getName());
    category.setSlug(request.getSlug());

    Category updatedCategory = categoryRepository.save(category);
    return modelMapper.map(updatedCategory, CategoryResponse.class);
  }

  @Override
  public void deleteCategory(Long categoryId) {
    Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
    categoryRepository.delete(category);
  }
}
