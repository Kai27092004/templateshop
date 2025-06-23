package com.nhanit.backend_templateshop.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.nhanit.backend_templateshop.exception.AppException;
import com.nhanit.backend_templateshop.service.FileStorageService;

import jakarta.annotation.PostConstruct;

@Service
public class FileStorageServiceImpl implements FileStorageService {
  private final Path fileStorageLocation;
  private static final Logger logger = LoggerFactory.getLogger(FileStorageServiceImpl.class);

  // Lấy đường dẫn thư mục upload từ application.properties
  public FileStorageServiceImpl(@Value("${file.upload-dir}") String uploadDir) {
    this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
  }

  // @PostConstruct sẽ chạy một lần duy nhất ngay sau khi service này được tạo
  @PostConstruct
  public void init() {
    try {
      // Tạo thư mục upload nếu nó chưa tồn tại
      Files.createDirectories(this.fileStorageLocation);
    } catch (Exception ex) {
      throw new AppException("Không thể tạo thư mục để lưu file upload.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Override
  public String storeFile(MultipartFile file) {
    // Lấy tên file gốc và làm sạch nó
    String fileName = StringUtils.cleanPath(file.getOriginalFilename());

    try {
      // Kiểm tra các ký tự không hợp lệ trong tên file
      if (fileName.contains("..")) {
        throw new AppException("Tên file chứa ký tự không hợp lệ " + fileName, HttpStatus.BAD_REQUEST);
      }
      // Tạo đường dẫn đầy đủ tới file
      Path targetLocation = this.fileStorageLocation.resolve(fileName);
      // Copy file vào thư mục đích (ghi đè nếu file đã tồn tại)
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      return fileName;
    } catch (IOException ex) {
      throw new AppException("Không thể lưu file " + fileName + ". Vui lòng thử lại!",
          HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Override
  public void deleteFile(String fileName) {
    // Kiểm tra xem tên file có rỗng hoặc null không để tránh lỗi
    if (!StringUtils.hasText(fileName)) {
      return;
    }

    try {
      Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
      // Xóa file nếu nó tồn tại
      Files.deleteIfExists(filePath);
      logger.info("Đã xóa file thành công: {}", fileName);
    } catch (IOException ex) {
      // Ném ra exception nếu có lỗi trong quá trình xóa file
      logger.error("Không thể xóa file: {}", fileName);
      throw new AppException("Không thể xóa file " + fileName, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
