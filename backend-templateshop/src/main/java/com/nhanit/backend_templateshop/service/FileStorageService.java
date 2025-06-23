package com.nhanit.backend_templateshop.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
  String storeFile(MultipartFile file);
  void deleteFile(String fileName);
}
