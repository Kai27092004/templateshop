package com.nhanit.backend_templateshop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhanit.backend_templateshop.entity.Template;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
  // Spring Data JPA sẽ tự động tạo câu lệnh để tìm các template theo categoryId
  List<Template> findByCategoryId(Long categoryId);

  // Tự động tạo câu lệnh để tìm một template bằng slug
  Optional<Template> findBySlug(String slug);
}
