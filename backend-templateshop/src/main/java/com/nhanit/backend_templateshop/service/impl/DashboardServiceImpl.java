package com.nhanit.backend_templateshop.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

  @Override
  public List<Map<String, Object>> getRevenueChartData(int year) {
    List<Object[]> monthlyRevenues = orderRepository.findRevenueByMonthInYear(year);
    List<Map<String, Object>> chartData = new ArrayList<>();
    // Dùng mảng để dễ truy cập doanh thu tháng trước
    double[] revenues = new double[12];
    for (Object[] result : monthlyRevenues) {
      int month = (Integer) result[0] - 1; // month từ 1-12, index từ 0-11
      revenues[month] = ((Number) result[1]).doubleValue();
    }

    for (int i = 0; i < 12; i++) {
      Map<String, Object> map = new HashMap<>();
      map.put("label", "T" + (i + 1));
      map.put("revenue", revenues[i]);

      double percentageChange = 0.0;
      // Tính phần trăm thay đổi so với tháng trước
      // Bỏ qua tháng đầu tiên (i=0) hoặc nếu tháng trước không có doanh thu
      if (i > 0 && revenues[i - 1] != 0) {
        percentageChange = ((revenues[i] - revenues[i - 1]) / revenues[i - 1]) * 100;
      }
      // Làm tròn đến 2 chữ số thập phân
      map.put("percentageChange", Math.round(percentageChange * 100.0) / 100.0);
      chartData.add(map);
    }
    return chartData;
  }

  @Override
  public List<Map<String, Object>> getOrdersChartData(int year) {
    List<Object[]> monthlyOrders = orderRepository.countOrdersByMonthInYear(year);
    Map<Integer, Long> ordersMap = new HashMap<>();
    for (Object[] result : monthlyOrders) {
      ordersMap.put((Integer) result[0], ((Number) result[1]).longValue());
    }

    List<Map<String, Object>> chartData = new ArrayList<>();
    for (int i = 1; i <= 12; i++) {
      Map<String, Object> map = new HashMap<>();
      map.put("label", "Tháng " + i);
      map.put("value", ordersMap.getOrDefault(i, 0L));
      chartData.add(map);
    }
    return chartData;
  }
}
