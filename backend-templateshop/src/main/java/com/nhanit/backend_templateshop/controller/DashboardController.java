package com.nhanit.backend_templateshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
