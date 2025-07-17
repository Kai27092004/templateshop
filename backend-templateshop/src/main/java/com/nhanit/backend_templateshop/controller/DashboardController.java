package com.nhanit.backend_templateshop.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nhanit.backend_templateshop.dto.response.DashboardStatsResponse;
import com.nhanit.backend_templateshop.service.DashboardService;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {
  @Autowired
  private DashboardService dashboardService;

  @GetMapping("/stats")
  public ResponseEntity<DashboardStatsResponse> getStats() {
    return ResponseEntity.ok(dashboardService.getDashboardStats());
  }

  @GetMapping("/revenue-chart")
  public ResponseEntity<List<Map<String, Object>>> getRevenueChart(@RequestParam("year") int year) {
    return ResponseEntity.ok(dashboardService.getRevenueChartData(year));
  }

  @GetMapping("/orders-chart")
  public ResponseEntity<List<Map<String, Object>>> getOrdersChart(@RequestParam("year") int year) {
    return ResponseEntity.ok(dashboardService.getOrdersChartData(year));
  }
}
