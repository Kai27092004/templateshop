package com.nhanit.backend_templateshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nhanit.backend_templateshop.entity.Order;
import com.nhanit.backend_templateshop.entity.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
        // List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
        @Query("SELECT o FROM Order o " +
                        "LEFT JOIN FETCH o.orderDetails od " +
                        "LEFT JOIN FETCH od.template t " +
                        "LEFT JOIN FETCH t.category " +
                        "WHERE o.user.id = :userId " +
                        "ORDER BY o.orderDate DESC")
        List<Order> findUserOrdersWithDetails(@Param("userId") Long userId);

        @Query("SELECT COUNT(o) > 0 FROM Order o " +
                        "JOIN o.orderDetails od " +
                        "WHERE o.user.id = :userId AND od.template.id = :templateId AND o.status = :status")
        boolean existsByUserIdAndTemplateId(
                        @Param("userId") Long userId,
                        @Param("templateId") Long templateId,
                        @Param("status") OrderStatus status);

        @Query("SELECT o FROM Order o " +
                        "LEFT JOIN FETCH o.orderDetails od " +
                        "LEFT JOIN FETCH od.template t " +
                        "LEFT JOIN FETCH o.user " +
                        "ORDER BY o.orderDate DESC")
        List<Order> findAllWithDetails();

        long count();

        @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED'")
        Long getTotalRevenue();

        // Lọc doanh thu theo tháng của một năm cụ thể
        @Query("SELECT FUNCTION('MONTH', o.orderDate) as month, SUM(o.totalAmount) as total " +
                        "FROM Order o " +
                        "WHERE o.status = 'COMPLETED' AND FUNCTION('YEAR', o.orderDate) = :year " +
                        "GROUP BY month " +
                        "ORDER BY month")
        List<Object[]> findRevenueByMonthInYear(@Param("year") int year);

        // Lọc số lượng đơn hàng theo tháng của một năm cụ thể
        @Query("SELECT FUNCTION('MONTH', o.orderDate) as month, COUNT(o.id) as count " +
                        "FROM Order o " +
                        "WHERE o.status = 'COMPLETED' AND FUNCTION('YEAR', o.orderDate) = :year " +
                        "GROUP BY month " +
                        "ORDER BY month")
        List<Object[]> countOrdersByMonthInYear(@Param("year") int year);

        @Query("SELECT od.template.id FROM OrderDetail od WHERE od.order.user.id = :userId AND od.order.status = com.nhanit.backend_templateshop.entity.OrderStatus.COMPLETED")
        List<String> findPurchasedTemplateIdsByUserId(@Param("userId") Long userId);

        @Query("SELECT od.template.id FROM OrderDetail od WHERE od.order.user.id = :userId AND od.order.status = com.nhanit.backend_templateshop.entity.OrderStatus.PENDING")
        List<String> findPendingTemplateIdsByUserId(@Param("userId") Long userId);
}
