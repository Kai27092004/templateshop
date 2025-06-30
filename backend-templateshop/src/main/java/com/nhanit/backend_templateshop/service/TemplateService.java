package com.nhanit.backend_templateshop.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.nhanit.backend_templateshop.dto.request.CreateTemplateRequest;
import com.nhanit.backend_templateshop.dto.request.UpdateTemplateRequest;
import com.nhanit.backend_templateshop.dto.response.TemplateResponse;

public interface TemplateService {

  // Phương thức để tạo một template mới, bao gồm cả việc upload file
  TemplateResponse createTemplate(CreateTemplateRequest request, MultipartFile file, MultipartFile thumbnail);

  List<TemplateResponse> getAllTemplates();

  TemplateResponse getTemplateById(long templateId);

  TemplateResponse updateTemplate(Long templateId, UpdateTemplateRequest request, MultipartFile file,
      MultipartFile thumbnail);

  void deleteTemplate(Long templateId);

  TemplateResponse getTemplateBySlug(String slug);

}
