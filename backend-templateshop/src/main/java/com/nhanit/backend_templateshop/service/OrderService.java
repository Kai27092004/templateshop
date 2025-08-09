package com.nhanit.backend_templateshop.service;

import java.util.List;

import com.nhanit.backend_templateshop.dto.request.OrderRequest;
import com.nhanit.backend_templateshop.dto.response.OrderResponse;
import com.nhanit.backend_templateshop.entity.Order;

public interface OrderService {
  Order createOrder(OrderRequest orderRequest, String userEmail);

  List<OrderResponse> getOrdersByUserEmail(String userEmail);

  boolean verifyUserPurchase(String userEmail, Long templateId);

  void deleteOrder(Long orderId);

  List<OrderResponse> getAllOrders();

  Order confirmOrderPayment(Long orderId, String userEmail);

  void cancelOrder(Long orderId, String userEmail);

  List<String> getPurchasedTemplateIds();

  List<String> getPendingTemplateIds();
}
