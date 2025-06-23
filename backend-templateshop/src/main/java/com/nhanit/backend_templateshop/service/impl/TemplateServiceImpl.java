package com.nhanit.backend_templateshop.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nhanit.backend_templateshop.dto.request.CreateTemplateRequest;
import com.nhanit.backend_templateshop.dto.request.UpdateTemplateRequest;
import com.nhanit.backend_templateshop.dto.response.TemplateResponse;
import com.nhanit.backend_templateshop.entity.Category;
import com.nhanit.backend_templateshop.entity.Template;
import com.nhanit.backend_templateshop.exception.ResourceNotFoundException;
import com.nhanit.backend_templateshop.repository.CategoryRepository;
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

  @Override
  public TemplateResponse createTemplate(CreateTemplateRequest request, MultipartFile file) {
    // 1. Tìm Category từ categoryId trong request
    Category category = categoryRepository.findById(request.getCategoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

    // 1.2. Gọi FileStorageService để lưu file và lấy lại tên file
    String fileName = fileStorageService.storeFile(file);

    // 2. Tạo đối tượng Template mới
    Template template = new Template();
    template.setName(request.getName());
    template.setSlug(request.getSlug());
    template.setDescription(request.getDescription());
    template.setPrice(request.getPrice());
    template.setCategory(category);
    template.setFilePath(fileName);

    // 3. Lưu vào CSDL
    Template savedTemplate = templateRepository.save(template);

    // 4. Chuyển đổi sang DTO để trả về
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
  public TemplateResponse updateTemplate(Long templateId, UpdateTemplateRequest request, MultipartFile file) {
    // 1. Tìm template cần cập nhật trong CSDL
    Template template = templateRepository.findById(templateId)
        .orElseThrow(() -> new ResourceNotFoundException("Template", "id", templateId));

    // 2. Tìm category mới
    Category category = categoryRepository.findById(request.getCategoryId())
        .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

    // 3. Cập nhật các thông tin cơ bản
    template.setName(request.getName());
    template.setSlug(request.getSlug());
    template.setDescription(request.getDescription());
    template.setPrice(request.getPrice());
    template.setCategory(category);

    // 4. Nếu có file mới được upload, thì cập nhật file
    if (file != null && !file.isEmpty()) {
      // Xóa file cũ
      fileStorageService.deleteFile(template.getFilePath());

      // Lưu file mới và cập nhật đường dẫn
      String newFileName = fileStorageService.storeFile(file);
      template.setFilePath(newFileName);
    }

    // 5. Lưu lại template đã cập nhật vào CSDL
    Template updatedTemplate = templateRepository.save(template);

    // 6. Chuyển đổi sang DTO để trả về
    return modelMapper.map(updatedTemplate, TemplateResponse.class);
  }

  @Override
  public void deleteTemplate(Long templateId) {
    // 1. Tìm template cần cập nhật trong CSDL
    Template template = templateRepository.findById(templateId)
        .orElseThrow(() -> new ResourceNotFoundException("Template", "id", templateId));

    // 2. Xóa file vật lý liên quan đến template
    fileStorageService.deleteFile(template.getFilePath());

    // 3. Xóa template khỏi CSDL
    templateRepository.delete(template);
  }
}
