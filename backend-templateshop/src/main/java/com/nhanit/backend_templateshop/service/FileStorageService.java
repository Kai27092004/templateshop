package com.nhanit.backend_templateshop.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
  String storeFile(MultipartFile file);

  void deleteFile(String fileName);

  Resource loadFileAsResource(String fileName);
}
