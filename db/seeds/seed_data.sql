-- MySQL dump 10.13  Distrib 9.6.0, for macos26.4 (arm64)
--
-- Host: localhost    Database: bikemaster
-- ------------------------------------------------------
-- Server version	9.6.0

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
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` (`id`, `name`, `slug`, `plan`, `is_active`, `created_at`, `updated_at`) VALUES ('8843e4fb-63d2-4376-976b-ab9b61c65eec','Bike Masters Group','bike-masters','enterprise',1,'2026-06-01 02:33:15','2026-06-01 02:33:15');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `garages`
--

LOCK TABLES `garages` WRITE;
/*!40000 ALTER TABLE `garages` DISABLE KEYS */;
INSERT INTO `garages` (`id`, `organization_id`, `name`, `code`, `address`, `city`, `state`, `pincode`, `phone`, `email`, `gstin`, `logo_url`, `is_active`, `created_at`, `updated_at`) VALUES ('11111111-1111-1111-1111-111111111111','8843e4fb-63d2-4376-976b-ab9b61c65eec','Bhubaneswar Branch','BBR-001',NULL,'Bhubaneswar','Odisha','751024','+91 674 123456','bbr@bikemasters.in','21AAAAA0000A1Z0',NULL,1,'2026-06-01 02:33:15','2026-06-01 02:33:15');
INSERT INTO `garages` (`id`, `organization_id`, `name`, `code`, `address`, `city`, `state`, `pincode`, `phone`, `email`, `gstin`, `logo_url`, `is_active`, `created_at`, `updated_at`) VALUES ('22222222-2222-2222-2222-222222222222','8843e4fb-63d2-4376-976b-ab9b61c65eec','Cuttack Branch','CTC-002',NULL,'Cuttack','Odisha','753001','+91 671 654321','ctc@bikemasters.in','21BBBBB0000A1Z1',NULL,1,'2026-06-01 02:33:15','2026-06-01 02:33:15');
INSERT INTO `garages` (`id`, `organization_id`, `name`, `code`, `address`, `city`, `state`, `pincode`, `phone`, `email`, `gstin`, `logo_url`, `is_active`, `created_at`, `updated_at`) VALUES ('33333333-3333-3333-3333-000000000001','8843e4fb-63d2-4376-976b-ab9b61c65eec','Patia Branch','PTI-003','Plot No. 42, Patia Main Road','Bhubaneswar','Odisha','751024','+91 674 987654','ptia@bikemasters.in','21CCCCC0000A1Z2',NULL,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
/*!40000 ALTER TABLE `garages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `designations`
--

LOCK TABLES `designations` WRITE;
/*!40000 ALTER TABLE `designations` DISABLE KEYS */;
INSERT INTO `designations` (`id`, `garage_id`, `name`, `created_at`) VALUES ('55555555-5555-5555-5555-555555555555','11111111-1111-1111-1111-111111111111','Senior Technician','2026-06-01 02:33:15');
INSERT INTO `designations` (`id`, `garage_id`, `name`, `created_at`) VALUES ('66666666-6666-6666-6666-666666666666','11111111-1111-1111-1111-111111111111','Service Advisor','2026-06-01 02:33:15');
INSERT INTO `designations` (`id`, `garage_id`, `name`, `created_at`) VALUES ('ptia-desig-001','33333333-3333-3333-3333-000000000001','Senior Technician','2026-06-01 05:00:00');
INSERT INTO `designations` (`id`, `garage_id`, `name`, `created_at`) VALUES ('ptia-desig-002','33333333-3333-3333-3333-000000000001','Service Advisor','2026-06-01 05:00:00');
/*!40000 ALTER TABLE `designations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `organization_id`, `email`, `phone`, `password_hash`, `first_name`, `last_name`, `avatar_url`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES ('33333333-3333-3333-3333-333333333333','8843e4fb-63d2-4376-976b-ab9b61c65eec','admin@bikemasters.in','+91 98765 43210','$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y','Aditya','Pradhan',NULL,'super_admin',1,NULL,'2026-06-01 02:33:15','2026-06-01 02:33:15');
INSERT INTO `users` (`id`, `organization_id`, `email`, `phone`, `password_hash`, `first_name`, `last_name`, `avatar_url`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES ('44444444-4444-4444-4444-444444444444','8843e4fb-63d2-4376-976b-ab9b61c65eec','manager.bbr@bikemasters.in','+91 99999 88888','$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y','Subhashis','Sen',NULL,'garage_manager',1,NULL,'2026-06-01 02:33:15','2026-06-01 02:33:15');
INSERT INTO `users` (`id`, `organization_id`, `email`, `phone`, `password_hash`, `first_name`, `last_name`, `avatar_url`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES ('ptia-user-00001','8843e4fb-63d2-4376-976b-ab9b61c65eec','manager.ptia@bikemasters.in','+91 88888 11111','$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y','Deepak','Mohanty',NULL,'garage_manager',1,NULL,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `users` (`id`, `organization_id`, `email`, `phone`, `password_hash`, `first_name`, `last_name`, `avatar_url`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES ('ptia-user-00002','8843e4fb-63d2-4376-976b-ab9b61c65eec','advisor.ptia@bikemasters.in','+91 88888 22222','$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y','Sneha','Pattnaik',NULL,'service_advisor',1,NULL,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `users` (`id`, `organization_id`, `email`, `phone`, `password_hash`, `first_name`, `last_name`, `avatar_url`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES ('ptia-user-00003','8843e4fb-63d2-4376-976b-ab9b61c65eec','tech.ptia@bikemasters.in','+91 88888 33333','$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y','Bikash','Nayak',NULL,'technician',1,NULL,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `users` (`id`, `organization_id`, `email`, `phone`, `password_hash`, `first_name`, `last_name`, `avatar_url`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES ('ptia-user-00004','8843e4fb-63d2-4376-976b-ab9b61c65eec','cashier.ptia@bikemasters.in','+91 88888 44444','$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y','Kavita','Rath',NULL,'cashier',1,NULL,'2026-06-01 05:00:00','2026-06-01 05:00:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_garage_assignments`
--

LOCK TABLES `user_garage_assignments` WRITE;
/*!40000 ALTER TABLE `user_garage_assignments` DISABLE KEYS */;
INSERT INTO `user_garage_assignments` (`id`, `user_id`, `garage_id`, `is_primary`, `created_at`) VALUES ('2452db74-5d34-11f1-aba5-09d40cbc8f94','33333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111',1,'2026-06-01 02:33:15');
INSERT INTO `user_garage_assignments` (`id`, `user_id`, `garage_id`, `is_primary`, `created_at`) VALUES ('2452dd7c-5d34-11f1-aba5-09d40cbc8f94','44444444-4444-4444-4444-444444444444','11111111-1111-1111-1111-111111111111',1,'2026-06-01 02:33:15');
INSERT INTO `user_garage_assignments` (`id`, `user_id`, `garage_id`, `is_primary`, `created_at`) VALUES ('ptia-uga-000001','ptia-user-00001','33333333-3333-3333-3333-000000000001',1,'2026-06-01 05:00:00');
INSERT INTO `user_garage_assignments` (`id`, `user_id`, `garage_id`, `is_primary`, `created_at`) VALUES ('ptia-uga-000002','ptia-user-00002','33333333-3333-3333-3333-000000000001',1,'2026-06-01 05:00:00');
INSERT INTO `user_garage_assignments` (`id`, `user_id`, `garage_id`, `is_primary`, `created_at`) VALUES ('ptia-uga-000003','ptia-user-00003','33333333-3333-3333-3333-000000000001',1,'2026-06-01 05:00:00');
INSERT INTO `user_garage_assignments` (`id`, `user_id`, `garage_id`, `is_primary`, `created_at`) VALUES ('ptia-uga-000004','ptia-user-00004','33333333-3333-3333-3333-000000000001',1,'2026-06-01 05:00:00');
INSERT INTO `user_garage_assignments` (`id`, `user_id`, `garage_id`, `is_primary`, `created_at`) VALUES ('ptia-uga-admin01','33333333-3333-3333-3333-333333333333','33333333-3333-3333-3333-000000000001',0,'2026-06-01 05:00:00');
/*!40000 ALTER TABLE `user_garage_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` (`id`, `user_id`, `garage_id`, `designation_id`, `employee_code`, `name`, `phone`, `email`, `type`, `is_active`, `created_at`, `updated_at`) VALUES ('77777777-7777-7777-7777-777777777777','44444444-4444-4444-4444-444444444444','11111111-1111-1111-1111-111111111111','66666666-6666-6666-6666-666666666666','EMP-BBR-001','Subhashis Sen','+91 99999 88888',NULL,'service_advisor',1,'2026-06-01 02:33:15','2026-06-01 02:33:15');
INSERT INTO `employees` (`id`, `user_id`, `garage_id`, `designation_id`, `employee_code`, `name`, `phone`, `email`, `type`, `is_active`, `created_at`, `updated_at`) VALUES ('88888888-8888-8888-8888-888888888888',NULL,'11111111-1111-1111-1111-111111111111','55555555-5555-5555-5555-555555555555','EMP-BBR-102','Manoj Kumar','+91 88888 77777',NULL,'technician',1,'2026-06-01 02:33:15','2026-06-01 02:33:15');
INSERT INTO `employees` (`id`, `user_id`, `garage_id`, `designation_id`, `employee_code`, `name`, `phone`, `email`, `type`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-emp-000001','ptia-user-00001','33333333-3333-3333-3333-000000000001','ptia-desig-002','EMP-PTI-001','Deepak Mohanty','+91 88888 11111',NULL,'service_advisor',1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `employees` (`id`, `user_id`, `garage_id`, `designation_id`, `employee_code`, `name`, `phone`, `email`, `type`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-emp-000002','ptia-user-00003','33333333-3333-3333-3333-000000000001','ptia-desig-001','EMP-PTI-102','Bikash Nayak','+91 88888 33333',NULL,'technician',1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicle_categories`
--

LOCK TABLES `vehicle_categories` WRITE;
/*!40000 ALTER TABLE `vehicle_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicle_brands`
--

LOCK TABLES `vehicle_brands` WRITE;
/*!40000 ALTER TABLE `vehicle_brands` DISABLE KEYS */;
INSERT INTO `vehicle_brands` (`id`, `organization_id`, `name`, `logo_url`, `is_active`) VALUES ('99999999-9999-9999-9999-999999999999','8843e4fb-63d2-4376-976b-ab9b61c65eec','Honda',NULL,1);
INSERT INTO `vehicle_brands` (`id`, `organization_id`, `name`, `logo_url`, `is_active`) VALUES ('brand-bajaj-0001','8843e4fb-63d2-4376-976b-ab9b61c65eec','Bajaj',NULL,1);
INSERT INTO `vehicle_brands` (`id`, `organization_id`, `name`, `logo_url`, `is_active`) VALUES ('brand-hero-00001','8843e4fb-63d2-4376-976b-ab9b61c65eec','Hero',NULL,1);
INSERT INTO `vehicle_brands` (`id`, `organization_id`, `name`, `logo_url`, `is_active`) VALUES ('brand-honda-0001','8843e4fb-63d2-4376-976b-ab9b61c65eec','Honda',NULL,1);
INSERT INTO `vehicle_brands` (`id`, `organization_id`, `name`, `logo_url`, `is_active`) VALUES ('brand-ktm-00001','8843e4fb-63d2-4376-976b-ab9b61c65eec','KTM',NULL,1);
INSERT INTO `vehicle_brands` (`id`, `organization_id`, `name`, `logo_url`, `is_active`) VALUES ('brand-tvs-000001','8843e4fb-63d2-4376-976b-ab9b61c65eec','TVS',NULL,1);
INSERT INTO `vehicle_brands` (`id`, `organization_id`, `name`, `logo_url`, `is_active`) VALUES ('brand-yamaha-001','8843e4fb-63d2-4376-976b-ab9b61c65eec','Yamaha',NULL,1);
/*!40000 ALTER TABLE `vehicle_brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicle_models`
--

LOCK TABLES `vehicle_models` WRITE;
/*!40000 ALTER TABLE `vehicle_models` DISABLE KEYS */;
INSERT INTO `vehicle_models` (`id`, `brand_id`, `name`, `fuel_type`, `vehicle_type`, `is_active`) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','99999999-9999-9999-9999-999999999999','Activa 6G','petrol','two_wheeler',1);
INSERT INTO `vehicle_models` (`id`, `brand_id`, `name`, `fuel_type`, `vehicle_type`, `is_active`) VALUES ('model-activa-001','brand-honda-0001','Activa 6G','petrol','two_wheeler',1);
INSERT INTO `vehicle_models` (`id`, `brand_id`, `name`, `fuel_type`, `vehicle_type`, `is_active`) VALUES ('model-bajaj-pls150','brand-bajaj-0001','Pulsar 150','petrol','two_wheeler',1);
INSERT INTO `vehicle_models` (`id`, `brand_id`, `name`, `fuel_type`, `vehicle_type`, `is_active`) VALUES ('model-hero-splndr','brand-hero-00001','Splendor Plus','petrol','two_wheeler',1);
INSERT INTO `vehicle_models` (`id`, `brand_id`, `name`, `fuel_type`, `vehicle_type`, `is_active`) VALUES ('model-ktm-duke200','brand-ktm-00001','Duke 200','petrol','two_wheeler',1);
INSERT INTO `vehicle_models` (`id`, `brand_id`, `name`, `fuel_type`, `vehicle_type`, `is_active`) VALUES ('model-tvs-apache','brand-tvs-000001','Apache RTR 160','petrol','two_wheeler',1);
INSERT INTO `vehicle_models` (`id`, `brand_id`, `name`, `fuel_type`, `vehicle_type`, `is_active`) VALUES ('model-yamaha-fz','brand-yamaha-001','FZ-S V3','petrol','two_wheeler',1);
/*!40000 ALTER TABLE `vehicle_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicle_variants`
--

LOCK TABLES `vehicle_variants` WRITE;
/*!40000 ALTER TABLE `vehicle_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `customer_sources`
--

LOCK TABLES `customer_sources` WRITE;
/*!40000 ALTER TABLE `customer_sources` DISABLE KEYS */;
INSERT INTO `customer_sources` (`id`, `garage_id`, `name`, `company_name`, `gstin`, `contact_person`, `address`, `is_active`) VALUES ('ptia-src-00001','33333333-3333-3333-3333-000000000001','Walk-in',NULL,NULL,NULL,NULL,1);
INSERT INTO `customer_sources` (`id`, `garage_id`, `name`, `company_name`, `gstin`, `contact_person`, `address`, `is_active`) VALUES ('ptia-src-00002','33333333-3333-3333-3333-000000000001','Online Booking',NULL,NULL,NULL,NULL,1);
INSERT INTO `customer_sources` (`id`, `garage_id`, `name`, `company_name`, `gstin`, `contact_person`, `address`, `is_active`) VALUES ('ptia-src-00003','33333333-3333-3333-3333-000000000001','Referral',NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `customer_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `spare_brands`
--

LOCK TABLES `spare_brands` WRITE;
/*!40000 ALTER TABLE `spare_brands` DISABLE KEYS */;
/*!40000 ALTER TABLE `spare_brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `spare_parts`
--

LOCK TABLES `spare_parts` WRITE;
/*!40000 ALTER TABLE `spare_parts` DISABLE KEYS */;
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Engine Oil Premium 10W30 (800ml)','SP-OIL-10W30',NULL,'Honda','Activa 6G','Standard','OEM','Rack A1','27101971','BTL',NULL,10,1,'2026-06-01 03:00:33','2026-06-01 18:10:26');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Spark Plug Champion NGK','SP-PLUG-NGK01',NULL,'Universal','All Models','N/A','NGK','Rack B2','85111000','PCS',NULL,20,1,'2026-06-01 03:00:33','2026-06-01 18:10:26');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Air Filter Element','SP-AIR-FILT01',NULL,NULL,NULL,NULL,NULL,'Storage','84212300','PCS',NULL,15,1,'2026-06-01 03:00:33','2026-06-01 03:00:33');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','Rear Brake Shoe Assembly','SP-BRK-REAR01',NULL,NULL,NULL,NULL,NULL,'Storage','87083000','SET',NULL,8,1,'2026-06-01 03:00:33','2026-06-01 03:00:33');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','Chain Sprocket Kit','SP-CHN-SPK01',NULL,NULL,NULL,NULL,NULL,'Storage','73151100','SET',NULL,5,1,'2026-06-01 03:00:33','2026-06-01 03:00:33');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','Clutch Cable Assembly','SP-CLCH-CBL01',NULL,NULL,NULL,NULL,NULL,'Storage','87089900','PCS',NULL,10,1,'2026-06-01 03:00:33','2026-06-01 03:00:33');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111','Engine Flush Fluid Premium','SP-FLSH-ENG01',NULL,NULL,NULL,NULL,NULL,'Storage','38119000','BTL',NULL,15,1,'2026-06-01 03:00:33','2026-06-01 03:00:33');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000008','11111111-1111-1111-1111-111111111111','Fork Oil 10W (500ml)','SP-FRK-OIL01',NULL,NULL,NULL,NULL,NULL,'Storage','27101971','BTL',NULL,5,1,'2026-06-01 03:00:33','2026-06-01 03:00:33');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000009','11111111-1111-1111-1111-111111111111','Throttle Cable Standard','SP-THR-CBL01',NULL,NULL,NULL,NULL,NULL,'Storage','87089900','PCS',NULL,8,1,'2026-06-01 03:00:33','2026-06-01 03:00:33');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('aaa00001-0000-0000-0000-000000000010','11111111-1111-1111-1111-111111111111','Battery 12V 7Ah','SP-BAT-12V7A',NULL,NULL,NULL,NULL,NULL,'Storage','85072000','PCS',NULL,5,1,'2026-06-01 03:00:33','2026-06-01 03:00:33');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc','11111111-1111-1111-1111-111111111111','Brake Pad Front','BP-HON-098',NULL,NULL,NULL,NULL,NULL,'Storage',NULL,'PCS',NULL,10,1,'2026-06-01 02:33:15','2026-06-01 02:33:15');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00001','33333333-3333-3333-3333-000000000001','Engine Oil Premium 10W30 (800ml)','SP-PTI-OIL01',NULL,'Honda','Activa 6G','Standard','OEM','Rack A1','27101971','BTL',NULL,10,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00002','33333333-3333-3333-3333-000000000001','Spark Plug Champion NGK','SP-PTI-PLG01',NULL,'Universal','All Models','N/A','NGK','Rack B2','85111000','PCS',NULL,20,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00003','33333333-3333-3333-3333-000000000001','Air Filter Element','SP-PTI-AIR01',NULL,'Universal','All Models','N/A','OEM','Storage','84212300','PCS',NULL,15,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00004','33333333-3333-3333-3333-000000000001','Rear Brake Shoe Assembly','SP-PTI-BRK01',NULL,'Universal','All Models','N/A','OEM','Storage','87083000','SET',NULL,8,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00005','33333333-3333-3333-3333-000000000001','Chain Sprocket Kit','SP-PTI-CHN01',NULL,'Universal','All Models','N/A','OEM','Storage','73151100','SET',NULL,5,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00006','33333333-3333-3333-3333-000000000001','Clutch Cable Assembly','SP-PTI-CCB01',NULL,'Universal','All Models','N/A','OEM','Storage','87089900','PCS',NULL,10,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00007','33333333-3333-3333-3333-000000000001','Engine Flush Fluid Premium','SP-PTI-FLU01',NULL,'Universal','All Models','N/A','OEM','Storage','38119000','BTL',NULL,15,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00008','33333333-3333-3333-3333-000000000001','Fork Oil 10W (500ml)','SP-PTI-FRK01',NULL,'Universal','All Models','N/A','OEM','Storage','27101971','BTL',NULL,5,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00009','33333333-3333-3333-3333-000000000001','Throttle Cable Standard','SP-PTI-THR01',NULL,'Universal','All Models','N/A','OEM','Storage','87089900','PCS',NULL,8,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
INSERT INTO `spare_parts` (`id`, `garage_id`, `part_name`, `part_number`, `brand_id`, `compatible_brand`, `compatible_model`, `compatible_variant`, `part_brand`, `bin_location`, `hsn_code`, `unit`, `tax_category_id`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES ('ptia-sp-00010','33333333-3333-3333-3333-000000000001','Battery 12V 7Ah','SP-PTI-BAT01',NULL,'Universal','All Models','N/A','Amara Raja','Storage','85072000','PCS',NULL,5,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');
/*!40000 ALTER TABLE `spare_parts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd','11111111-1111-1111-1111-111111111111','General Washing and Foam Polish','SRV-WSH-01','Mechanical Services',NULL,460.00,NULL,1,'2026-06-01 02:33:15');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-bbr-00001','11111111-1111-1111-1111-111111111111','General Service Standard Labor','SRV-GEN-01',NULL,'998714',650.00,NULL,1,'2026-06-01 03:00:33');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-bbr-00002','11111111-1111-1111-1111-111111111111','Express Washing & Polishing Bundle','SRV-WSH-02',NULL,'998714',400.00,NULL,1,'2026-06-01 03:00:33');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-bbr-00003','11111111-1111-1111-1111-111111111111','Engine Oil Change Labor','SRV-OIL-01',NULL,'998714',150.00,NULL,1,'2026-06-01 03:00:33');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-bbr-00004','11111111-1111-1111-1111-111111111111','Brake Adjustment and Bleeding','SRV-BRK-01',NULL,'998714',300.00,NULL,1,'2026-06-01 03:00:33');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-bbr-00005','11111111-1111-1111-1111-111111111111','Chain Lubrication and Adjustment','SRV-CHN-01',NULL,'998714',200.00,NULL,1,'2026-06-01 03:00:33');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-bbr-00006','11111111-1111-1111-1111-111111111111','Spark Plug Replacement Labor','SRV-PLG-01',NULL,'998714',120.00,NULL,1,'2026-06-01 03:00:33');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-bbr-00007','11111111-1111-1111-1111-111111111111','Air Filter Cleaning/Replacement Labor','SRV-AIR-01',NULL,'998714',180.00,NULL,1,'2026-06-01 03:00:33');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-bbr-00008','11111111-1111-1111-1111-111111111111','Fork Alignment and Straightening','SRV-FRK-01',NULL,'998714',600.00,NULL,1,'2026-06-01 03:00:33');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-ptia-00001','33333333-3333-3333-3333-000000000001','General Service Standard Labor','SRV-PTI-GEN','Mechanical Services','998714',650.00,NULL,1,'2026-06-01 05:00:00');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-ptia-00002','33333333-3333-3333-3333-000000000001','Express Washing & Polishing Bundle','SRV-PTI-WSH','Mechanical Services','998714',400.00,NULL,1,'2026-06-01 05:00:00');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-ptia-00003','33333333-3333-3333-3333-000000000001','Engine Oil Change Labor','SRV-PTI-OIL','Mechanical Services','998714',150.00,NULL,1,'2026-06-01 05:00:00');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-ptia-00004','33333333-3333-3333-3333-000000000001','Brake Adjustment and Bleeding','SRV-PTI-BRK','Mechanical Services','998714',300.00,NULL,1,'2026-06-01 05:00:00');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-ptia-00005','33333333-3333-3333-3333-000000000001','Chain Lubrication and Adjustment','SRV-PTI-CHN','Mechanical Services','998714',200.00,NULL,1,'2026-06-01 05:00:00');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-ptia-00006','33333333-3333-3333-3333-000000000001','Spark Plug Replacement Labor','SRV-PTI-PLG','Mechanical Services','998714',120.00,NULL,1,'2026-06-01 05:00:00');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-ptia-00007','33333333-3333-3333-3333-000000000001','Air Filter Cleaning/Replacement Labor','SRV-PTI-AIR','Mechanical Services','998714',180.00,NULL,1,'2026-06-01 05:00:00');
INSERT INTO `services` (`id`, `garage_id`, `service_name`, `service_code`, `category`, `hsn_sac_code`, `default_rate`, `tax_category_id`, `is_active`, `created_at`) VALUES ('svc-ptia-00008','33333333-3333-3333-3333-000000000001','Fork Alignment and Straightening','SRV-PTI-FRK','Mechanical Services','998714',600.00,NULL,1,'2026-06-01 05:00:00');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` (`id`, `garage_id`, `package_name`, `description`, `total_price`, `validity_days`, `is_active`, `created_at`) VALUES ('pkg-bbr-00001','11111111-1111-1111-1111-111111111111','Premium Annual Tune-up','Complete annual service with oil, spark plug and wash',1250.00,30,1,'2026-06-01 03:00:33');
INSERT INTO `packages` (`id`, `garage_id`, `package_name`, `description`, `total_price`, `validity_days`, `is_active`, `created_at`) VALUES ('pkg-bbr-00002','11111111-1111-1111-1111-111111111111','Express Monsoon Service','Quick service with brake check and wash',850.00,7,1,'2026-06-01 03:00:33');
INSERT INTO `packages` (`id`, `garage_id`, `package_name`, `description`, `total_price`, `validity_days`, `is_active`, `created_at`) VALUES ('pkg-ptia-00001','33333333-3333-3333-3333-000000000001','Premium Annual Tune-up','Complete annual service with oil, spark plug and wash',1250.00,30,1,'2026-06-01 05:00:00');
INSERT INTO `packages` (`id`, `garage_id`, `package_name`, `description`, `total_price`, `validity_days`, `is_active`, `created_at`) VALUES ('pkg-ptia-00002','33333333-3333-3333-3333-000000000001','Express Monsoon Service','Quick service with brake check and wash',850.00,7,1,'2026-06-01 05:00:00');
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `package_items`
--

LOCK TABLES `package_items` WRITE;
/*!40000 ALTER TABLE `package_items` DISABLE KEYS */;
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-00001','pkg-bbr-00001','spare','aaa00001-0000-0000-0000-000000000001',NULL,1.000,450.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-00002','pkg-bbr-00001','spare','aaa00001-0000-0000-0000-000000000002',NULL,1.000,120.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-00003','pkg-bbr-00001','service',NULL,'svc-bbr-00001',1.000,650.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-00004','pkg-bbr-00001','service',NULL,'svc-bbr-00002',1.000,400.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-00005','pkg-bbr-00002','service',NULL,'svc-bbr-00002',1.000,400.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-00006','pkg-bbr-00002','service',NULL,'svc-bbr-00004',1.000,300.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-00007','pkg-bbr-00002','spare','aaa00001-0000-0000-0000-000000000007',NULL,1.000,150.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-ptia-001','pkg-ptia-00001','spare','ptia-sp-00001',NULL,1.000,450.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-ptia-002','pkg-ptia-00001','spare','ptia-sp-00002',NULL,1.000,120.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-ptia-003','pkg-ptia-00001','service',NULL,'svc-ptia-00001',1.000,650.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-ptia-004','pkg-ptia-00001','service',NULL,'svc-ptia-00002',1.000,400.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-ptia-005','pkg-ptia-00002','service',NULL,'svc-ptia-00002',1.000,400.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-ptia-006','pkg-ptia-00002','service',NULL,'svc-ptia-00004',1.000,300.00);
INSERT INTO `package_items` (`id`, `package_id`, `item_type`, `spare_part_id`, `service_id`, `quantity`, `rate`) VALUES ('pki-ptia-007','pkg-ptia-00002','spare','ptia-sp-00007',NULL,1.000,150.00);
/*!40000 ALTER TABLE `package_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` (`id`, `garage_id`, `title`, `description`, `offer_type`, `discount_value`, `applicable_to`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES ('off-00001','11111111-1111-1111-1111-111111111111','Super Summer Discount','Save 10% on all labor charges across services','percentage',10.00,'all','2026-01-01','2026-07-31',1,'2026-06-01 03:00:33');
INSERT INTO `offers` (`id`, `garage_id`, `title`, `description`, `offer_type`, `discount_value`, `applicable_to`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES ('off-00002','11111111-1111-1111-1111-111111111111','Loyal Rider Benefit','Flat ₹100 off for repeat customers (3rd+ visit)','fixed',100.00,'all','2026-01-01','2026-12-31',1,'2026-06-01 03:00:33');
INSERT INTO `offers` (`id`, `garage_id`, `title`, `description`, `offer_type`, `discount_value`, `applicable_to`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES ('off-00003','11111111-1111-1111-1111-111111111111','Engine Flush Combo','Free Engine Flush Fluid worth ₹150 with any major service','free_part',150.00,'all','2026-01-01','2026-12-31',1,'2026-06-01 03:00:33');
INSERT INTO `offers` (`id`, `garage_id`, `title`, `description`, `offer_type`, `discount_value`, `applicable_to`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES ('off-ptia-001','33333333-3333-3333-3333-000000000001','Patia Grand Opening Discount','20% off on all labor for first 3 months','percentage',20.00,'all','2026-06-01','2026-08-31',1,'2026-06-01 05:00:00');
INSERT INTO `offers` (`id`, `garage_id`, `title`, `description`, `offer_type`, `discount_value`, `applicable_to`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES ('off-ptia-002','33333333-3333-3333-3333-000000000001','Loyal Rider Benefit','Flat Rs.100 off for repeat customers (3rd+ visit)','fixed',100.00,'all','2026-06-01','2026-12-31',1,'2026-06-01 05:00:00');
INSERT INTO `offers` (`id`, `garage_id`, `title`, `description`, `offer_type`, `discount_value`, `applicable_to`, `start_date`, `end_date`, `is_active`, `created_at`) VALUES ('off-ptia-003','33333333-3333-3333-3333-000000000001','Free Engine Flush Combo','Free Engine Flush Fluid with any major service','free_part',150.00,'all','2026-06-01','2026-12-31',1,'2026-06-01 05:00:00');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tax_rates`
--

LOCK TABLES `tax_rates` WRITE;
/*!40000 ALTER TABLE `tax_rates` DISABLE KEYS */;
INSERT INTO `tax_rates` (`id`, `organization_id`, `name`, `cgst_rate`, `sgst_rate`, `igst_rate`, `is_active`) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','8843e4fb-63d2-4376-976b-ab9b61c65eec','GST 18%',9.00,9.00,18.00,1);
/*!40000 ALTER TABLE `tax_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `message_templates`
--

LOCK TABLES `message_templates` WRITE;
/*!40000 ALTER TABLE `message_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `message_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-03 17:49:45
