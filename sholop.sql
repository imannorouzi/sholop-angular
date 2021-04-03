-- MySQL dump 10.13  Distrib 8.0.23, for Linux (x86_64)
--
-- Host: localhost    Database: sholop
-- ------------------------------------------------------
-- Server version	8.0.23-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hibernate_sequence`
--

DROP TABLE IF EXISTS `hibernate_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hibernate_sequence` (
  `next_val` bigint DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hibernate_sequence`
--

LOCK TABLES `hibernate_sequence` WRITE;
/*!40000 ALTER TABLE `hibernate_sequence` DISABLE KEYS */;
INSERT INTO `hibernate_sequence` VALUES (375),(375),(375),(375),(375),(375),(375);
/*!40000 ALTER TABLE `hibernate_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_comment`
--

DROP TABLE IF EXISTS `sh_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `contact_id` int DEFAULT NULL,
  `event_id` int NOT NULL,
  `text` varchar(200) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `in_reply_to` int DEFAULT NULL,
  `status` varchar(10) COLLATE utf8_persian_ci DEFAULT NULL,
  `reported` int DEFAULT '0',
  `modified` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=375 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_comment`
--

LOCK TABLES `sh_comment` WRITE;
/*!40000 ALTER TABLE `sh_comment` DISABLE KEYS */;
INSERT INTO `sh_comment` VALUES (230,22,-1,214,'fsfdsdfsdfsdfsdf',NULL,0,'publish',0,NULL),(231,22,-1,208,'zxcxzczxczxc',NULL,0,'publish',0,NULL),(232,22,-1,208,'uiolikk',NULL,0,'publish',0,NULL),(233,22,-1,208,'kkkkkkkkkkkkk',NULL,0,'publish',0,NULL),(234,-1,-1,208,'jkkkkkkkkkkkkkkkkkkkkkkkkkk',NULL,0,'publish',0,NULL),(235,-1,-1,208,'wqefewqfweqfweqfweqwqe',NULL,0,'publish',0,NULL),(236,-1,-1,208,'adfsdfsadfsdaf',NULL,0,'publish',0,NULL),(237,-1,-1,208,'dsfasdfasdfsdafsdf',NULL,0,'publish',0,NULL),(329,-1,-1,323,'بیا اینم کامنت\n',NULL,0,'publish',0,NULL),(332,22,-1,323,'دوباره الان اسم نمیاره',NULL,0,'publish',0,NULL),(333,22,-1,323,'اینم یه کامنت دیگه',NULL,0,'publish',0,NULL),(334,22,-1,323,'الان دیگه باید همه رو بیاری الدنگ',NULL,0,'publish',0,NULL),(343,22,-1,339,'کامنت زیبایی گذاشتم\n',NULL,0,'publish',0,NULL),(374,22,-1,369,'کار بسیار شایسته‌ای کردی برادر',NULL,0,'publish',0,NULL);
/*!40000 ALTER TABLE `sh_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_contact`
--

DROP TABLE IF EXISTS `sh_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_contact` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(10) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT 'CONTACT',
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `phone` varchar(15) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8 COLLATE utf8_persian_ci,
  `image_url` text CHARACTER SET utf8 COLLATE utf8_persian_ci,
  `valid` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `modified_by` int DEFAULT NULL,
  `user_id` int NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=360 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_contact`
--

LOCK TABLES `sh_contact` WRITE;
/*!40000 ALTER TABLE `sh_contact` DISABLE KEYS */;
INSERT INTO `sh_contact` VALUES (359,'UNKNOWN','لنین','lenin@gmail.com','232323232','','/sholop-api/download/contacts/contact_22_october_revolution.jpg',1,0,NULL,NULL,NULL,NULL,22);
/*!40000 ALTER TABLE `sh_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_contact_event`
--

DROP TABLE IF EXISTS `sh_contact_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_contact_event` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contact_id` int NOT NULL,
  `event_id` int NOT NULL,
  `status` varchar(20) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL DEFAULT 'UNKNOWN',
  `type` varchar(15) COLLATE utf8_persian_ci DEFAULT NULL,
  `qr_code_url` varchar(200) COLLATE utf8_persian_ci DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT '0',
  `modified` timestamp NULL DEFAULT NULL,
  `modified_by` int DEFAULT '0',
  `name` varchar(50) COLLATE utf8_persian_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8_persian_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8_persian_ci DEFAULT NULL,
  `uuid` varchar(50) COLLATE utf8_persian_ci DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=374 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_contact_event`
--

LOCK TABLES `sh_contact_event` WRITE;
/*!40000 ALTER TABLE `sh_contact_event` DISABLE KEYS */;
INSERT INTO `sh_contact_event` VALUES (210,206,208,'UNKNOWN','CONTACT','qr_code_MonJul1317:15:37AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','133ee415-aeb7-4706-ad73-c6766dbc3743'),(211,-1,208,'UNKNOWN','CONTACT','qr_code_MonJul1317:15:40AEST2020.png',NULL,NULL,NULL,NULL,'Atieh Ghazizadeh','0435072839','atieh.ghazizadeh@gmail.com','2b42a285-ce78-4482-a75a-c1880e51df30'),(216,212,214,'UNKNOWN','USER','qr_code_MonJul1317:18:52AEST2020.png',NULL,NULL,NULL,NULL,'عطیه قوزی','0435072839','atieh.ghazizadeh@gmail.comc','0cb5388a-cc99-4564-9fbc-090e8d75da14'),(217,206,214,'UNKNOWN','CONTACT','qr_code_MonJul1317:18:52AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','77a9e790-705c-402c-b7bf-4caac8e0d119'),(218,-1,214,'UNKNOWN','CONTACT','qr_code_MonJul1317:18:53AEST2020.png',NULL,NULL,NULL,NULL,'Mohammed Darvish','07597517317','darvish.m@gmail.com','d2950006-0af7-412c-88e9-66cf9d9354cb'),(244,219,242,'UNKNOWN','USER','/sholop-api/download/users/qr_code_WedJul1512:47:58AEST2020.png',NULL,NULL,NULL,NULL,'Atieh Ghazizadeh','0435072839','atieh.ghazizadeh@gmail.com','2c61b6ec-c170-4621-b2c0-d50d1f121750'),(245,239,242,'UNKNOWN','CONTACT','/sholop-api/download/users/qr_code_WedJul1512:47:58AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','476897d9-4af9-4eab-bf11-72a697f2d412'),(249,206,247,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1522:54:32AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','e23f8e19-2676-4035-8127-2c55ee26d351'),(253,206,251,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1522:59:09AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','861aba41-d06a-4a21-9eaf-d09c3eb07702'),(254,212,251,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1522:59:09AEST2020.png',NULL,NULL,NULL,NULL,'عطیه قوزی','0435072839','atieh.ghazizadeh@gmail.comc','7a40b4df-36c3-4032-a26f-9a4361f6209e'),(258,206,256,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1523:06:22AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','716ca2f4-cda8-48b7-a1d8-287680620efb'),(259,212,256,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1523:06:22AEST2020.png',NULL,NULL,NULL,NULL,'عطیه قوزی','0435072839','atieh.ghazizadeh@gmail.comc','57675f1f-c44b-4be4-b3a1-f844fa419a01'),(263,206,261,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1523:10:28AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','823729dc-3fda-46bd-bf86-900c912acc33'),(264,212,261,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1523:10:29AEST2020.png',NULL,NULL,NULL,NULL,'عطیه قوزی','0435072839','atieh.ghazizadeh@gmail.comc','820ae961-b080-492c-a011-1fb4fb96cce8'),(268,239,266,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1523:11:03AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','72e24677-a975-41f4-9ff4-7f8f7eeb47a9'),(269,212,266,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_WedJul1523:11:04AEST2020.png',NULL,NULL,NULL,NULL,'عطیه قوزی','0435072839','atieh.ghazizadeh@gmail.comc','ceb49082-4824-411e-858d-d8456a014b5e'),(272,239,270,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SatJul1815:05:53AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','8149264b-8819-4ad7-af64-f5054e7f9360'),(279,206,277,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_TueJul2119:10:23AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','ebd4b970-09a9-4a9d-8a77-4726e2710749'),(291,206,289,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_TueJul2120:05:15AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','6abfdb0f-44c5-4279-b2c6-122718a0e78f'),(294,276,292,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_TueJul2120:18:57AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi Abadchi','07597517317','darvish.m@gmail.com','450fd760-fd23-4df2-b558-594db1f9da30'),(304,219,302,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_TueJul2120:50:28AEST2020.png',NULL,NULL,NULL,NULL,'Atieh Ghazizadeh','0435072839','atieh.ghazizadeh@gmail.com','6fed9b03-fbb0-49b2-a506-189bbfd61451'),(307,219,305,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_TueJul2121:01:04AEST2020.png',NULL,NULL,NULL,NULL,'Atieh Ghazizadeh','0435072839','atieh.ghazizadeh@gmail.com','2dd9a46e-fdd0-4993-b481-f9a4c691ec8e'),(310,301,308,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SatJul2512:27:30AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','afb9939e-bc1e-40a3-8cf8-c02fc60d420b'),(313,295,311,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SatJul2512:30:29AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi Abadchi','07597517317','darvish.m@gmail.com','9700b520-bcc7-4272-8d5d-e83051274960'),(319,301,317,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SatJul2515:15:01AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','77d4be3f-e0d1-4305-a1ee-d9a363cb9e1d'),(322,295,320,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SatJul2515:19:30AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi Abadchi','07597517317','darvish.m@gmail.com','cff59f57-19d9-4c74-8956-ad0bd9b98133'),(325,301,323,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2612:27:57AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','c67de07a-6f25-4b01-950d-e1007d761641'),(328,301,326,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2612:39:47AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','f95756ce-5ebe-4645-bf28-949fd46bdf98'),(341,301,339,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2613:53:08AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','b4dc774e-db99-4ae8-876e-fb90a2013a23'),(347,301,345,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2613:57:20AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','9fe76d41-2bd1-4b82-bd7d-a492686d8e36'),(348,295,345,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2613:57:20AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi Abadchi','07597517317','darvish.m@gmail.com','a31c05b0-2752-4520-8a9b-4f7b140e6251'),(352,295,350,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2613:58:50AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi Abadchi','07597517317','darvish.m@gmail.com','80472fe7-f4a1-4e35-9f07-0baaabc6c76c'),(356,301,354,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2614:06:14AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi','403509702','iman.norouzy@gmail.com','5f209848-13f6-48a1-8db5-d593bcf6bbdb'),(357,295,354,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2614:06:14AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi Abadchi','07597517317','darvish.m@gmail.com','6b50785d-e4cd-4bdc-a156-a7a3b29f417c'),(363,359,361,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2614:47:26AEST2020.png',NULL,NULL,NULL,NULL,'لنین','232323232','lenin@gmail.com','2fc3db29-279d-4b1f-84f8-a6e78f1caaaa'),(364,358,361,'UNKNOWN','USER','/sholop-api/download/QRCodes/qr_code_SunJul2614:47:26AEST2020.png',NULL,NULL,NULL,NULL,'انگلس','12121211','Engels@gmail.com','d59efed2-2eb5-444a-af5e-b333e8d62fe0'),(367,359,365,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2615:09:57AEST2020.png',NULL,NULL,NULL,NULL,'لنین','232323232','lenin@gmail.com','ac4c01db-ea3d-430a-8205-accb6b348747'),(368,358,365,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2615:09:57AEST2020.png',NULL,NULL,NULL,NULL,'انگلس','12121211','Engels@gmail.com','72e4ffe9-e8a3-43a8-afbe-19487c567c16'),(371,359,369,'UNKNOWN','CONTACT','/sholop-api/download/QRCodes/qr_code_SunJul2615:15:38AEST2020.png',NULL,NULL,NULL,NULL,'لنین','232323232','lenin@gmail.com','cb4096d3-7193-471e-ad29-5a9a10316173'),(372,295,369,'UNKNOWN','USER','/sholop-api/download/QRCodes/qr_code_SunJul2615:15:38AEST2020.png',NULL,NULL,NULL,NULL,'Iman Norouzi Abadchi','07597517317','darvish.m@gmail.com','9990e092-6f40-4af3-83f0-5f6a28d745d7'),(373,358,369,'UNKNOWN','USER','/sholop-api/download/QRCodes/qr_code_SunJul2615:15:38AEST2020.png',NULL,NULL,NULL,NULL,'انگلس','12121211','Engels@gmail.com','631730d8-5b24-4d8a-8bb5-3821df09f10c');
/*!40000 ALTER TABLE `sh_contact_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_event`
--

DROP TABLE IF EXISTS `sh_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_event` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `venue_id` int NOT NULL,
  `chair_id` int DEFAULT NULL,
  `confirm_needed` tinyint(1) NOT NULL,
  `join_via_link` tinyint(1) NOT NULL,
  `limit_guests` tinyint(1) NOT NULL,
  `max_guests` int NOT NULL,
  `allow_comments` int NOT NULL,
  `link` text CHARACTER SET utf8 COLLATE utf8_persian_ci,
  `status` varchar(10) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL DEFAULT 'draft',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL DEFAULT '0',
  `modified` timestamp NULL DEFAULT NULL,
  `modified_by` int NOT NULL DEFAULT '0',
  `tags` text CHARACTER SET utf8 COLLATE utf8_persian_ci,
  `event_type` varchar(20) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `image_url` text CHARACTER SET utf8 COLLATE utf8_persian_ci,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=370 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_event`
--

LOCK TABLES `sh_event` WRITE;
/*!40000 ALTER TABLE `sh_event` DISABLE KEYS */;
INSERT INTO `sh_event` VALUES (323,'','',213,22,0,0,0,0,0,'fzVukMQluusGUQNUfYDfMAxnWFKxVt','PUBLISHED','2020-07-26 02:27:57',22,NULL,0,'','MEETING',NULL),(326,'','',190,22,0,0,0,0,0,'OHXdgbYSDaoLGPIvISSyuWkQqTGscL','PUBLISHED','2020-07-26 02:39:47',22,NULL,0,'','MEETING',NULL),(336,'','',335,22,0,0,0,0,0,'miPCUFbMizKulfZFrVunisHkJnShoL','PUBLISHED','2020-07-26 03:50:04',22,NULL,0,'','MEETING',NULL),(339,'فلان جا','',338,22,0,0,0,0,0,'WgaaZoRYNNclcjqLeVpdeOUuubRQGa','PUBLISHED','2020-07-26 03:53:08',22,NULL,0,'','MEETING',NULL),(345,'','',344,22,0,0,0,0,0,'xtOjDPunGMnxlEZTBzAzGSzDvcqgVh','PUBLISHED','2020-07-26 03:57:20',22,NULL,0,'','MEETING',NULL),(350,'همه رو پر کردم دیگه تقریبا','با پیام خوشامد',349,22,0,0,0,0,0,'LlrLXumcUGoRrFuacldQjmPmorchQS','PUBLISHED','2020-07-26 03:58:50',22,NULL,0,'','MEETING',NULL),(354,'فلان','',353,22,0,0,0,0,0,'ZFjKWSjkDaUcEsOrHlYLLLxdoZvsnV','PUBLISHED','2020-07-26 04:06:14',22,NULL,0,'','MEETING',NULL),(361,'آماده‌سازی برای انقلاب اکتبر','کارگران جهان متحد شوید.',360,22,0,0,0,0,0,'HiMRMTpQkwRtQhLhMbtdtqyIfnEtyL','PUBLISHED','2020-07-26 04:47:26',22,NULL,0,'','MEETING',NULL),(365,'برای اون مسئله ','',198,22,0,0,0,0,0,'BGxyPzOQKmYDfvvXnbSnnADaGxUdjF','PUBLISHED','2020-07-26 05:08:37',22,NULL,0,'','MEETING',NULL),(369,'برای این مسئله','',213,22,0,0,0,0,0,'ibXYgxMtcSrkKVFGXLyXdMiHTliiNh','PUBLISHED','2020-07-26 05:15:36',22,NULL,0,'','MEETING',NULL);
/*!40000 ALTER TABLE `sh_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_event_date`
--

DROP TABLE IF EXISTS `sh_event_date`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_event_date` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` timestamp NULL DEFAULT NULL,
  `date_string` varchar(50) COLLATE utf8_persian_ci DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `event_id` int NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=371 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_event_date`
--

LOCK TABLES `sh_event_date` WRITE;
/*!40000 ALTER TABLE `sh_event_date` DISABLE KEYS */;
INSERT INTO `sh_event_date` VALUES (324,'2020-07-25 04:00:00','یکشنبه، 5 مرداد 1399 از 12:27 تا 12:27','2020-07-25 16:27:40','2020-07-25 16:27:40',323),(327,'2020-07-25 04:00:00','یکشنبه، 5 مرداد 1399 از 12:39 تا 12:39','2020-07-25 16:39:36','2020-07-25 16:39:36',326),(337,'2020-07-25 04:00:00','یکشنبه، 5 مرداد 1399 از 13:48 تا 13:48','2020-07-25 17:48:15','2020-07-25 17:48:15',336),(340,'2020-07-25 04:00:00','یکشنبه، 5 مرداد 1399 از 13:52 تا 13:52','2020-07-25 17:52:45','2020-07-25 17:52:45',339),(346,'2020-07-28 04:00:00','چهارشنبه، 8 مرداد 1399 از 14:56 تا 15:56','2020-07-25 18:56:10','2020-07-25 19:56:11',345),(351,'2020-08-09 04:00:00','دوشنبه، 20 مرداد 1399 از 13:58 تا 19:58','2020-07-25 17:58:06','2020-07-25 23:58:22',350),(355,'2020-08-10 04:00:00','سه شنبه، 21 مرداد 1399 از 14:5 تا 14:5','2020-07-25 18:05:52','2020-07-25 18:05:52',354),(362,'2020-07-27 04:00:00','سه شنبه، 7 مرداد 1399 از 14:45 تا 14:45','2020-07-25 18:45:41','2020-07-25 18:45:41',361),(366,'2020-07-25 04:00:00','یکشنبه، 5 مرداد 1399 از 15:8 تا 15:8','2020-07-25 19:08:01','2020-07-25 19:08:01',365),(370,'2020-08-05 04:00:00','پنج شنبه، 16 مرداد 1399 از 15:14 تا 15:18','2020-07-25 19:14:59','2020-07-25 19:18:05',369);
/*!40000 ALTER TABLE `sh_event_date` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_user`
--

DROP TABLE IF EXISTS `sh_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(10) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT 'PERSONAL',
  `full_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `password` text CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `google_password` varchar(200) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `image_url` varchar(100) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double NOT NULL,
  `persian_address_1` varchar(200) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `persian_address_2` varchar(200) CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `role` text COLLATE utf8_persian_ci,
  `confirm_email_uuid` varchar(50) COLLATE utf8_persian_ci DEFAULT NULL,
  `forget_password_uuid` varchar(50) COLLATE utf8_persian_ci DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `modified_by` int DEFAULT '0',
  `parent_id` int DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT '0',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=359 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_user`
--

LOCK TABLES `sh_user` WRITE;
/*!40000 ALTER TABLE `sh_user` DISABLE KEYS */;
INSERT INTO `sh_user` VALUES (22,'PERSONAL','مارکس','iman.norouzy@gmail.com','$2a$10$slYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6','d+8OnrGpzcjo9inm9dO17RBjzrHiHQs3Pe3BnKfpSyI=$IxtpBJBXLCJL/l+IkcyAqsrifMRUXH5pyq1wMVYDQWY=','iman.norouzy@gmail.com','/sholop-api/download/users/user_22_marx-engels.jpg','',35.7066344,51.3526484,'استان تهران، تهران، منطقه ۲، ‫تهرانسر بلوار یاس، ایران','','','owner',NULL,NULL,NULL,0,NULL,'2019-04-15 09:29:24',0),(212,'PERSONAL','عطیه قوزی','atieh.ghazizadeh@gmail.comc','',NULL,'atieh.ghazizadeh@gmail.comc','/sholop-api/download/users/user_-1_badge.png','0435072839',0,0,'','','','user',NULL,NULL,NULL,NULL,-1,NULL,NULL),(219,'PERSONAL','Atieh Ghazizadeh','atieh.ghazizadeh@gmail.com','',NULL,'atieh.ghazizadeh@gmail.com','','0435072839',0,0,'','','','user',NULL,NULL,NULL,NULL,-1,NULL,NULL),(295,'PERSONAL','Iman Norouzi Abadchi','darvish.m@gmail.com','',NULL,'darvish.m@gmail.com','','07597517317',0,0,'','','','user','','',NULL,NULL,-1,NULL,NULL),(358,'PERSONAL','انگلس','Engels@gmail.com','',NULL,'Engels@gmail.com','/sholop-api/download/users/user_-1_marx-engels.jpg','12121211',0,0,'','','','user','','',NULL,NULL,22,NULL,NULL);
/*!40000 ALTER TABLE `sh_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sh_venue`
--

DROP TABLE IF EXISTS `sh_venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sh_venue` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `persian_address_1` text CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `persian_address_2` text CHARACTER SET utf8 COLLATE utf8_persian_ci,
  `english_address` text CHARACTER SET utf8 COLLATE utf8_persian_ci NOT NULL,
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `map_url` varchar(300) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL DEFAULT '0',
  `modified` timestamp NULL DEFAULT NULL,
  `modified_by` int NOT NULL DEFAULT '0',
  `farsi_address1` varchar(255) DEFAULT NULL,
  `farsi_address2` varchar(255) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sh_venue`
--

LOCK TABLES `sh_venue` WRITE;
/*!40000 ALTER TABLE `sh_venue` DISABLE KEYS */;
INSERT INTO `sh_venue` VALUES (190,22,35.69968630125204,51.33808135986328,'استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','',1,'/sholop-api/downloadFile/venue_Mon%20Jul%2013%2015:08:52%20AEST%202020.png','2020-07-13 05:08:57',0,NULL,0,NULL,NULL),(194,22,35.69968630125204,51.33808135986328,'استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','',1,'/sholop-api/downloadFile/venue_Mon%20Jul%2013%2015:10:46%20AEST%202020.png','2020-07-13 05:10:47',0,NULL,0,NULL,NULL),(202,22,35.6892,51.389,'','','','','',0,'/sholop-api/downloadFile/venue_Mon%20Jul%2013%2015:57:21%20AEST%202020.png','2020-07-13 05:57:22',0,NULL,0,NULL,NULL),(207,22,35.69968630125204,51.33808135986328,'110','','110','','',0,'/sholop-api/downloadFile/venue_Mon%20Jul%2013%2017:15:25%20AEST%202020.png','2020-07-13 07:15:27',0,NULL,0,NULL,NULL),(213,22,35.710506973717436,51.31158071899415,'بازارچه ٨، شهرک اکباتان، تهران، استان تهران، ایران','','بازارچه ٨، شهرک اکباتان، تهران، استان تهران، ایران','','',1,'/sholop-api/downloadFile/venue_Mon%20Jul%2013%2017:18:49%20AEST%202020.png','2020-07-13 07:18:50',0,NULL,0,NULL,NULL),(220,22,35.6892,51.389,'','','','','',0,'/sholop-api/downloadFile/venue_Tue%20Jul%2014%2011:19:48%20AEST%202020.png','2020-07-14 01:19:48',0,NULL,0,NULL,NULL),(223,22,35.6892,51.389,'','','','','',0,'/sholop-api/downloadFile/venue_Tue%20Jul%2014%2011:20:10%20AEST%202020.png','2020-07-14 01:20:10',0,NULL,0,NULL,NULL),(226,22,35.6892,51.389,'','','','','',0,'/sholop-api/downloadFile/venue_Tue%20Jul%2014%2011:21:17%20AEST%202020.png','2020-07-14 01:21:17',0,NULL,0,NULL,NULL),(241,22,35.6892,51.389,'1 17 Myoora Road','','1 17 Myoora Road','','',NULL,'/sholop-api/downloadFile/venue_Wed%20Jul%2015%2012:47:57%20AEST%202020.png','2020-07-15 02:47:58',0,NULL,0,NULL,NULL),(246,22,35.68724806453682,51.39826971435548,'استان تهران، تهران، Imam Khomeini, ایستگاه مترو دانشگاه امام علی، ایران','','استان تهران، تهران، Imam Khomeini, ایستگاه مترو دانشگاه امام علی، ایران','','',NULL,'/sholop-api/downloadFile/venue_Wed%20Jul%2015%2022:54:31%20AEST%202020.png','2020-07-15 12:54:32',0,NULL,0,NULL,NULL),(250,22,35.69968630125204,51.33808135986328,'استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','',NULL,'/sholop-api/downloadFile/venue_Wed%20Jul%2015%2022:59:07%20AEST%202020.png','2020-07-15 12:59:08',0,NULL,0,NULL,NULL),(255,22,35.69968630125204,51.33808135986328,'استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','',NULL,'/sholop-api/download/venues/venue_Wed%20Jul%2015%2023:06:21%20AEST%202020.png','2020-07-15 13:06:22',0,NULL,0,NULL,NULL),(260,22,35.69968630125204,51.33808135986328,'استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','استان تهران، تهران، میدان آزادی، برج آزادی، ایران','','',NULL,'/sholop-api/download/venues/venue_WedJul1523:10:26AEST2020.png','2020-07-15 13:10:28',0,NULL,0,NULL,NULL),(265,22,35.52655174811916,51.210753079589765,'اسلام شهر، بزرگراه کمربندی دوم تهران، ایران','','اسلام شهر، بزرگراه کمربندی دوم تهران، ایران','','',NULL,'/sholop-api/download/venues/venue_WedJul1523:11:03AEST2020.png','2020-07-15 13:11:03',0,NULL,0,NULL,NULL),(273,22,35.6892,51.389,'','','','','',NULL,'/sholop-api/download/venues/venue_MonJul2021:27:18AEST2020.png','2020-07-20 11:27:18',0,NULL,0,NULL,NULL),(280,22,35.6892,51.389,'','','','','',NULL,'/sholop-api/download/venues/venue_TueJul2119:12:17AEST2020.png','2020-07-21 09:12:22',0,NULL,0,NULL,NULL),(283,22,35.6892,51.389,'','','','','',NULL,'/sholop-api/download/venues/venue_TueJul2119:20:32AEST2020.png','2020-07-21 09:20:32',0,NULL,0,NULL,NULL),(286,22,35.6892,51.389,'','','','','',NULL,'/sholop-api/download/venues/venue_TueJul2119:20:21AEST2020.png','2020-07-21 09:20:33',0,NULL,0,NULL,NULL),(314,22,35.6892,51.389,'','','','','',NULL,'/sholop-api/download/venues/venue_SatJul2512:40:13AEST2020.png','2020-07-25 02:40:14',0,NULL,0,NULL,NULL),(335,22,35.710280295646456,51.39232635498047,'استان تهران، تهران، منطقه ۶، بلوار کشاورز، بوستان لاله، ایران','','استان تهران، تهران، منطقه ۶، بلوار کشاورز، بوستان لاله، ایران','','',NULL,'/sholop-api/download/venues/venue_SunJul2613:50:03AEST2020.png','2020-07-26 03:50:04',0,NULL,0,NULL,NULL),(338,22,35.71357338482785,51.525470794677744,'تهران،استان تهران،، ایران','','تهران،استان تهران،، ایران','','',NULL,'/sholop-api/download/venues/venue_SunJul2613:53:07AEST2020.png','2020-07-26 03:53:08',0,NULL,0,NULL,NULL),(344,22,35.71920046208453,51.55265808105469,'ایران،استان تهران،تهران منطقه۱۳،تهران نو،، ایران','درست میشه','ایران،استان تهران،تهران منطقه۱۳،تهران نو،، ایران','','',NULL,'/sholop-api/download/venues/venue_SunJul2613:57:19AEST2020.png','2020-07-26 03:57:20',0,NULL,0,NULL,NULL),(349,22,35.687365704857,51.50212484741212,'استان تهران، تهران، دوشان تپه، Habibi، ایران','اینجا رو دیگه درست بزن','استان تهران، تهران، دوشان تپه، Habibi، ایران','','',NULL,'/sholop-api/download/venues/venue_SunJul2613:58:49AEST2020.png','2020-07-26 03:58:50',0,NULL,0,NULL,NULL),(353,22,35.6892,51.389,'','','','','',NULL,'/sholop-api/download/venues/venue_SunJul2614:06:13AEST2020.png','2020-07-26 04:06:14',0,NULL,0,NULL,NULL),(360,22,14.4855858,121.0267051,'Russia, پاراناک، کلانشهر مانیل، فیلیپین','پشت خونه‌ی تروتسکی اینا','Russia, پاراناک، کلانشهر مانیل، فیلیپین','','',NULL,'/sholop-api/download/venues/venue_SunJul2614:47:25AEST2020.png','2020-07-26 04:47:26',0,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `sh_venue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-03 12:11:34
