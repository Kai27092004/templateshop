package com.nhanit.backend_templateshop.service.impl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.nhanit.backend_templateshop.exception.AppException;
import com.nhanit.backend_templateshop.exception.ResourceNotFoundException;
import com.nhanit.backend_templateshop.service.FileStorageService;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageServiceImpl implements FileStorageService {
  private final Path rootLocation;
  private static final Logger logger = LoggerFactory.getLogger(FileStorageServiceImpl.class);

  // Lấy đường dẫn thư mục upload từ application.properties
  public FileStorageServiceImpl(@Value("${file.upload-dir}") String uploadDir) {
    // Đường dẫn thư mục upload chính (ví dụ: ./uploads)
    this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
  }

  // @PostConstruct sẽ chạy một lần duy nhất ngay sau khi service này được tạo
  @PostConstruct
  public void init() {
    try {
      // Tạo thư mục upload nếu nó chưa tồn tại
      Files.createDirectories(this.rootLocation);
    } catch (Exception ex) {
      throw new AppException("Không thể tạo thư mục uploads.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Override
  public String storeFile(MultipartFile file) {
    return store(file, "");
  }

  @Override
  public String storeImageFile(MultipartFile file) {
    return store(file, "images");
  }

  private String store(MultipartFile file, String subDir) {
    try {
      // Tạo thư mục con nếu có và nếu nó chưa tồn tại
      Path targetDir = this.rootLocation.resolve(subDir).normalize();
      Files.createDirectories(targetDir);

      String fileName = StringUtils.cleanPath(file.getOriginalFilename());
      if (fileName.contains("..")) {
        throw new AppException("Tên file chứa ký tự không hợp lệ " + fileName, HttpStatus.BAD_REQUEST);
      }

      // Copy file vào thư mục đích
      Path targetLocation = targetDir.resolve(fileName);
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      // Trả về đường dẫn tương đối bao gồm cả thư mục con (nếu có)
      return Paths.get(subDir, fileName).toString().replace("\\", "/");
    } catch (IOException ex) {
      throw new AppException("Không thể lưu file. Vui lòng thử lại!", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Override
  public void deleteFile(String fileName) {
    // Kiểm tra xem tên file có rỗng hoặc null không để tránh lỗi
    if (!StringUtils.hasText(fileName)) {
      return;
    }

    try {
      Path filePath = this.rootLocation.resolve(fileName).normalize();
      // Xóa file nếu nó tồn tại
      Files.deleteIfExists(filePath);
      logger.info("Đã xóa file thành công: {}", fileName);
    } catch (IOException ex) {
      // Ném ra exception nếu có lỗi trong quá trình xóa file
      logger.error("Không thể xóa file: {}", fileName);
      throw new AppException("Không thể xóa file " + fileName, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Override
  public Resource loadFileAsResource(String fileName) {
    try {
      Path filePath = this.rootLocation.resolve(fileName).normalize();
      Resource resource = new UrlResource(filePath.toUri());
      if (resource.exists()) {
        return resource;
      } else {
        throw new ResourceNotFoundException("File", "name", fileName);
      }
    } catch (MalformedURLException ex) {
      throw new ResourceNotFoundException("File", "name", fileName);
    }
  }
}
