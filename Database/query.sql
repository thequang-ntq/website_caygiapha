USE caygiapha;

-- Bảng dòng họ: lưu thông tin dòng họ
CREATE TABLE dongho (
	id INT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(50) NOT NULL,
    quequan VARCHAR(255) NOT NULL,
    tenchinhanh VARCHAR(255),
    ghichu TEXT,
    thoidiemtao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng thanhvien: lưu thông tin các thành viên trong dòng họ, dòng họ mất --> thành viên mất
CREATE TABLE thanhvien ( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
    dongho_id INT DEFAULT 1,
    hoten VARCHAR(200) NOT NULL,
    gioitinh ENUM('Nam', 'Nữ', 'Khác') DEFAULT 'Khác', 
    ngaysinh DATE,
    noisinh VARCHAR(255),
    diachi VARCHAR(255),
    sdt VARCHAR(20),
    tieusu TEXT, 
    anh_url VARCHAR(255),
    tinhtrang ENUM('Còn sống', 'Đã mất') DEFAULT 'Còn sống',
    thoidiemtao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    thoidiemcapnhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT tv_fk1 FOREIGN KEY (dongho_id) REFERENCES dongho(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- Bảng quanhe_vochong: lưu quan hệ vợ/chồng (có thể nhiều lần) 
-- SET NULL là phải update tay
-- CASCADE là phải create
CREATE TABLE quanhe_vochong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thanhvien1_id INT,
    thanhvien2_id INT,
    ngaybatdau DATE,
    ngayketthuc DATE,
    tinhtrang ENUM('Vợ chồng', 'Chưa có', 'Ly hôn', 'Khác') DEFAULT 'Khác',
    ghichu TEXT,
    thoidiemtao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT qhvc_fk1 FOREIGN KEY (thanhvien1_id) REFERENCES thanhvien(id) ON DELETE SET NULL,
    CONSTRAINT qhvc_fk2 FOREIGN KEY (thanhvien2_id) REFERENCES thanhvien(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

 -- Cột ngăn việc cùng một cặp vợ chồng bị ghi trùng, ví dụ (1,2) và (2,1)
-- CREATE UNIQUE INDEX uniq_vochong 
-- ON quanhe_vochong (
--     LEAST(thanhvien1_id, thanhvien2_id),
--     GREATEST(thanhvien1_id, thanhvien2_id)
-- );

-- Bảng quanhe_chamecon: liên kết cha/mẹ -> con, con mất --> quan hệ mất
CREATE TABLE quanhe_chamecon ( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
    cha_id INT,
    me_id INT,
    con_id INT NOT NULL,
    loaiquanhe ENUM('Ruột thịt', 'Nhận nuôi', 'Riêng', 'Giám hộ', 'Khác') DEFAULT 'Ruột thịt',
    ghichu TEXT,
    thoidiemtao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT qhcmc_fk1 FOREIGN KEY (cha_id) REFERENCES thanhvien(id) ON DELETE SET NULL,
	CONSTRAINT qhcmc_fk2 FOREIGN KEY (me_id) REFERENCES thanhvien(id) ON DELETE SET NULL,
    CONSTRAINT qhcmc_fk3 FOREIGN KEY (con_id) REFERENCES thanhvien(id) ON DELETE CASCADE,
    CONSTRAINT qhcmc_un UNIQUE KEY uniq_cha_me_con (cha_id, me_id, con_id) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- Bảng taikhoan: quản lý người dùng hệ thống
-- hệ thống nội bộ: chỉ thành viên trong dòng họ có tài khoản
-- thành viên mất --> Tài khoản mất
CREATE TABLE taikhoan (
	id INT AUTO_INCREMENT PRIMARY KEY,
    tendangnhap VARCHAR(200) NOT NULL UNIQUE,
    matkhau VARCHAR(255) NOT NULL, 
    email VARCHAR(150), 
    phanquyen ENUM('Admin', 'User') DEFAULT 'User', 
    thanhvien_id INT NOT NULL,
    thoidiemtao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    landangnhapcuoi TIMESTAMP, 
    danghoatdong BOOLEAN DEFAULT FALSE,
    CONSTRAINT tk_fk1 FOREIGN KEY (thanhvien_id) REFERENCES thanhvien(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- Bảng sukien: lưu giỗ/cúng/hoạt động, taikhoan_id là người dùng tạo ra cái này
CREATE TABLE sukien (
	id INT AUTO_INCREMENT PRIMARY KEY,
    tieude VARCHAR(200) NOT NULL,
    mota TEXT,
    ngay DATE NOT NULL,
    lap ENUM('Không', 'Theo năm', 'Theo tháng') DEFAULT 'Không',
    thoigianlap INT, -- ví dụ lap 'Theo năm', thoigianlap=5 thì 5 năm 1 lần
	taikhoan_id INT, 
    thoidiemtao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sk_fk1 FOREIGN KEY (taikhoan_id) REFERENCES taikhoan(id) ON DELETE SET NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- Bảng thanhtich: lưu thành tích / tin vui các thành viên trong dòng họ
-- Thành viên mất chỉ xét trường hợp khi người ngoài ly hôn bị gạch tên khỏi gia phả 
CREATE TABLE thanhtich ( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
    thanhvien_id INT NOT NULL,
    tieude VARCHAR(255) NOT NULL, 
    mota TEXT, 
    ngay DATE NOT NULL,
    taikhoan_id INT,
    thoidiemtao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tt_fk1 FOREIGN KEY (thanhvien_id) REFERENCES thanhvien(id) ON DELETE CASCADE,
    CONSTRAINT tt_fk2 FOREIGN KEY (taikhoan_id) REFERENCES taikhoan(id) ON DELETE SET NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- Bảng anh (gallery), ảnh của thành viên
 CREATE TABLE anh ( 
	id INT AUTO_INCREMENT PRIMARY KEY,
    thanhvien_id INT NOT NULL, 
    url VARCHAR(255) NOT NULL, 
    caption VARCHAR(255), 
    taikhoan_id INT, 
	thoidiemtao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT a_fk1 FOREIGN KEY (thanhvien_id) REFERENCES thanhvien(id) ON DELETE CASCADE, 
    CONSTRAINT a_fk2 FOREIGN KEY (taikhoan_id) REFERENCES taikhoan(id) ON DELETE SET NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- Bảng tinnhan (gửi tin nhắn / lưu log) 
CREATE TABLE tinnhan (
	id INT AUTO_INCREMENT PRIMARY KEY, 
    taikhoangui_id INT NOT NULL,
    taikhoannhan_id INT NOT NULL,
    trongtam VARCHAR(255), 
    noidung TEXT, 
    kenh ENUM('Messenger', 'Zalo', 'Nội bộ') DEFAULT 'Nội bộ', 
    thoidiemgui TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trangthai ENUM('Đang gửi', 'Đã gửi', 'Thất bại') DEFAULT 'Đang gửi', 
    CONSTRAINT tn_fk1 FOREIGN KEY (taikhoangui_id) REFERENCES taikhoan(id) ON DELETE CASCADE,
    CONSTRAINT tn_fk2 FOREIGN KEY (taikhoannhan_id) REFERENCES taikhoan(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- Bảng nhatky: xem lịch sử thay đổi dữ liệu 
CREATE TABLE nhatky ( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
    taikhoan_id INT, 
    hanhdong VARCHAR(100), 
    bangthaydoi VARCHAR(100), 
    doituong_id INT, 
    giatricu TEXT, 
    giatrimoi TEXT, 
    thoidiemhanhdong TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT al_fk1 FOREIGN KEY (taikhoan_id) REFERENCES taikhoan(id) ON DELETE SET NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- DỮ LIỆU MẪU

-- dòng họ
INSERT INTO dongho (ten, quequan, tenchinhanh, ghichu)
VALUES (
    'Lê',
    'Phường Phú Xuân, Thừa Thiên Huế',
    'Chi họ Lê ở Huế',
    'Dòng họ Lê ở Huế có nguồn gốc ở Phường Phú Xuân, Thành phố Huế. Họ duy trì truyền thống hiếu học, siêng năng. Họ đã tham gia những cuộc kháng chiến chống thực dân Pháp, chống Đế quốc Mỹ, cứu nước, bảo vệ Tổ quốc.'
);

-- thành viên
INSERT INTO thanhvien (hoten, gioitinh, ngaysinh, noisinh, diachi, sdt, tieusu, anh_url, tinhtrang) 
VALUES 	('Lê Phước L', 'Nam', '1945-01-01', 'Bệnh viện Trung ương Huế', '35 Trường Chinh, Huế', '0237251865', 'Ông tổ của nhà họ Lê, là một người hòa đồng, vui vẻ, đáng được kính trọng.', '/images/member1.png', 'Còn sống'),
		('Võ Thị Diễm M', 'Nữ', '1945-05-10', 'Bệnh viện Trung ương Huế', '35 Trường Chinh, Huế', '0194023425', 'Vợ của ông tổ nhà họ Lê, là một người phụ nữ hiền hậu, nết na, yêu thương chồng con.', '/images/member2.png', 'Còn sống'),
        ('Hoàng Trọng H', 'Nam', '1966-07-07', 'Bệnh viện Trung ương Huế', '55 Nguyễn Sinh Cung, Huế', '0989341527', 'Con rể trưởng của ông tổ Lê Phước L và bà Võ Thị Diễm M, là người hiền lành, có uy tín trong dòng họ.', '/images/member3.png', 'Còn sống'),
        ('Lê Khánh N', 'Nữ', '1967-08-15', 'Bệnh viện Trung ương Huế', '55 Nguyễn Sinh Cung, Huế', '0852945281', 'Trưởng nữ của ông tổ Lê Phước L và bà Võ Thị Diễm M, là một cô gái thùy mị, nết na, hiếu thảo.', '/images/member4.png', 'Còn sống'),
        ('Lê Thị Thanh K', 'Nữ', '1970-04-20', 'Bệnh viện Trung ương Huế', '100 Kim Long, Huế', '0412742874', 'Thứ nữ của ông tổ Lê Phước L và bà Võ Thị Diễm M, là một cô gái tài hoa, dễ thương.', '/images/member5.png', 'Còn sống'),
		('Hoàng Kim K', 'Nam', '1969-03-25', 'Bệnh viện Trung ương Huế', '100 Kim Long, Huế', '0369721489', 'Con rể thứ của ông tổ Lê Phước L và bà Võ Thị Diễm M, là người tháo vát, giỏi giang, yêu thương gia đình.', '/images/member6.png', 'Còn sống'),
        ('Hoàng Minh Q', 'Nam', '1989-10-10', 'Bệnh viện Trung ương Huế', '64 Bà Tiệu, Huế', '0332494352', 'Trưởng nam của ông Hoàng Trọng H và bà Lê Khánh N, là người cởi mở, vui tính.', '/images/member7.png', 'Còn sống'),
        ('Hoàng Thế Q', 'Nam', '1994-05-21', 'Bệnh viện Trung ương Huế', '20 Bà Triệu, Huế', '0128233499', 'Thứ nam của ông Hoàng Trọng H và bà Lê Khánh N, là người hiếu thảo, giỏi giang.', '/images/member8.png', 'Còn sống'),
        ('Hoàng H', 'Nam', '1998-02-12', 'Bệnh viện Trung ương Huế', '40 Hoàng Quốc Việt, Huế', '0126845239', 'Trưởng nam của ông Hoàng Kim K và bà Lê Thị Thanh K, là người hòa đồng, được người trong dòng họ quan tâm.', '/images/member9.png', 'Còn sống')
; 

-- quan hệ vợ chồng
INSERT INTO quanhe_vochong (thanhvien1_id, thanhvien2_id, ngaybatdau, ngayketthuc, tinhtrang, ghichu)
VALUES	(1, 2, '1955-05-15', NULL, 'Vợ chồng', 'Vợ chồng ông tổ'),
		(3, 4, '1988-03-01', NULL, 'Vợ chồng', NULL),
        (5, 6, '1993-04-12', NULL, 'Vợ chòng', NULL),
        (7, NULL, '2009-10-10', NULL, 'Chưa có', 'Chưa có vợ'),
        (8, NULL, '2014-02-23', NULL, 'Ly hôn', 'Đã ly hôn, đang đơn thân'),
        (9, NULL, '2018-02-12', NULL, 'Chưa có', 'Chưa có vợ')
;

 -- quan hệ cha mẹ và con
 INSERT INTO quanhe_chamecon (cha_id, me_id, con_id, loaiquanhe, ghichu) 
 VALUES (1, 2, 4, 'Ruột thịt', 'Trưởng nữ'),
		(1, 2, 5, 'Ruột thịt', 'Thứ nữ'),
        (3, 4, 7, 'Ruột thịt', 'Trưởng nam'),
        (3, 4, 8, 'Ruột thịt', 'Thứ nam'),
        (5, 6, 9, 'Ruột thịt', 'Trưởng nam')
;

-- tài khoản
INSERT INTO taikhoan (tendangnhap, matkhau, email, phanquyen, thanhvien_id, landangnhapcuoi) 
VALUES 	('lephuocl', 'admin', 'lephuocl@gmail.com', 'Admin', 1, '2000-05-02'),
		('vothidiemm', 'admin', 'vothidiemm@gmail.com', 'Admin', 2, '2000-04-22'),
		('hoangtrongh', 'user', 'hoangtrongh@gmail.com', 'User', 3, '2025-10-10'),
        ('lekhanhn', 'user', 'lekhanhn@gmail.com', 'User', 4, '2025-09-05'),
        ('lethithanhk', 'user', 'lethithanhk@gmail.com', 'User', 5, '2025-09-06'),
        ('hoangkimk', 'user', 'hoangkimk@gmail.com', 'User', 6, '2025-09-07'),
        ('hoangminhq', 'user', 'hoangminhq@gmail.com', 'User', 7, '2025-09-20'),
        ('hoangtheq', 'user', 'hoangtheq@gmail.com', 'User', 8, '2025-08-12'),
        ('hoangh', 'user', 'hoangh@gmail.com', 'User', 9, '2025-07-14')
;

-- sự kiện
INSERT INTO sukien(tieude, mota, ngay, lap, thoigianlap, taikhoan_id)
VALUES	('Mừng thành lập dòng họ', 'Ngày kỷ niệm thành lập ra dòng họ Lê - Chi họ Lê ở Huế', '2025-01-01', 'Theo năm', 1, 1), -- ổng tổ tạo ra
		('Tôn vinh người đỗ đạt - thành danh', 'Ngày lễ tôn vinh hoặc ghi danh những người đạt thành tích cao trong công việc - học hành', '2025-05-01', 'Theo năm', 1, 1),
        ('Hội đồng họp họ', 'Ngày họp thường niên để bàn việc họ, như quỹ họ, tu sửa nhà thờ, hỗ trợ học bổng...', '2025-09-01', 'Theo năm', 1, 1)
;

-- thành tích
INSERT INTO thanhtich(thanhvien_id, tieude, mota, ngay, taikhoan_id)
VALUES 	(8, 'Bằng khen "Cán bộ Xuất sắc"', 'Khen thưởng vì hoàn thành tốt dự án cầu vượt sông Hàn', '2019-10-05', 4),
		(8, 'Kỷ niệm chương "Lao động giỏi"', 'Thành tích cho việc hoàn thành tốt nhiệm vụ đề ra trong công việc', '2021-12-10', 4),
		(8, 'Chứng nhận "Người con hiếu thảo"', 'Minh chứng cho thái độ, những việc làm, nỗ lực giúp đỡ bố mẹ', '2022-06-28', 3),
        (8, 'Giải thưởng "Ý tưởng thiết kế cầu thông minh"', 'Giải thưởng vì đã thiết kế cầu vượt sông Hàn một cách hiện đại, phù hợp', '2023-09-12', 4),
        (8, 'Huy hiệu "Gương mặt tiêu biểu dòng họ Lê"', 'Thành tựu xuất sắc, đóng góp quan trọng cho dòng họ, xã hội, đất nước', '2024-03-10', 1)
;

-- ảnh
INSERT INTO anh (thanhvien_id, url, caption, taikhoan_id)
VALUES	(1, '/images/member1.png', 'Ảnh ông tổ', 1),
		(2, '/images/member2.png', 'Ảnh vợ ông tổ', 1),
		(3, '/images/member3.png', NULL, 1),
        (4, '/images/member4.png', NULL, 1),
        (5, '/images/member5.png', NULL, 1),
        (6, '/images/member6.png', NULL, 1),
        (7, '/images/member7.png', NULL, 1),
        (8, '/images/member8.png', NULL, 1),
        (9, '/images/member9.png', NULL, 1)
;
-- tin nhắn
INSERT INTO tinnhan(taikhoangui_id, taikhoannhan_id, trongtam, noidung, kenh, trangthai)
VALUES	(1, 2, 'Tạo hệ thống cây gia phả', 'Tôi mới tạo ra hệ thống cây phả bà nó ơi', 'Nội bộ', 'Đã gửi'),
		(2, 1, 'Xác nhận', 'Ừ, tôi biết rồi ông nó', 'Nội bộ', 'Đã gửi'),
        (3, 4, 'Dặn nấu cơm', 'Em nhớ mua đồ về nấu cơm cho con ăn nhé', 'Nội bộ', 'Đã gửi'),
        (4, 3, 'Xác nhận', 'Được, em biết rồi anh ơi', 'Nội bộ', 'Đã gửi'),
        (5, 6, 'Hỏi đi chơi', 'Anh ơi, mai nhà mình đi chơi công viên nhé', 'Nội bộ', 'Đã gửi'),
        (6, 5, 'Xác nhận', 'Được em ơi', 'Nội bộ', 'Đã gửi'),
        (7, 8, 'Chọc', 'Cho em theo với cho em theo với tâm phục khẩu phục', 'Nội bộ', 'Đã gửi'),
        (8, 7, 'Hỏi', 'Phản cảm quá', 'Nội bộ', 'Đã gửi'),
        (8, 9, 'Thông báo', 'Anh cả lại nổi hứng rồi, chú qua nhà giúp anh cái', 'Nội bộ', 'Đã gửi')
;

-- KIỂM TRA DỮ LIỆU MẪU 
/*
SELECT * FROM dongho;
SELECT * FROM thanhvien;
SELECT * FROM quanhe_vochong;
SELECT * FROM quanhe_chamecon;
SELECT * FROM taikhoan;
SELECT * FROM sukien;
SELECT * FROM thanhtich;
SELECT * FROM anh;
SELECT * FROM tinnhan;
SELECT * FROM nhatky; -- Không cần
*/

-- XÓA BẢNG NẾU CẦN RESET LẠI
/*
DROP TABLE dongho;
DROP TABLE thanhvien;
DROP TABLE quanhe_vochong;
DROP TABLE quanhe_chamecon;
DROP TABLE taikhoan;
DROP TABLE sukien;
DROP TABLE thanhtich;
DROP TABLE anh;
DROP TABLE tinnhan;
DROP TABLE nhatky;
*/