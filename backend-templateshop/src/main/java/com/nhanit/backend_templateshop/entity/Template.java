package com.nhanit.backend_templateshop.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "templates")
public class Template {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String slug;

  @Lob // Đánh dấu đây là một trường lớn, tương ứng với kiểu TEXT trong CSDL
  private String description;

  @Column(nullable = false)
  private Long price;

  @Column(name = "thumbnail_url")
  private String thumbnailUrl;

  @Column(name = "live_demo_url")
  private String liveDemoUrl;

  @Column(name = "file_path", nullable = false)
  private String filePath;

  @CreationTimestamp // Tự động gán thời gian hiện tại khi tạo mới
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp // Tự động cập nhật thời gian khi có sự thay đổi
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  // Mối quan hệ Nhiều-Một với Category
  // Một Template thuộc về một Category
  @ManyToOne(fetch = FetchType.LAZY) // LAZY: chỉ tải Category khi thực sự cần
  @JoinColumn(name = "category_id") // Tên cột khóa ngoại trong bảng 'templates'
  private Category category;
}
