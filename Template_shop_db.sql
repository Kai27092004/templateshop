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

-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE templates;
-- TRUNCATE TABLE orders;
-- TRUNCATE TABLE order_details;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================================
-- Chèn dữ liệu mẫu để kiểm thử
-- =================================================================================
-- =================================================================
-- 1. TẠO 4 DANH MỤC
-- =================================================================
INSERT INTO `categories` (`id`, `name`, `slug`) VALUES
(1, 'Thức ăn & Đồ uống', 'thuc-an-do-uong'),
(2, 'Sức khỏe & Mỹ phẩm', 'thoi-trang-my-pham'),
(3, 'Cửa hàng nội thất', 'cua-hang-noi-that'),
(4, 'Trang sức & Phụ kiện', 'trang-suc-phu-kien');

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
(1, 'SHOPNK Bakery', 'shopnk-bakery', 'Template cho cửa hàng bánh mì.', 450000, 1, 'bakery.zip', 'images/bakery.png', 'https://pagefly.io/pages/preview?template=boulanger', NOW(), NOW()),
(2, 'SHOPNK Drink Store', 'shopnk-drink-store', 'Template cho cửa hàng nước uống.', 300000, 1, 'drink.zip', 'images/drink.png', 'https://pagefly.io/pages/preview?template=fizzy', NOW(), NOW()),
(3, 'SHOPNK Beauty', 'shopnk-beauty', 'Template cho cửa hàng mỹ phẩm', 350000, 2, 'beauty.zip', 'images/beauty.png', 'https://pagefly.io/pages/preview?template=chloe', NOW(), NOW()),
(4, 'SHOPNK Medisense', 'shopnk-medisense', 'Template cho sản phẩm sức khỏe.', 320000, 2, 'medisense.zip', 'images/medisense.png', 'https://pagefly.io/pages/preview?template=medisense', NOW(), NOW()),
(5, 'SHOPNK Brook', 'shopnk-brook', 'Template cho cửa hàng nội thất Brook.', 500000, 3, 'brook.zip', 'images/brook.png', 'https://pagefly.io/pages/preview?template=brookwood', NOW(), NOW()),
(6, 'SHOPNK Interno', 'shopnk-interno', 'Template cho cửa hàng nội thất Interno.', 280000, 3, 'interno.zip', 'images/interno.png', 'https://pagefly.io/pages/preview?template=interno', NOW(), NOW()),
(7, 'SHOPNK Nivellia', 'shopnk-nivellia', 'Template cho cửa hàng trang sức.', 400000, 4, 'nivellia.zip', 'images/nivellia.png', 'https://pagefly.io/pages/preview?template=nivellia', NOW(), NOW()),
(8, 'SHOPNK Packy', 'shopnk-packy', 'Template cho cửa hàng phụ kiện.', 250000, 4, 'packy.zip', 'images/packy.png', 'https://pagefly.io/pages/preview?template=packy', NOW(), NOW());


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

-- DROP TABLE IF EXISTS order_details;


