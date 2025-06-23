package com.nhanit.backend_templateshop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
  private String accessToken;
  private String tokenType = "Bearer"; // Loại token, thường là "Bearer"

  public AuthResponse(String accessToken) {
    this.accessToken = accessToken;
  }
}
