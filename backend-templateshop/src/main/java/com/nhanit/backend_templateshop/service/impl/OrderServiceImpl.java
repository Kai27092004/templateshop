package com.nhanit.backend_templateshop.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nhanit.backend_templateshop.dto.request.OrderRequest;
import com.nhanit.backend_templateshop.dto.response.CategoryResponse;
import com.nhanit.backend_templateshop.dto.response.OrderDetailResponse;
import com.nhanit.backend_templateshop.dto.response.OrderResponse;
import com.nhanit.backend_templateshop.dto.response.TemplateResponse;
import com.nhanit.backend_templateshop.entity.Order;
import com.nhanit.backend_templateshop.entity.OrderDetail;
import com.nhanit.backend_templateshop.entity.Template;
import com.nhanit.backend_templateshop.entity.User;
import com.nhanit.backend_templateshop.exception.ResourceNotFoundException;
import com.nhanit.backend_templateshop.repository.OrderRepository;
import com.nhanit.backend_templateshop.repository.TemplateRepository;
import com.nhanit.backend_templateshop.repository.UserRepository;
import com.nhanit.backend_templateshop.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {
  @Autowired
  private OrderRepository orderRepository;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private TemplateRepository templateRepository;
  @Autowired
  private ModelMapper modelMapper;

  @Override
  @Transactional // Đảm bảo tất cả các thao tác CSDL trong hàm này đều thành công, hoặc sẽ
                 // rollback toàn bộ
  public Order createOrder(OrderRequest orderRequest, String userEmail) {
    // 1. Tìm người dùng đang đặt hàng
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
    // 2. Tạo một đối tượng Order mới
    Order order = new Order();
    order.setUser(user);
    order.setStatus("PENDING");

    long totalAmount = 0;
    List<OrderDetail> orderDetails = new ArrayList<>();

    // 3. Lặp qua từng sản phẩm trong giỏ hàng từ request
    for (var cartItem : orderRequest.getCartItems()) {
      // Tìm template tương ứng trong CSDL
      Template template = templateRepository.findById(cartItem.getTemplateId())
          .orElseThrow(() -> new ResourceNotFoundException("Template", "id", cartItem.getTemplateId()));

      // Tạo một chi tiết đơn hàng mới
      OrderDetail orderDetail = new OrderDetail();
      orderDetail.setOrder(order);
      orderDetail.setTemplate(template);
      orderDetail.setQuantity(cartItem.getQuantity());
      orderDetail.setPriceAtPurchase(template.getPrice()); // Lưu lại giá tại thời điểm mua

      orderDetails.add(orderDetail);
      totalAmount += template.getPrice() * cartItem.getQuantity();
    }
    // 4. Gán danh sách chi tiết và tổng tiền vào đơn hàng
    order.setOrderDetails(orderDetails);
    order.setTotalAmount(totalAmount);

    // 5. Lưu đơn hàng vào CSDL (các chi tiết sẽ được lưu tự động nhờ Cascade)
    return orderRepository.save(order);

  }

  @Override
  @Transactional(readOnly = true)
  public List<OrderResponse> getOrdersByUserEmail(String userEmail) {
    // 1. Tìm user
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

    // 2. Tìm tất cả các đơn hàng của user đó
    List<Order> orders = orderRepository.findUserOrdersWithDetails(user.getId());

    // 3. Chuyển đổi List<Order> thành List<OrderResponse>
    return orders.stream()
        .map(this::mapToOrderResponse) // Gọi hàm helper để chuyển đổi
        .collect(Collectors.toList());

  }

  private OrderResponse mapToOrderResponse(Order order) {
    OrderResponse orderResponse = new OrderResponse();
    orderResponse.setId(order.getId());
    orderResponse.setOrderDate(order.getOrderDate());
    orderResponse.setTotalAmount(order.getTotalAmount());
    orderResponse.setStatus(order.getStatus());

    List<OrderDetailResponse> detailResponses = order.getOrderDetails().stream()
        .map(detail -> {
          OrderDetailResponse detailResponse = new OrderDetailResponse();
          detailResponse.setQuantity(detail.getQuantity());
          detailResponse.setPriceAtPurchase(detail.getPriceAtPurchase());

          // Chuyển đổi Template
          TemplateResponse templateResponse = new TemplateResponse();
          templateResponse.setId(detail.getTemplate().getId());
          templateResponse.setName(detail.getTemplate().getName());
          templateResponse.setSlug(detail.getTemplate().getSlug());
          templateResponse.setPrice(detail.getTemplate().getPrice());
          templateResponse.setDescription(detail.getTemplate().getDescription());
          // ... bạn có thể thêm các trường khác của TemplateResponse nếu muốn

          // Chuyển đổi Category
          if (detail.getTemplate().getCategory() != null) {
            CategoryResponse categoryDto = new CategoryResponse();
            categoryDto.setId(detail.getTemplate().getCategory().getId());
            categoryDto.setName(detail.getTemplate().getCategory().getName());
            categoryDto.setSlug(detail.getTemplate().getCategory().getSlug());
            templateResponse.setCategory(categoryDto);
          }

          detailResponse.setTemplate(templateResponse);
          return detailResponse;
        }).collect(Collectors.toList());

    orderResponse.setOrderDetails(detailResponses);
    return orderResponse;
  }

  public boolean verifyUserPurchase(String userEmail, Long templateId) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
    return orderRepository.existsByUserIdAndTemplateId(user.getId(), templateId);
  }
}
