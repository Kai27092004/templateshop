package com.nhanit.backend_templateshop.controller;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nhanit.backend_templateshop.dto.response.OrderResponse;
import com.nhanit.backend_templateshop.dto.response.UserProfileResponse;
import com.nhanit.backend_templateshop.entity.Template;
import com.nhanit.backend_templateshop.exception.ResourceNotFoundException;
import com.nhanit.backend_templateshop.repository.TemplateRepository;
import com.nhanit.backend_templateshop.security.jwt.JwtAuthFilter;
import com.nhanit.backend_templateshop.service.FileStorageService;
import com.nhanit.backend_templateshop.service.OrderService;
import com.nhanit.backend_templateshop.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/account")
@PreAuthorize("isAuthenticated()")
public class AccountController {
  @Autowired
  private UserService userService;

  @Autowired
  private OrderService orderService;

  @Autowired
  private FileStorageService fileStorageService;

  @Autowired
  private TemplateRepository templateRepository;

  private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

  @GetMapping("/profile")
  public ResponseEntity<UserProfileResponse> getUserProfile(Authentication authentication) {
    String email = authentication.getName();
    return ResponseEntity.ok(userService.getUserProfile(email));
  }

  @GetMapping("/orders")
  public ResponseEntity<List<OrderResponse>> getOrderHistory(Authentication authentication) {
    String email = authentication.getName();
    return ResponseEntity.ok(orderService.getOrdersByUserEmail(email));
  }

  @GetMapping("/download/{templateId}")
  public ResponseEntity<Resource> downloadTemplate(@PathVariable Long templateId, Authentication authentication,
      HttpServletRequest request) {
    // 1. Lấy email người dùng đang đăng nhập
    String userEmail = authentication.getName();

    // 2. Kiểm tra xem người dùng này có thực sự đã mua template này không
    boolean hasPurchased = orderService.verifyUserPurchase(userEmail, templateId);
    if (!hasPurchased) {
      // Nếu chưa mua, trả về lỗi 403 Forbidden (Cấm truy cập)
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // 3. Lấy thông tin template để biết tên file cần tải
    Template template = templateRepository.findById(templateId)
        .orElseThrow(() -> new ResourceNotFoundException("Template", "id", templateId));

    // 4. Tải file dưới dạng Resource
    Resource resource = fileStorageService.loadFileAsResource(template.getFilePath());

    // 5. Xác định Content-Type của file
    String contentType = "application/octet-stream";
    try {
      contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
    } catch (IOException ex) {
      logger.info("Could not determine file type.");
    }

    // 6. Trả về file cho client, trình duyệt sẽ tự động kích hoạt chế độ tải xuống
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
        .body(resource);

  }
}
