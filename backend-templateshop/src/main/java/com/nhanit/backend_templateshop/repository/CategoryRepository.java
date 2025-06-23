package com.nhanit.backend_templateshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nhanit.backend_templateshop.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>  {
  
}
