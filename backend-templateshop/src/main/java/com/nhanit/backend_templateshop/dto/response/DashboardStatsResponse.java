package com.nhanit.backend_templateshop.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
  private long totalUsers;
  private long totalOrders;
  private long totalTemplates;
  private long totalRevenue;
}
