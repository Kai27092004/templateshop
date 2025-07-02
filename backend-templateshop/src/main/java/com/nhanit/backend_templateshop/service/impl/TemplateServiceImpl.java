package com.nhanit.backend_templateshop.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nhanit.backend_templateshop.dto.request.CreateTemplateRequest;
import com.nhanit.backend_templateshop.dto.request.UpdateTemplateRequest;
import com.nhanit.backend_templateshop.dto.response.TemplateResponse;
import com.nhanit.backend_templateshop.entity.Category;
import com.nhanit.backend_templateshop.entity.Template;
import com.nhanit.backend_templateshop.exception.AppException;
import com.nhanit.backend_templateshop.exception.ResourceNotFoundException;
import com.nhanit.backend_templateshop.repository.CategoryRepository;
import com.nhanit.backend_templateshop.repository.OrderDetailRepository;
import com.nhanit.backend_templateshop.repository.TemplateRepository;
import com.nhanit.backend_templateshop.service.FileStorageService;
import com.nhanit.backend_templateshop.service.TemplateService;

@Service
public class TemplateServiceImpl implements TemplateService {
  @Autowired
  private TemplateRepository templateRepository;

  @Autowired
  private CategoryRepository categoryRepository;

  @Autowired
  private FileStorageService fileStorageService;

  @Autowired
  private ModelMapper modelMapper;

  @Autowired
  private OrderDetailRepository orderDetailRepository;

  @Override
  public TemplateResponse createTemplate(CreateTemplateRequest request, MultipartFile file, MultipartFile thumbnail) {
    Category category = categoryRepository.findById(request.getCategoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

    String filePath = fileStorageService.storeFile(file);

    String thumbnailRelativePath = null;
    if (thumbnail != null && !thumbnail.isEmpty()) {
      // SỬA LẠI: Không cộng chuỗi "images/" nữa vì storeImageFile đã trả về đường dẫn
      // đầy đủ
      thumbnailRelativePath = fileStorageService.storeImageFile(thumbnail);
    }

    Template template = new Template();
    template.setName(request.getName());
    template.setSlug(request.getSlug());
    template.setDescription(request.getDescription());
    template.setPrice(request.getPrice());
    template.setCategory(category);
    template.setFilePath(filePath);
    template.setThumbnailUrl(thumbnailRelativePath);
    template.setLiveDemoUrl(request.getLiveDemoUrl());

    Template savedTemplate = templateRepository.save(template);
    return modelMapper.map(savedTemplate, TemplateResponse.class);
  }

  @Override
  public List<TemplateResponse> getAllTemplates() {
    return templateRepository.findAll().stream()
        .map(template -> modelMapper.map(template, TemplateResponse.class))
        .collect(Collectors.toList());
  }

  @Override
  public TemplateResponse getTemplateById(long templateId) {
    Template template = templateRepository.findById(templateId)
        .orElseThrow(() -> new ResourceNotFoundException("Template", "id", templateId));
    return modelMapper.map(template, TemplateResponse.class);
  }

  @Override
  public TemplateResponse getTemplateBySlug(String slug) {
    Template template = templateRepository.findBySlug(slug)
        .orElseThrow(() -> new ResourceNotFoundException("Template", "slug", slug));
    return modelMapper.map(template, TemplateResponse.class);
  }

  @Override
  public TemplateResponse updateTemplate(Long templateId, UpdateTemplateRequest request, MultipartFile file,
      MultipartFile thumbnail) {
    Template template = templateRepository.findById(templateId)
        .orElseThrow(() -> new ResourceNotFoundException("Template", "id", templateId));

    Category category = categoryRepository.findById(request.getCategoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

    template.setName(request.getName());
    template.setSlug(request.getSlug());
    template.setDescription(request.getDescription());
    template.setPrice(request.getPrice());
    template.setCategory(category);

    if (file != null && !file.isEmpty()) {
      fileStorageService.deleteFile(template.getFilePath());
      String newFileName = fileStorageService.storeFile(file);
      template.setFilePath(newFileName);
    }

    if (thumbnail != null && !thumbnail.isEmpty()) {
      if (template.getThumbnailUrl() != null) {
        fileStorageService.deleteFile(template.getThumbnailUrl());
      }
      // SỬA LẠI: Không cộng chuỗi "images/" nữa
      String newThumbnailPath = fileStorageService.storeImageFile(thumbnail);
      template.setThumbnailUrl(newThumbnailPath);
    }
    template.setLiveDemoUrl(request.getLiveDemoUrl());
    Template updatedTemplate = templateRepository.save(template);
    return modelMapper.map(updatedTemplate, TemplateResponse.class);
  }

  @Override
  public void deleteTemplate(Long templateId) {
    // 1. Kiểm tra xem template có tồn tại trong bất kỳ chi tiết đơn hàng nào không
    boolean isInOrder = orderDetailRepository.existsByTemplateId(templateId);

    if (isInOrder) {
      throw new AppException("Không thể xóa template này vì nó đã tồn tại trong một đơn hàng", HttpStatus.BAD_REQUEST);
    }

    // 1. Tìm template cần cập nhật trong CSDL
    Template template = templateRepository.findById(templateId)
        .orElseThrow(() -> new ResourceNotFoundException("Template", "id", templateId));

    // 2. Xóa file vật lý liên quan đến template
    fileStorageService.deleteFile(template.getFilePath());
    if (template.getThumbnailUrl() != null) {
      fileStorageService.deleteFile(template.getThumbnailUrl());
    }

    // 3. Xóa template khỏi CSDL
    templateRepository.delete(template);
  }
}
