package com.nhanit.backend_templateshop.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nhanit.backend_templateshop.dto.response.DashboardStatsResponse;
import com.nhanit.backend_templateshop.entity.Role;
import com.nhanit.backend_templateshop.repository.OrderRepository;
import com.nhanit.backend_templateshop.repository.TemplateRepository;
import com.nhanit.backend_templateshop.repository.UserRepository;
import com.nhanit.backend_templateshop.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private OrderRepository orderRepository;
  @Autowired
  private TemplateRepository templateRepository;

  @Override
  public DashboardStatsResponse getDashboardStats() {
    long totalUsers = userRepository.countByRole(Role.USER);
    long totalOrders = orderRepository.count();
    long totalTemplates = templateRepository.count();
    Long totalRevenue = orderRepository.getTotalRevenue();

    return DashboardStatsResponse.builder()
        .totalUsers(totalUsers)
        .totalOrders(totalOrders)
        .totalTemplates(totalTemplates)
        .totalRevenue(totalRevenue != null ? totalRevenue : 0)
        .build();
  }
}
