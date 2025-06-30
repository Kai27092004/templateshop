package com.nhanit.backend_templateshop.controller;

import com.nhanit.backend_templateshop.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType; // *** ĐẢM BẢO BẠN DÙNG IMPORT NÀY ***
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/files")
public class FileController {
  private static final Logger logger = LoggerFactory.getLogger(FileController.class);

  @Autowired
  private FileStorageService fileStorageService;

  // API để truy cập một file, bao gồm cả các file trong thư mục con
  @GetMapping("/**")
  public ResponseEntity<Resource> getFile(HttpServletRequest request) {
    // Lấy đường dẫn file từ URL, loại bỏ phần tiền tố /api/v1/files/
    String relativePath = request.getRequestURI().substring("/api/v1/files/".length());

    // Tải file dưới dạng Resource
    Resource resource = fileStorageService.loadFileAsResource(relativePath);

    // Xác định Content-Type của file
    String contentType = "application/octet-stream";
    try {
      contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
    } catch (IOException ex) {
      logger.info("Không thể xác định kiểu file: {}", relativePath);
    }

    // Nếu không xác định được, đặt mặc định
    if (contentType == null) {
      contentType = "application/octet-stream";
    }

    // Trả về file với Content-Type phù hợp
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
  }
}
