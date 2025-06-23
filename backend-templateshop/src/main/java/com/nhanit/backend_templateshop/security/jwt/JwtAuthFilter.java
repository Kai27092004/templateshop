package com.nhanit.backend_templateshop.security.jwt;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nhanit.backend_templateshop.security.UserDetailsServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
// OncePerRequestFilter đảm bảo filter này chỉ chạy một lần cho mỗi request
public class JwtAuthFilter extends OncePerRequestFilter {

  private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  // Đây là phương thức chính của bộ lọc
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    // 1. Lấy JWT token từ request
    String token = getTokenFromRequest(request);

    // 2. Kiểm tra xem token có hợp lệ không
    if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
      // 3. Nếu hợp lệ, lấy email từ token
      String email = jwtTokenProvider.getEmailFromJWT(token);

      // 4. Tải thông tin người dùng từ CSDL
      UserDetails userDetails = userDetailsService.loadUserByUsername(email);

      // 5. Tạo một đối tượng Authentication
      UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
          userDetails,
          null,
          userDetails.getAuthorities());

      authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

      // 6. Đặt đối tượng Authentication này vào SecurityContext
      // Từ đây, Spring Security sẽ biết người dùng này đã được xác thực
      SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }

    // 7. Chuyển request và response cho bộ lọc tiếp theo trong chuỗi
    filterChain.doFilter(request, response);
  }

  // Phương thức trợ giúp để lấy token từ "Authorization" header
  private String getTokenFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");

    // Token thường có dạng "Bearer <token>"
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
      return bearerToken.substring(7); // Bỏ đi chữ "Bearer "
    }
    return null;
  }
}
