-- Tạo một cơ sở dữ liệu mới nếu nó chưa tồn tại.
-- Sử dụng collation utf8mb4_unicode_ci để hỗ trợ tiếng Việt tốt nhất.
CREATE DATABASE IF NOT EXISTS template_shop_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Sử dụng cơ sở dữ liệu vừa tạo.
USE template_shop_db;

-- Tạo các bảng cho hệ thống.
-- Bảng users
CREATE TABLE IF NOT EXISTS users
(
	id 					BIGINT 				AUTO_INCREMENT PRIMARY KEY,
    full_name			NVARCHAR(100) 		NULL,
    email				VARCHAR(100)		NOT NULL UNIQUE,
    password			VARCHAR(255)		NOT NULL,
    role				VARCHAR(20)		    NOT NULL DEFAULT 'USER', -- Mặc định là 'Người dùng', có thể là 'Quản trị viên'
    created_at			TIMESTAMP			DEFAULT CURRENT_TIMESTAMP
);
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- Bảng categories
CREATE TABLE IF NOT EXISTS categories
(
	id 					BIGINT 				AUTO_INCREMENT PRIMARY KEY,
    name				NVARCHAR(100)		NOT NULL,
    slug				VARCHAR(100)		NOT NULL UNIQUE	
);

-- Bảng templates
CREATE TABLE IF NOT EXISTS templates
(
	id 					BIGINT 				AUTO_INCREMENT PRIMARY KEY,
    name				NVARCHAR(255)		NOT NULL,
    slug				VARCHAR(255)		NOT NULL UNIQUE,
    description			TEXT				NULL,
    price				BIGINT				NOT NULL,
    thumbnail_url		VARCHAR(255)		NULL,
    live_demo_url		VARCHAR(255)		NULL,
    file_path			VARCHAR(255)		NOT NULL,
    category_id			BIGINT				NULL,
    created_at			TIMESTAMP			DEFAULT CURRENT_TIMESTAMP,
    updated_at			TIMESTAMP			DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL -- Nếu xóa danh mục thì trường này thành NULL
);

-- Bảng orders
CREATE TABLE IF NOT EXISTS orders
(
	id 					BIGINT 				AUTO_INCREMENT PRIMARY KEY,
    user_id				BIGINT				NOT NULL,
    order_date			TIMESTAMP			DEFAULT CURRENT_TIMESTAMP,
    total_amount		BIGINT				NOT NULL,
    status				VARCHAR(20)			NOT NULL DEFAULT 'PENDING', -- Đang xử lý, Thành công, Thất bại
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Bảng order_details
CREATE TABLE order_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase BIGINT NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE RESTRICT,
    
    -- Ràng buộc UNIQUE trên cặp (order_id, template_id)
    UNIQUE KEY `unique_order_template` (`order_id`, `template_id`)
);

-- =================================================================================
-- Chèn dữ liệu mẫu để kiểm thử
-- =================================================================================
USE template_shop_db;
-- =================================================================
-- 1. TẠO 4 DANH MỤC
-- =================================================================
INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Landing Page Bất động sản', 'bat-dong-san'),
(2, 'Landing Page Thời trang & Mỹ phẩm', 'thoi-trang-my-pham'),
(3, 'Landing Page Giáo dục & Khóa học', 'giao-duc-khoa-hoc'),
(4, 'Landing Page Du lịch & Sự kiện', 'du-lich-su-kien');

-- =================================================================
-- 2. TẠO 1 ADMIN VÀ 9 NGƯỜI DÙNG
-- Mật khẩu cho Admin là 'admin123' đã được mã hóa
-- Mật khẩu cho User là 'user123' đã được mã hóa
-- =================================================================
INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Quản Trị Viên Chính', 'admin@email.com', '$2a$10$o2Vpobr8u4IK3J9c1bK3LOR3KPHVUkdhOpwYKUijMAj22w7AFoujq', 'ADMIN', NOW()),
(2, 'Nguyễn Văn An', 'nguyen.an@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW()),
(3, 'Trần Thị Bình', 'tran.binh@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW()),
(4, 'Lê Minh Cường', 'le.cuong@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW()),
(5, 'Phạm Thị Dung', 'pham.dung@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW()),
(6, 'Võ Văn Em', 'vo.em@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW()),
(7, 'Đỗ Thị Giang', 'do.giang@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW()),
(8, 'Hoàng Văn Hải', 'hoang.hai@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW()),
(9, 'Ngô Thị Kim', 'ngo.kim@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW()),
(10, 'Trịnh Văn Long', 'trinh.long@email.com', '$2a$10$NfcrUXuD0ZLAzOGcQRvGZe3WZCXHi7cVgsYPY4QUmgbBfqCkpRbPe', 'USER', NOW());

-- =================================================================
-- 3. TẠO 10 TEMPLATE
-- =================================================================
INSERT INTO `templates` (`id`, `name`, `slug`, `description`, `price`, `category_id`, `file_path`, `thumbnail_url`, `live_demo_url`, `created_at`, `updated_at`) VALUES
(1, 'SunVilla Real Estate', 'sunvilla-real-estate', 'Template bất động sản sang trọng, hiện đại, tối ưu cho dự án biệt thự, nghỉ dưỡng.', 450000, 1, 'sunvilla.zip', 'images/thumb-real-estate-1.jpg', '#', NOW(), NOW()),
(2, 'Metro Fashion Store', 'metro-fashion-store', 'Template cho cửa hàng thời trang, phong cách tối giản, tập trung vào sản phẩm.', 300000, 2, 'metro.zip', 'images/thumb-fashion-1.jpg', '#', NOW(), NOW()),
(3, 'EduHub Online Course', 'eduhub-online-course', 'Template cho các khóa học trực tuyến, tích hợp form đăng ký và giới thiệu giảng viên.', 350000, 3, 'eduhub.zip', 'images/thumb-education-1.jpg', '#', NOW(), NOW()),
(4, 'TravelGo Adventure Tours', 'travelgo-adventure-tours', 'Template du lịch, tour mạo hiểm với hiệu ứng parallax và gallery ảnh ấn tượng.', 320000, 4, 'travelgo.zip', 'images/thumb-travel-1.jpg', '#', NOW(), NOW()),
(5, 'Modern Apartment Complex', 'modern-apartment-complex', 'Template giới thiệu dự án chung cư cao cấp, đầy đủ mặt bằng và tiện ích.', 500000, 1, 'apartment.zip', 'images/thumb-real-estate-2.jpg', '#', NOW(), NOW()),
(6, 'Luxe Cosmetics Brand', 'luxe-cosmetics-brand', 'Template cho thương hiệu mỹ phẩm, tông màu pastel, thiết kế thanh lịch.', 280000, 2, 'luxe.zip', 'images/thumb-fashion-2.jpg', '#', NOW(), NOW()),
(7, 'E-Learning Platform', 'elearning-platform', 'Template nền tảng học tập, cho phép bán nhiều khóa học, có trang blog.', 400000, 3, 'elearning.zip', 'images/thumb-education-2.jpg', '#', NOW(), NOW()),
(8, 'City Event Conference', 'city-event-conference', 'Template cho sự kiện, hội thảo, có lịch trình, diễn giả và form đăng ký tham dự.', 250000, 4, 'conference.zip', 'images/thumb-event-1.jpg', '#', NOW(), NOW()),
(9, 'Luxury Watch Showcase', 'luxury-watch-showcase', 'Template one-page giới thiệu sản phẩm đồng hồ cao cấp, hiệu ứng animation tinh tế.', 290000, 2, 'watch.zip', 'images/thumb-fashion-3.jpg', '#', NOW(), NOW()),
(10, 'Minimalist Portfolio', 'minimalist-portfolio', 'Template portfolio đơn giản, sạch sẽ, phù hợp cho các freelancer, nhiếp ảnh gia.', 150000, 2, 'portfolio.zip', 'images/thumb-portfolio-1.jpg', '#', NOW(), NOW());

-- =================================================================
-- 4. TẠO 100 ĐƠN HÀNG (TỰ ĐỘNG)
-- =================================================================
DELIMITER $$
CREATE PROCEDURE CreateRandomOrders()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE order_user_id INT;
    DECLARE order_status ENUM('PENDING', 'COMPLETED', 'CANCELLED');
    DECLARE order_date DATETIME;
    DECLARE current_order_id BIGINT;
    DECLARE total_order_amount BIGINT;
    DECLARE items_in_order INT;

    -- Vòng lặp để tạo 100 đơn hàng
    order_loop: WHILE i < 100 DO
        SET i = i + 1;
        SET total_order_amount = 0;
        
        -- Chọn ngẫu nhiên thông tin cho đơn hàng cha
        SET order_user_id = FLOOR(2 + (RAND() * 9));
        SET order_status = ELT(FLOOR(1 + RAND() * 3), 'PENDING', 'COMPLETED', 'CANCELLED');
        SET order_date = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY);

        -- Tạo đơn hàng cha với tổng tiền ban đầu là 0
        INSERT INTO orders (user_id, status, total_amount, order_date) 
        VALUES (order_user_id, order_status, 0, order_date);
        SET current_order_id = LAST_INSERT_ID();

        -- Mỗi đơn hàng sẽ có từ 1 đến 3 sản phẩm khác nhau
        SET items_in_order = FLOOR(1 + (RAND() * 3));
        
        -- Thêm các chi tiết đơn hàng (sản phẩm)
        INSERT INTO order_details (order_id, template_id, quantity, price_at_purchase)
        SELECT 
            current_order_id,
            t.id,
            1, -- Mặc định số lượng là 1
            t.price
        FROM 
            templates t
        -- Lấy ngẫu nhiên các sản phẩm mà không bị trùng lặp
        ORDER BY RAND()
        LIMIT items_in_order;

        -- Tính lại tổng tiền từ các chi tiết đơn hàng vừa được thêm vào
        SELECT SUM(price_at_purchase * quantity) INTO total_order_amount 
        FROM order_details WHERE order_id = current_order_id;

        -- Cập nhật lại tổng tiền cho đơn hàng cha
        UPDATE orders SET total_amount = total_order_amount WHERE id = current_order_id;

    END WHILE order_loop;
END$$
DELIMITER ;

-- Gọi procedure để tạo 100 đơn hàng
CALL CreateRandomOrders();

-- Xóa procedure sau khi đã dùng xong
DROP PROCEDURE CreateRandomOrders;

DROP TABLE IF EXISTS order_details;


