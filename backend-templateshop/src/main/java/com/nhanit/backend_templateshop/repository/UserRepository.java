package com.nhanit.backend_templateshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhanit.backend_templateshop.entity.Role;
import com.nhanit.backend_templateshop.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  long countByRole(Role role);
}
