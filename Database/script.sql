-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: caygiapha
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anh`
--

DROP TABLE IF EXISTS `anh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anh` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thanhvien_id` int NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taikhoan_id` int DEFAULT NULL,
  `thoidiemtao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `a_fk1` (`thanhvien_id`),
  KEY `a_fk2` (`taikhoan_id`),
  CONSTRAINT `a_fk1` FOREIGN KEY (`thanhvien_id`) REFERENCES `thanhvien` (`id`) ON DELETE CASCADE,
  CONSTRAINT `a_fk2` FOREIGN KEY (`taikhoan_id`) REFERENCES `taikhoan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anh`
--

LOCK TABLES `anh` WRITE;
/*!40000 ALTER TABLE `anh` DISABLE KEYS */;
INSERT INTO `anh` VALUES (1,1,'/images/member1.png','Ảnh ông tổ',1,'2025-10-14 04:29:32'),(2,2,'/images/member2.png','Ảnh vợ ông tổ',1,'2025-10-14 04:29:32'),(3,3,'/images/member3.png',NULL,1,'2025-10-14 04:29:32'),(4,4,'/images/member4.png',NULL,1,'2025-10-14 04:29:32'),(5,5,'/images/member5.png',NULL,1,'2025-10-14 04:29:32'),(6,6,'/images/member6.png',NULL,1,'2025-10-14 04:29:32'),(7,7,'/images/member7.png',NULL,1,'2025-10-14 04:29:32'),(8,8,'/images/member8.png',NULL,1,'2025-10-14 04:29:32'),(9,9,'/images/member9.png',NULL,1,'2025-10-14 04:29:32');
/*!40000 ALTER TABLE `anh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dongho`
--

DROP TABLE IF EXISTS `dongho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dongho` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quequan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tenchinhanh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ghichu` text COLLATE utf8mb4_unicode_ci,
  `thoidiemtao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dongho`
--

LOCK TABLES `dongho` WRITE;
/*!40000 ALTER TABLE `dongho` DISABLE KEYS */;
INSERT INTO `dongho` VALUES (1,'Lê','Phường Phú Xuân, Thừa Thiên Huế','Chi họ Lê ở Huế','Dòng họ Lê ở Huế có nguồn gốc ở Phường Phú Xuân, Thành phố Huế. Họ duy trì truyền thống hiếu học, siêng năng. Họ đã tham gia những cuộc kháng chiến chống thực dân Pháp, chống Đế quốc Mỹ, cứu nước, bảo vệ Tổ quốc.','2025-10-14 04:29:32');
/*!40000 ALTER TABLE `dongho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhatky`
--

DROP TABLE IF EXISTS `nhatky`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhatky` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taikhoan_id` int DEFAULT NULL,
  `hanhdong` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bangthaydoi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doituong_id` int DEFAULT NULL,
  `giatricu` text COLLATE utf8mb4_unicode_ci,
  `giatrimoi` text COLLATE utf8mb4_unicode_ci,
  `thoidiemhanhdong` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `al_fk1` (`taikhoan_id`),
  CONSTRAINT `al_fk1` FOREIGN KEY (`taikhoan_id`) REFERENCES `taikhoan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhatky`
--

LOCK TABLES `nhatky` WRITE;
/*!40000 ALTER TABLE `nhatky` DISABLE KEYS */;
/*!40000 ALTER TABLE `nhatky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quanhe_chamecon`
--

DROP TABLE IF EXISTS `quanhe_chamecon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quanhe_chamecon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cha_id` int DEFAULT NULL,
  `me_id` int DEFAULT NULL,
  `con_id` int NOT NULL,
  `loaiquanhe` enum('Ruột thịt','Nhận nuôi','Riêng','Giám hộ','Khác') COLLATE utf8mb4_unicode_ci DEFAULT 'Ruột thịt',
  `ghichu` text COLLATE utf8mb4_unicode_ci,
  `thoidiemtao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_cha_me_con` (`cha_id`,`me_id`,`con_id`),
  KEY `qhcmc_fk2` (`me_id`),
  KEY `qhcmc_fk3` (`con_id`),
  CONSTRAINT `qhcmc_fk1` FOREIGN KEY (`cha_id`) REFERENCES `thanhvien` (`id`) ON DELETE SET NULL,
  CONSTRAINT `qhcmc_fk2` FOREIGN KEY (`me_id`) REFERENCES `thanhvien` (`id`) ON DELETE SET NULL,
  CONSTRAINT `qhcmc_fk3` FOREIGN KEY (`con_id`) REFERENCES `thanhvien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quanhe_chamecon`
--

LOCK TABLES `quanhe_chamecon` WRITE;
/*!40000 ALTER TABLE `quanhe_chamecon` DISABLE KEYS */;
INSERT INTO `quanhe_chamecon` VALUES (1,1,2,4,'Ruột thịt','Trưởng nữ','2025-10-14 04:29:32'),(2,1,2,5,'Ruột thịt','Thứ nữ','2025-10-14 04:29:32'),(3,3,4,7,'Ruột thịt','Trưởng nam','2025-10-14 04:29:32'),(4,3,4,8,'Ruột thịt','Thứ nam','2025-10-14 04:29:32'),(5,5,6,9,'Ruột thịt','Trưởng nam','2025-10-14 04:29:32');
/*!40000 ALTER TABLE `quanhe_chamecon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quanhe_vochong`
--

DROP TABLE IF EXISTS `quanhe_vochong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quanhe_vochong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thanhvien1_id` int DEFAULT NULL,
  `thanhvien2_id` int DEFAULT NULL,
  `ngaybatdau` date DEFAULT NULL,
  `ngayketthuc` date DEFAULT NULL,
  `tinhtrang` enum('Vợ chồng','Chưa có','Ly hôn','Khác') COLLATE utf8mb4_unicode_ci DEFAULT 'Khác',
  `ghichu` text COLLATE utf8mb4_unicode_ci,
  `thoidiemtao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `qhvc_fk1` (`thanhvien1_id`),
  KEY `qhvc_fk2` (`thanhvien2_id`),
  CONSTRAINT `qhvc_fk1` FOREIGN KEY (`thanhvien1_id`) REFERENCES `thanhvien` (`id`) ON DELETE SET NULL,
  CONSTRAINT `qhvc_fk2` FOREIGN KEY (`thanhvien2_id`) REFERENCES `thanhvien` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quanhe_vochong`
--

LOCK TABLES `quanhe_vochong` WRITE;
/*!40000 ALTER TABLE `quanhe_vochong` DISABLE KEYS */;
INSERT INTO `quanhe_vochong` VALUES (1,1,2,'1955-05-15',NULL,'Vợ chồng','Vợ chồng ông tổ','2025-10-14 04:29:32'),(2,3,4,'1988-03-01',NULL,'Vợ chồng',NULL,'2025-10-14 04:29:32'),(3,5,6,'1993-04-12',NULL,'Vợ chồng',NULL,'2025-10-14 04:29:32'),(4,7,NULL,'2009-10-10',NULL,'Chưa có','Chưa có vợ','2025-10-14 04:29:32'),(5,8,NULL,'2014-02-23',NULL,'Ly hôn','Đã ly hôn, đang đơn thân','2025-10-14 04:29:32'),(6,9,NULL,'2018-02-12',NULL,'Chưa có','Chưa có vợ','2025-10-14 04:29:32');
/*!40000 ALTER TABLE `quanhe_vochong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sukien`
--

DROP TABLE IF EXISTS `sukien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sukien` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tieude` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mota` text COLLATE utf8mb4_unicode_ci,
  `ngay` date NOT NULL,
  `lap` enum('Không','Theo năm','Theo tháng') COLLATE utf8mb4_unicode_ci DEFAULT 'Không',
  `thoigianlap` int DEFAULT NULL,
  `taikhoan_id` int DEFAULT NULL,
  `thoidiemtao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sk_fk1` (`taikhoan_id`),
  CONSTRAINT `sk_fk1` FOREIGN KEY (`taikhoan_id`) REFERENCES `taikhoan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sukien`
--

LOCK TABLES `sukien` WRITE;
/*!40000 ALTER TABLE `sukien` DISABLE KEYS */;
INSERT INTO `sukien` VALUES (1,'Mừng thành lập dòng họ','Ngày kỷ niệm thành lập ra dòng họ Lê - Chi họ Lê ở Huế','2025-01-01','Theo năm',1,1,'2025-10-14 04:29:32'),(2,'Tôn vinh người đỗ đạt - thành danh','Ngày lễ tôn vinh hoặc ghi danh những người đạt thành tích cao trong công việc - học hành','2025-05-01','Theo năm',1,1,'2025-10-14 04:29:32'),(3,'Hội đồng họp họ','Ngày họp thường niên để bàn việc họ, như quỹ họ, tu sửa nhà thờ, hỗ trợ học bổng...','2025-09-01','Theo năm',1,1,'2025-10-14 04:29:32');
/*!40000 ALTER TABLE `sukien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taikhoan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tendangnhap` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matkhau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phanquyen` enum('Admin','User') COLLATE utf8mb4_unicode_ci DEFAULT 'User',
  `thanhvien_id` int NOT NULL,
  `thoidiemtao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `landangnhapcuoi` timestamp NULL DEFAULT NULL,
  `danghoatdong` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `tendangnhap` (`tendangnhap`),
  KEY `tk_fk1` (`thanhvien_id`),
  CONSTRAINT `tk_fk1` FOREIGN KEY (`thanhvien_id`) REFERENCES `thanhvien` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (1,'lephuocl','admin','lephuocl@gmail.com','Admin',1,'2025-10-14 04:29:32','2000-05-01 17:00:00',0),(2,'vothidiemm','admin','vothidiemm@gmail.com','Admin',2,'2025-10-14 04:29:32','2000-04-21 17:00:00',0),(3,'hoangtrongh','user','hoangtrongh@gmail.com','User',3,'2025-10-14 04:29:32','2025-10-09 17:00:00',0),(4,'lekhanhn','user','lekhanhn@gmail.com','User',4,'2025-10-14 04:29:32','2025-09-04 17:00:00',0),(5,'lethithanhk','user','lethithanhk@gmail.com','User',5,'2025-10-14 04:29:32','2025-09-05 17:00:00',0),(6,'hoangkimk','user','hoangkimk@gmail.com','User',6,'2025-10-14 04:29:32','2025-09-06 17:00:00',0),(7,'hoangminhq','user','hoangminhq@gmail.com','User',7,'2025-10-14 04:29:32','2025-09-19 17:00:00',0),(8,'hoangtheq','user','hoangtheq@gmail.com','User',8,'2025-10-14 04:29:32','2025-08-11 17:00:00',0),(9,'hoangh','user','hoangh@gmail.com','User',9,'2025-10-14 04:29:32','2025-07-13 17:00:00',0);
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanhtich`
--

DROP TABLE IF EXISTS `thanhtich`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanhtich` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thanhvien_id` int NOT NULL,
  `tieude` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mota` text COLLATE utf8mb4_unicode_ci,
  `ngay` date NOT NULL,
  `taikhoan_id` int DEFAULT NULL,
  `thoidiemtao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tt_fk1` (`thanhvien_id`),
  KEY `tt_fk2` (`taikhoan_id`),
  CONSTRAINT `tt_fk1` FOREIGN KEY (`thanhvien_id`) REFERENCES `thanhvien` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tt_fk2` FOREIGN KEY (`taikhoan_id`) REFERENCES `taikhoan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanhtich`
--

LOCK TABLES `thanhtich` WRITE;
/*!40000 ALTER TABLE `thanhtich` DISABLE KEYS */;
INSERT INTO `thanhtich` VALUES (1,8,'Bằng khen \"Cán bộ Xuất sắc\"','Khen thưởng vì hoàn thành tốt dự án cầu vượt sông Hàn','2019-10-05',4,'2025-10-14 04:29:32'),(2,8,'Kỷ niệm chương \"Lao động giỏi\"','Thành tích cho việc hoàn thành tốt nhiệm vụ đề ra trong công việc','2021-12-10',4,'2025-10-14 04:29:32'),(3,8,'Chứng nhận \"Người con hiếu thảo\"','Minh chứng cho thái độ, những việc làm, nỗ lực giúp đỡ bố mẹ','2022-06-28',3,'2025-10-14 04:29:32'),(4,8,'Giải thưởng \"Ý tưởng thiết kế cầu thông minh\"','Giải thưởng vì đã thiết kế cầu vượt sông Hàn một cách hiện đại, phù hợp','2023-09-12',4,'2025-10-14 04:29:32'),(5,8,'Huy hiệu \"Gương mặt tiêu biểu dòng họ Lê\"','Thành tựu xuất sắc, đóng góp quan trọng cho dòng họ, xã hội, đất nước','2024-03-10',1,'2025-10-14 04:29:32');
/*!40000 ALTER TABLE `thanhtich` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanhvien`
--

DROP TABLE IF EXISTS `thanhvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thanhvien` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dongho_id` int DEFAULT '1',
  `hoten` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gioitinh` enum('Nam','Nữ','Khác') COLLATE utf8mb4_unicode_ci DEFAULT 'Khác',
  `ngaysinh` date DEFAULT NULL,
  `noisinh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diachi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sdt` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tieusu` text COLLATE utf8mb4_unicode_ci,
  `anh_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tinhtrang` enum('Còn sống','Đã mất') COLLATE utf8mb4_unicode_ci DEFAULT 'Còn sống',
  `thoidiemtao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `thoidiemcapnhat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tv_fk1` (`dongho_id`),
  CONSTRAINT `tv_fk1` FOREIGN KEY (`dongho_id`) REFERENCES `dongho` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanhvien`
--

LOCK TABLES `thanhvien` WRITE;
/*!40000 ALTER TABLE `thanhvien` DISABLE KEYS */;
INSERT INTO `thanhvien` VALUES (1,1,'Lê Phước L','Nam','1945-01-01','Bệnh viện Trung ương Huế','35 Trường Chinh, Huế','0237251865','Ông tổ của nhà họ Lê, là một người hòa đồng, vui vẻ, đáng được kính trọng.','/images/member1.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32'),(2,1,'Võ Thị Diễm M','Nữ','1945-05-10','Bệnh viện Trung ương Huế','35 Trường Chinh, Huế','0194023425','Vợ của ông tổ nhà họ Lê, là một người phụ nữ hiền hậu, nết na, yêu thương chồng con.','/images/member2.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32'),(3,1,'Hoàng Trọng H','Nam','1966-07-07','Bệnh viện Trung ương Huế','55 Nguyễn Sinh Cung, Huế','0989341527','Con rể trưởng của ông tổ Lê Phước L và bà Võ Thị Diễm M, là người hiền lành, có uy tín trong dòng họ.','/images/member3.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32'),(4,1,'Lê Khánh N','Nữ','1967-08-15','Bệnh viện Trung ương Huế','55 Nguyễn Sinh Cung, Huế','0852945281','Trưởng nữ của ông tổ Lê Phước L và bà Võ Thị Diễm M, là một cô gái thùy mị, nết na, hiếu thảo.','/images/member4.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32'),(5,1,'Lê Thị Thanh K','Nữ','1970-04-20','Bệnh viện Trung ương Huế','100 Kim Long, Huế','0412742874','Thứ nữ của ông tổ Lê Phước L và bà Võ Thị Diễm M, là một cô gái tài hoa, dễ thương.','/images/member5.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32'),(6,1,'Hoàng Kim K','Nam','1969-03-25','Bệnh viện Trung ương Huế','100 Kim Long, Huế','0369721489','Con rể thứ của ông tổ Lê Phước L và bà Võ Thị Diễm M, là người tháo vát, giỏi giang, yêu thương gia đình.','/images/member6.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32'),(7,1,'Hoàng Minh Q','Nam','1989-10-10','Bệnh viện Trung ương Huế','64 Bà Tiệu, Huế','0332494352','Trưởng nam của ông Hoàng Trọng H và bà Lê Khánh N, là người cởi mở, vui tính.','/images/member7.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32'),(8,1,'Hoàng Thế Q','Nam','1994-05-21','Bệnh viện Trung ương Huế','20 Bà Triệu, Huế','0128233499','Thứ nam của ông Hoàng Trọng H và bà Lê Khánh N, là người hiếu thảo, giỏi giang.','/images/member8.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32'),(9,1,'Hoàng H','Nam','1998-02-12','Bệnh viện Trung ương Huế','40 Hoàng Quốc Việt, Huế','0126845239','Trưởng nam của ông Hoàng Kim K và bà Lê Thị Thanh K, là người hòa đồng, được người trong dòng họ quan tâm.','/images/member9.png','Còn sống','2025-10-14 04:29:32','2025-10-14 04:29:32');
/*!40000 ALTER TABLE `thanhvien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tinnhan`
--

DROP TABLE IF EXISTS `tinnhan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tinnhan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taikhoangui_id` int NOT NULL,
  `taikhoannhan_id` int NOT NULL,
  `trongtam` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noidung` text COLLATE utf8mb4_unicode_ci,
  `kenh` enum('Messenger','Zalo','Nội bộ') COLLATE utf8mb4_unicode_ci DEFAULT 'Nội bộ',
  `thoidiemgui` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `trangthai` enum('Đang gửi','Đã gửi','Thất bại') COLLATE utf8mb4_unicode_ci DEFAULT 'Đang gửi',
  PRIMARY KEY (`id`),
  KEY `tn_fk1` (`taikhoangui_id`),
  KEY `tn_fk2` (`taikhoannhan_id`),
  CONSTRAINT `tn_fk1` FOREIGN KEY (`taikhoangui_id`) REFERENCES `taikhoan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tn_fk2` FOREIGN KEY (`taikhoannhan_id`) REFERENCES `taikhoan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tinnhan`
--

LOCK TABLES `tinnhan` WRITE;
/*!40000 ALTER TABLE `tinnhan` DISABLE KEYS */;
INSERT INTO `tinnhan` VALUES (1,1,2,'Tạo hệ thống cây gia phả','Tôi mới tạo ra hệ thống cây phả bà nó ơi','Nội bộ','2025-10-14 04:29:32','Đã gửi'),(2,2,1,'Xác nhận','Ừ, tôi biết rồi ông nó','Nội bộ','2025-10-14 04:29:32','Đã gửi'),(3,3,4,'Dặn nấu cơm','Em nhớ mua đồ về nấu cơm cho con ăn nhé','Nội bộ','2025-10-14 04:29:32','Đã gửi'),(4,4,3,'Xác nhận','Được, em biết rồi anh ơi','Nội bộ','2025-10-14 04:29:32','Đã gửi'),(5,5,6,'Hỏi đi chơi','Anh ơi, mai nhà mình đi chơi công viên nhé','Nội bộ','2025-10-14 04:29:32','Đã gửi'),(6,6,5,'Xác nhận','Được em ơi','Nội bộ','2025-10-14 04:29:32','Đã gửi'),(7,7,8,'Chọc','Cho em theo với cho em theo với tâm phục khẩu phục','Nội bộ','2025-10-14 04:29:32','Đã gửi'),(8,8,7,'Hỏi','Phản cảm quá','Nội bộ','2025-10-14 04:29:32','Đã gửi'),(9,8,9,'Thông báo','Anh cả lại nổi hứng rồi, chú qua nhà giúp anh cái','Nội bộ','2025-10-14 04:29:32','Đã gửi');
/*!40000 ALTER TABLE `tinnhan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'caygiapha'
--

--
-- Dumping routines for database 'caygiapha'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-14 11:29:55
