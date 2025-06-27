package com.nhanit.backend_templateshop.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "orders")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @CreationTimestamp
  @Column(name = "order_date", updatable = false)
  private LocalDateTime orderDate;

  @Column(name = "total_amount", nullable = false)
  private Long totalAmount;

  @Column(nullable = false)
  private String status;

  // Mối quan hệ Một-Nhiều với OrderDetail
  // cascade = CascadeType.ALL: Khi lưu Order, các OrderDetail con cũng được lưu
  // theo.
  // orphanRemoval = true: Khi xóa một OrderDetail khỏi danh sách này, nó cũng sẽ
  // bị xóa khỏi CSDL.
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<OrderDetail> orderDetails = new ArrayList<>();
}
