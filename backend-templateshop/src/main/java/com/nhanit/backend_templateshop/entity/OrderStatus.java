package com.nhanit.backend_templateshop.entity;

public enum OrderStatus {
  PENDING("Chờ thanh toán"),
  COMPLETED("Đã thanh toán"),
  CANCELLED("Đã hủy");

  private final String displayName;

  OrderStatus(String displayName) {
    this.displayName = displayName;
  }

  public String getDisplayName() {
    return displayName;
  }
}
