package com.nhanit.backend_templateshop.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nhanit.backend_templateshop.dto.request.CreateTemplateRequest;
import com.nhanit.backend_templateshop.dto.request.UpdateTemplateRequest;
import com.nhanit.backend_templateshop.dto.response.TemplateResponse;
import com.nhanit.backend_templateshop.service.TemplateService;

@RestController
public class TemplateController {

  @Autowired
  private TemplateService templateService;

  @Autowired
  private ObjectMapper objectMapper;

  // CÁC API CÔNG KHAI
  @GetMapping("/api/v1/templates")
  public ResponseEntity<List<TemplateResponse>> getAllTemplates() {
    return ResponseEntity.ok(templateService.getAllTemplates());
  }

  @GetMapping("/api/v1/templates/{slug}")
  public ResponseEntity<TemplateResponse> getTemplateBySlug(@PathVariable(name = "slug") String templateSlug) {
    return ResponseEntity.ok(templateService.getTemplateBySlug(templateSlug));
  }

  // CÁC API YÊU CẦU QUYỀN ADMIN
  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping(value = "/api/v1/admin/templates",consumes = { "multipart/form-data" })
  public ResponseEntity<TemplateResponse> createTemplate(
      // @RequestPart("data"): Lấy phần dữ liệu JSON có tên là "data"
      // @RequestPart("file"): Lấy phần file có tên là "file"
      @RequestPart("data") String createTemplateRequestJson,
      @RequestPart("file") MultipartFile file,
      @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) throws IOException {
    // Dùng ObjectMapper để tự chuyển đổi chuỗi JSON thành đối tượng DTO
    CreateTemplateRequest createTemplateRequest = objectMapper.readValue(createTemplateRequestJson,
        CreateTemplateRequest.class);
    TemplateResponse createdTemplate = templateService.createTemplate(createTemplateRequest, file, thumbnail);
    return new ResponseEntity<>(createdTemplate, HttpStatus.CREATED);
  }

  @PutMapping(value = "/api/v1/admin/templates/{id}", consumes = { "multipart/form-data" })
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TemplateResponse> updateTemplate(
      @PathVariable("id") Long templateId,
      // Nhận 'data' dưới dạng một chuỗi String
      @RequestPart("data") String updateTemplateRequestJson,
      // File không bắt buộc
      @RequestPart(value = "file", required = false) MultipartFile file,
      @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) throws IOException {

    // Dùng ObjectMapper để tự chuyển đổi chuỗi JSON thành đối tượng DTO
    UpdateTemplateRequest updateTemplateRequest = objectMapper.readValue(updateTemplateRequestJson,
        UpdateTemplateRequest.class);

    TemplateResponse updatedTemplate = templateService.updateTemplate(templateId, updateTemplateRequest, file,
        thumbnail);
    return ResponseEntity.ok(updatedTemplate);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/api/v1/admin/templates/{id}")
  public ResponseEntity<String> deleteTemplate(@PathVariable("id") Long templateId) {
    templateService.deleteTemplate(templateId);
    return ResponseEntity.ok("Đã xóa template thành công");
  }

}
