package com.nhanit.backend_templateshop.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

// @ControllerAdvice: Annotation này cho phép chúng ta xử lý các exception
// được ném ra từ bất kỳ Controller nào trong ứng dụng một cách tập trung.
@ControllerAdvice
public class GlobalExceptionHandler {
  // @ExceptionHandler: Đánh dấu phương thức này sẽ xử lý các exception thuộc lớp
  // AppException
  @ExceptionHandler(value = AppException.class)
  public ResponseEntity<String> handlingAppException(AppException exception) {
    return ResponseEntity
        .status(exception.getStatus())
        .body(exception.getMessage());
  }

  // Phương thức này sẽ xử lý các lỗi validation
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
    return ResponseEntity.badRequest().body(errors);
  }
}
