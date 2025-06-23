package com.nhanit.backend_templateshop.security.jwt;

import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoder;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component // Đánh dấu đây là một Spring Bean để có thể inject ở nơi khác
public class JwtTokenProvider {
  // Sử dụng Logger để ghi lại các lỗi, giúp debug dễ dàng hơn
  private final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

  // Lấy giá trị từ file application.properties
  // Đây là chuỗi bí mật để ký (sign) vào token, chỉ server biết
  @Value("${app.jwt-secret}")
  private String jwtSecret;

  // Thời gian hết hạn của token (tính bằng mili giây)
  @Value("${app.jwt-expiration-milliseconds}")
  private Long jwtExpirationDate;

  // Phương thức chính để tạo ra một JWT từ thông tin xác thực của người dùng
  public String generationToken(Authentication authentication) {
    String username = authentication.getName();

    Date currentDate = new Date();
    Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

    return Jwts.builder()
        .setSubject(username) // Set username (ở đây là email) vào phần subject của token
        .setIssuedAt(new Date()) // Thời gian phát hành
        .setExpiration(expireDate) // Thời gian hết hạn
        .signWith(key(), SignatureAlgorithm.HS256) // Ký vào token với thuật toán HS256
        .compact(); // Xây dựng và trả về chuỗi token
  }

  // Tạo ra đối tượng Key từ chuỗi bí mật
  private Key key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  // Phương thức lấy email từ một JWT
  public String getEmailFromJWT(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(key())
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  // Phương thức kiểm tra tính hợp lệ của một JWT
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
          .setSigningKey(key())
          .build()
          .parse(token);
      return true;
    } catch (MalformedJwtException ex) {
      logger.error("Invalid JWT token");
    } catch (ExpiredJwtException ex) {
      logger.error("Expired JWT token");
    } catch (UnsupportedJwtException ex) {
      logger.error("Unsupported JWT token");
    } catch (IllegalArgumentException ex) {
      logger.error("JWT claims string is empty.");
    }
    return false;
  }
}
