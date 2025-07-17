package com.nhanit.backend_templateshop.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.nhanit.backend_templateshop.dto.response.DashboardStatsResponse;

public interface DashboardService {
  DashboardStatsResponse getDashboardStats();

  List<Map<String, Object>> getRevenueChartData(int year);

  List<Map<String, Object>> getOrdersChartData(int year);
}
