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
    role				NVARCHAR(20)		NOT NULL DEFAULT 'Người Dùng', -- Mặc định là 'Người dùng', có thể là 'Quản trị viên'
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
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL -- Nếu xóa danh mục thì trường này thành NULL
);

-- Bảng orders
CREATE TABLE IF NOT EXISTS orders
(
	id 					BIGINT 				AUTO_INCREMENT PRIMARY KEY,
    user_id				BIGINT				NOT NULL,
    order_date			TIMESTAMP			DEFAULT CURRENT_TIMESTAMP,
    total_amount		BIGINT				NOT NULL,
    status				NVARCHAR(20)		NOT NULL DEFAULT 'Đang xử lý', -- Đang xử lý, Thành công, Thất bại
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Bảng order_details
CREATE TABLE IF NOT EXISTS order_details
(
	id 					BIGINT 				AUTO_INCREMENT PRIMARY KEY,
    order_id 			BIGINT				NOT NULL,
    template_id			BIGINT				NOT NULL,
    price_at_purchase	BIGINT				NOT NULL, -- Lưu lại giá tại thời điểm mua
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE, -- Nếu xóa đơn hàng thì xóa chi tiết
    FOREIGN KEY(template_id) REFERENCES templates(id) ON DELETE RESTRICT, -- Không cho xóa template nếu đã có trong đơn hàng
    UNIQUE(order_id, template_id) -- Mỗi template chỉ xuất hiện 1 lần trong 1 đơn hàng
);

-- =================================================================================
-- Chèn dữ liệu mẫu để kiểm thử
-- =================================================================================

-- Thêm 2 danh mục mẫu
INSERT INTO categories (name, slug) VALUES
('Landing Page Bất động sản', 'bat-dong-san'),
('Landing Page Thời trang & Mỹ phẩm', 'thoi-trang-my-pham');

-- Thêm người dùng mẫu
-- LƯU Ý: Mật khẩu '123456' này chỉ là placeholder.
-- Trong ứng dụng thực tế, bạn PHẢI mã hóa (hash) mật khẩu bằng BCrypt.
INSERT INTO users (full_name, email, password, role) VALUES
('Quản Trị Viên', 'admin@email.com', 'admin123', 'Quản Trị Viên'), 
('Khách Hàng A', 'customer.a@email.com', 'user123', 'Người Dùng'); 


-- Thêm 3 template mẫu
INSERT INTO templates (name, slug, description, price, category_id, thumbnail_url, live_demo_url, file_path) VALUES
('Vinhomes Grand Park Template', 'vinhomes-grand-park', 'Mẫu landing page hiện đại cho dự án bất động sản cao cấp, tối ưu hóa cho việc thu thập thông tin khách hàng tiềm năng.', 300000, 1, 'https://placehold.co/600x400/3498db/ffffff?text=Vinhomes', '#', '/files/vinhomes.zip'),
('The Ocean Villa Template', 'the-ocean-villa', 'Landing page sang trọng, tập trung vào hình ảnh, phù hợp cho các dự án nghỉ dưỡng, biệt thự biển.', 500000, 1, 'https://placehold.co/600x400/1abc9c/ffffff?text=Ocean+Villa', '#', '/files/ocean.zip'),
('Seoul Fashion Week Template', 'seoul-fashion', 'Mẫu landing page trẻ trung, năng động, phù hợp cho các sự kiện thời trang, cửa hàng quần áo hoặc bộ sưu tập mỹ phẩm mới.', 200000, 2, 'https://placehold.co/600x400/9b59b6/ffffff?text=Seoul+Fashion', '#', '/files/seoul.zip');


