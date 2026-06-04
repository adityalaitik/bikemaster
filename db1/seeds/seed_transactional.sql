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
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` (`id`, `garage_id`, `name`, `phone`, `alternate_phone`, `email`, `address`, `city`, `gstin`, `customer_type`, `source_id`, `loyalty_points`, `is_active`, `created_at`, `updated_at`) VALUES ('28bbbe39-e8f9-4879-a1c7-20a8dd3848b0','33333333-3333-3333-3333-000000000001','Aditya Pradhan','9040404009',NULL,NULL,NULL,NULL,NULL,'individual',NULL,0,1,'2026-06-03 18:30:40','2026-06-03 18:30:40');
INSERT INTO `customers` (`id`, `garage_id`, `name`, `phone`, `alternate_phone`, `email`, `address`, `city`, `gstin`, `customer_type`, `source_id`, `loyalty_points`, `is_active`, `created_at`, `updated_at`) VALUES ('7d8d88f2-9a66-46dd-986c-f9411e151e8b','11111111-1111-1111-1111-111111111111','jay jagannath','9876543211',NULL,NULL,NULL,NULL,NULL,'individual',NULL,0,1,'2026-06-01 22:46:51','2026-06-01 22:46:51');
INSERT INTO `customers` (`id`, `garage_id`, `name`, `phone`, `alternate_phone`, `email`, `address`, `city`, `gstin`, `customer_type`, `source_id`, `loyalty_points`, `is_active`, `created_at`, `updated_at`) VALUES ('cust-dev-0000001','11111111-1111-1111-1111-111111111111','Devendra Mishra','+91 91234 56789',NULL,NULL,NULL,NULL,NULL,'individual',NULL,0,1,'2026-06-01 03:14:42','2026-06-01 03:14:42');
INSERT INTO `customers` (`id`, `garage_id`, `name`, `phone`, `alternate_phone`, `email`, `address`, `city`, `gstin`, `customer_type`, `source_id`, `loyalty_points`, `is_active`, `created_at`, `updated_at`) VALUES ('cust-priya-00001','11111111-1111-1111-1111-111111111111','Priya Sharma','+91 98765 12345',NULL,NULL,NULL,NULL,NULL,'individual',NULL,0,1,'2026-06-01 03:14:42','2026-06-01 03:14:42');
INSERT INTO `customers` (`id`, `garage_id`, `name`, `phone`, `alternate_phone`, `email`, `address`, `city`, `gstin`, `customer_type`, `source_id`, `loyalty_points`, `is_active`, `created_at`, `updated_at`) VALUES ('cust-rohan-00001','11111111-1111-1111-1111-111111111111','Rohan Das','+91 99334 55667',NULL,NULL,NULL,NULL,NULL,'individual',NULL,0,1,'2026-06-01 03:14:42','2026-06-01 03:14:42');
INSERT INTO `customers` (`id`, `garage_id`, `name`, `phone`, `alternate_phone`, `email`, `address`, `city`, `gstin`, `customer_type`, `source_id`, `loyalty_points`, `is_active`, `created_at`, `updated_at`) VALUES ('cust-suresh-0001','11111111-1111-1111-1111-111111111111','Suresh Patro','+91 97654 32101',NULL,NULL,NULL,NULL,NULL,'individual',NULL,0,1,'2026-06-01 03:14:42','2026-06-01 03:14:42');
INSERT INTO `customers` (`id`, `garage_id`, `name`, `phone`, `alternate_phone`, `email`, `address`, `city`, `gstin`, `customer_type`, `source_id`, `loyalty_points`, `is_active`, `created_at`, `updated_at`) VALUES ('cust-test-0001','11111111-1111-1111-1111-111111111111','Aditya Pradhan','9876543210',NULL,NULL,NULL,NULL,NULL,'individual',NULL,0,1,'2026-06-01 03:09:33','2026-06-01 03:09:33');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` (`id`, `registration_no`, `organization_id`, `model_id`, `variant_id`, `category_id`, `number_plate_color`, `chassis_no`, `engine_no`, `mfg_year`, `date_of_registration`, `color`, `is_active`, `created_at`, `updated_at`) VALUES ('1088b006-e43c-4fbc-afad-99e68c740c0b','OD08AD1234','8843e4fb-63d2-4376-976b-ab9b61c65eec','2d08d772-508b-4642-bc90-8240a464e21e',NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,1,'2026-06-03 18:30:40','2026-06-03 18:30:40');
INSERT INTO `vehicles` (`id`, `registration_no`, `organization_id`, `model_id`, `variant_id`, `category_id`, `number_plate_color`, `chassis_no`, `engine_no`, `mfg_year`, `date_of_registration`, `color`, `is_active`, `created_at`, `updated_at`) VALUES ('83984633-8c80-4495-b90e-06b2f9cff341','OD-PTI-TEST','8843e4fb-63d2-4376-976b-ab9b61c65eec','model-hero-splndr',NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,1,'2026-06-04 01:09:46','2026-06-04 01:09:46');
INSERT INTO `vehicles` (`id`, `registration_no`, `organization_id`, `model_id`, `variant_id`, `category_id`, `number_plate_color`, `chassis_no`, `engine_no`, `mfg_year`, `date_of_registration`, `color`, `is_active`, `created_at`, `updated_at`) VALUES ('8a9544e1-34cf-40b5-8472-c4ea1030c8d5','OD05AB5252','8843e4fb-63d2-4376-976b-ab9b61c65eec','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 22:46:51','2026-06-01 22:46:51');
INSERT INTO `vehicles` (`id`, `registration_no`, `organization_id`, `model_id`, `variant_id`, `category_id`, `number_plate_color`, `chassis_no`, `engine_no`, `mfg_year`, `date_of_registration`, `color`, `is_active`, `created_at`, `updated_at`) VALUES ('veh-od01ef1111','OD01EF1111','8843e4fb-63d2-4376-976b-ab9b61c65eec','model-tvs-apache',NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 03:14:42','2026-06-01 03:14:42');
INSERT INTO `vehicles` (`id`, `registration_no`, `organization_id`, `model_id`, `variant_id`, `category_id`, `number_plate_color`, `chassis_no`, `engine_no`, `mfg_year`, `date_of_registration`, `color`, `is_active`, `created_at`, `updated_at`) VALUES ('veh-od02cd9999','OD02CD9999','8843e4fb-63d2-4376-976b-ab9b61c65eec','model-hero-splndr',NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 03:14:42','2026-06-01 03:14:42');
INSERT INTO `vehicles` (`id`, `registration_no`, `organization_id`, `model_id`, `variant_id`, `category_id`, `number_plate_color`, `chassis_no`, `engine_no`, `mfg_year`, `date_of_registration`, `color`, `is_active`, `created_at`, `updated_at`) VALUES ('veh-od05ab5678','OD05AB5678','8843e4fb-63d2-4376-976b-ab9b61c65eec','model-bajaj-pls150',NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 03:14:42','2026-06-01 03:14:42');
INSERT INTO `vehicles` (`id`, `registration_no`, `organization_id`, `model_id`, `variant_id`, `category_id`, `number_plate_color`, `chassis_no`, `engine_no`, `mfg_year`, `date_of_registration`, `color`, `is_active`, `created_at`, `updated_at`) VALUES ('veh-od05pq4321','OD05PQ4321','8843e4fb-63d2-4376-976b-ab9b61c65eec','model-ktm-duke200',NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 03:14:42','2026-06-01 03:14:42');
INSERT INTO `vehicles` (`id`, `registration_no`, `organization_id`, `model_id`, `variant_id`, `category_id`, `number_plate_color`, `chassis_no`, `engine_no`, `mfg_year`, `date_of_registration`, `color`, `is_active`, `created_at`, `updated_at`) VALUES ('veh-test-00001','OD05AB1234','8843e4fb-63d2-4376-976b-ab9b61c65eec','model-activa-001',NULL,NULL,'white',NULL,NULL,NULL,NULL,NULL,1,'2026-06-01 03:09:46','2026-06-01 03:09:46');
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `customer_vehicles`
--

LOCK TABLES `customer_vehicles` WRITE;
/*!40000 ALTER TABLE `customer_vehicles` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `job_cards`
--

LOCK TABLES `job_cards` WRITE;
/*!40000 ALTER TABLE `job_cards` DISABLE KEYS */;
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('32891765-accc-44f0-95de-46d82c4b4399','JC-BBR-2026-00011','11111111-1111-1111-1111-111111111111','8a9544e1-34cf-40b5-8472-c4ea1030c8d5','7d8d88f2-9a66-46dd-986c-f9411e151e8b',NULL,1234,NULL,'delivered','regular','2026-06-01 22:46:51',NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,0.00,100,'2026-06-01 22:46:51','2026-06-01 22:50:09',1062.00,'{\"card\": 1062, \"cash\": 0, \"other\": 0, \"cheque\": 0, \"remarks\": \"\"}','[{\"note\": \"\", \"time\": \"2026-06-01T17:17:33.894Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:20:09.777Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}]');
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('9380fe90-e07d-480c-9b17-bc3de80d2f55','JC-PTI-2026-00001','33333333-3333-3333-3333-000000000001','1088b006-e43c-4fbc-afad-99e68c740c0b','28bbbe39-e8f9-4879-a1c7-20a8dd3848b0',NULL,1234,NULL,'out_for_delivery','regular','2026-06-03 18:30:40',NULL,NULL,'[]',NULL,NULL,NULL,NULL,NULL,5,NULL,0,1,0,682.00,95,'2026-06-03 18:30:40','2026-06-04 01:27:45',3342.00,'{\"card\": 3200, \"cash\": 19, \"other\": 123, \"cheque\": 0, \"remarks\": \"upi\"}','[{\"note\": \"\", \"time\": \"2026-06-03T19:11:36.353Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-03T19:24:52.058Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}]');
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('d660b125-6dcf-4373-a9ae-c3d8ee380df9','JC-PTI-2026-00002','33333333-3333-3333-3333-000000000001','83984633-8c80-4495-b90e-06b2f9cff341','cust-test-0001',NULL,5000,NULL,'completed','regular','2026-06-04 01:09:46',NULL,'2026-06-04 01:39:47','[]',NULL,NULL,NULL,NULL,NULL,5,NULL,0,1,0,390.00,100,'2026-06-04 01:09:46','2026-06-04 01:39:47',1911.00,'{\"card\": 1911, \"cash\": 0, \"other\": 0, \"cheque\": 0, \"remarks\": \"\"}','[{\"note\": \"\", \"time\": \"2026-06-03T19:53:35.607Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-03T19:57:35.102Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-03T20:09:46.660Z\", \"label\": \"Completed\", \"status\": \"completed\"}]');
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('hist-jc-ab1234-001','JC-BBR-2025-00041','11111111-1111-1111-1111-111111111111','veh-test-00001','cust-test-0001','77777777-7777-7777-7777-777777777777',28500,28502,'work_in_progress','regular','2025-01-04 09:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,'Good service overall',0,1,1,0.00,20,'2025-01-04 09:30:00','2026-06-01 22:51:27',1000.00,NULL,'[{\"note\": \"Technician started on engine oil flush\", \"time\": \"2026-06-01T16:09:51.099Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}]');
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('hist-jc-ab1234-002','JC-BBR-2025-00213','11111111-1111-1111-1111-111111111111','veh-test-00001','cust-test-0001','77777777-7777-7777-7777-777777777777',31200,31202,'completed','regular','2025-05-13 10:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,'Excellent! Very satisfied',0,1,1,0.00,100,'2025-05-13 10:00:00','2025-05-13 17:00:00',300.00,NULL,NULL);
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('hist-jc-ab1234-003','JC-BBR-2025-00389','11111111-1111-1111-1111-111111111111','veh-test-00001','cust-test-0001','77777777-7777-7777-7777-777777777777',35800,35802,'completed','accidental','2025-09-20 11:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,'Average, took too long',0,1,1,0.00,100,'2025-09-20 11:00:00','2025-09-21 16:00:00',2200.00,NULL,NULL);
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('hist-jc-pq4321-001','JC-BBR-2025-00078','11111111-1111-1111-1111-111111111111','veh-od05pq4321','cust-rohan-00001','77777777-7777-7777-7777-777777777777',12400,12401,'completed','regular','2025-03-10 09:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,'Quick and clean work',0,1,1,50.00,100,'2025-03-10 09:00:00','2025-03-10 16:30:00',950.00,NULL,NULL);
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('hist-jc-pq4321-002','JC-BBR-2025-00301','11111111-1111-1111-1111-111111111111','veh-od05pq4321','cust-rohan-00001','77777777-7777-7777-7777-777777777777',16800,16801,'completed','regular','2025-08-22 10:30:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,'Perfect service!',0,1,1,0.00,100,'2025-08-22 10:30:00','2025-08-22 17:00:00',1500.00,NULL,NULL);
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('jc-test-uuid-0001','JC-BBR-2026-00001','11111111-1111-1111-1111-111111111111','veh-test-00001','cust-test-0001',NULL,12450,NULL,'under_servicing','regular','2026-06-01 03:09:46',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,0.00,20,'2026-06-01 03:09:46','2026-06-01 03:09:57',0.00,NULL,NULL);
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('jc-uuid-00123','JC-BBR-2026-00123','11111111-1111-1111-1111-111111111111','veh-od01ef1111','cust-suresh-0001','77777777-7777-7777-7777-777777777777',22100,NULL,'next_day_delivery','express','2026-06-01 03:14:42',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0.00,20,'2026-06-01 03:14:42','2026-06-01 03:14:42',0.00,NULL,NULL);
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('jc-uuid-00124','JC-BBR-2026-00124','11111111-1111-1111-1111-111111111111','veh-od02cd9999','cust-dev-0000001','77777777-7777-7777-7777-777777777777',7800,NULL,'under_servicing','regular','2026-06-01 03:14:42',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,0.00,30,'2026-06-01 03:14:42','2026-06-01 05:01:37',0.00,NULL,NULL);
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('jc-uuid-00125','JC-BBR-2026-00125','11111111-1111-1111-1111-111111111111','veh-od05ab5678','cust-priya-00001','77777777-7777-7777-7777-777777777777',34200,NULL,'ready_for_delivery','accidental','2026-06-01 03:14:42',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,200.00,100,'2026-06-01 03:14:42','2026-06-01 03:14:42',0.00,NULL,NULL);
INSERT INTO `job_cards` (`id`, `job_card_no`, `garage_id`, `vehicle_id`, `customer_id`, `service_advisor_id`, `odometer_in`, `odometer_out`, `status`, `service_type`, `date_of_arrival`, `promised_delivery_date`, `actual_delivery_date`, `customer_complaints`, `workshop_findings`, `internal_notes`, `customer_notes`, `gate_pass_no`, `gate_pass_issued_at`, `rating`, `rating_feedback`, `is_deleted`, `is_estimated`, `is_status_filled`, `overall_discount`, `completion`, `created_at`, `updated_at`, `paid_amount`, `payment_breakdown`, `status_history`) VALUES ('jc-uuid-00126','JC-BBR-2026-00126','11111111-1111-1111-1111-111111111111','veh-od05pq4321','cust-rohan-00001','77777777-7777-7777-7777-777777777777',18400,NULL,'out_for_delivery','regular','2026-06-01 03:14:42',NULL,'2026-06-01 05:09:47',NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,0,1,1,910.00,95,'2026-06-01 03:14:42','2026-06-04 00:36:07',13903.00,'{\"card\": 13903, \"cash\": 0, \"other\": 0, \"cheque\": 0, \"remarks\": \"\"}','[{\"note\": \"\", \"time\": \"2026-06-01T16:16:38.652Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:01:59.337Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:02:00.216Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:02:14.239Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:02:15.138Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:05:28.852Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:05:29.721Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:05:34.559Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:05:35.425Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:05:36.310Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:06:24.105Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:06:24.988Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:06:29.864Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:06:30.703Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:06:31.571Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:06:54.956Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:06:55.838Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:07:00.689Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:07:01.555Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:07:02.438Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:08:16.405Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:08:25.623Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:08:56.287Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:09:05.504Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:09:14.721Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-01T17:13:23.309Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-02T17:55:21.694Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-02T17:56:25.896Z\", \"label\": \"Completed\", \"status\": \"completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T17:56:34.938Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:01.815Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:04.181Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:12.380Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:13.261Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:14.145Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:24.446Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:25.328Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:30.195Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:31.112Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:32.018Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:43.275Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:03:44.091Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:04:23.325Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:04:32.541Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:04:41.721Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:07:54.715Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:07.524Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:19.181Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:20.150Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:21.068Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:35.649Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:37.166Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:42.551Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:43.569Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:44.700Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:08:51.153Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:09:00.569Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:09:32.347Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:09:45.447Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:09:54.562Z\", \"label\": \"Delivered\", \"status\": \"delivered\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:15:48.368Z\", \"label\": \"Completed\", \"status\": \"completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:17:47.452Z\", \"label\": \"Client Agreed\", \"status\": \"client_agreed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:18:01.931Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:18:12.799Z\", \"label\": \"Work Completed\", \"status\": \"work_completed\"}, {\"note\": \"\", \"time\": \"2026-06-02T18:18:13.909Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}, {\"note\": \"\", \"time\": \"2026-06-03T19:05:25.998Z\", \"label\": \"Work in Progress\", \"status\": \"work_in_progress\"}, {\"note\": \"\", \"time\": \"2026-06-03T19:06:03.681Z\", \"label\": \"Out for Delivery\", \"status\": \"out_for_delivery\"}]');
/*!40000 ALTER TABLE `job_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `job_complaints`
--

LOCK TABLES `job_complaints` WRITE;
/*!40000 ALTER TABLE `job_complaints` DISABLE KEYS */;
INSERT INTO `job_complaints` (`id`, `job_card_id`, `complaint_text`, `workshop_finding`, `action`, `is_rejected`, `created_at`) VALUES ('81d69259-8112-40b4-9b71-f822db68a755','jc-uuid-00126','Engine noise','Loose chain','repair_now',0,'2026-06-02 23:48:14');
/*!40000 ALTER TABLE `job_complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `job_card_technicians`
--

LOCK TABLES `job_card_technicians` WRITE;
/*!40000 ALTER TABLE `job_card_technicians` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_card_technicians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `job_card_images`
--

LOCK TABLES `job_card_images` WRITE;
/*!40000 ALTER TABLE `job_card_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_card_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicle_inspections`
--

LOCK TABLES `vehicle_inspections` WRITE;
/*!40000 ALTER TABLE `vehicle_inspections` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_inspections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `job_spare_items`
--

LOCK TABLES `job_spare_items` WRITE;
/*!40000 ALTER TABLE `job_spare_items` DISABLE KEYS */;
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('02393971-de9c-4c3d-98df-093a9f0e8012','JC-PTI-2026-00001',NULL,'Rear Brake Shoe Assembly','SP-PTI-BRK01',280.00,360.00,1,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('029f1802-dedb-45cc-9f77-c033fc8849db','JC-PTI-2026-00001',NULL,'Engine Oil Premium 10W30 (800ml)','SP-PTI-OIL01',450.00,520.00,1,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('3666945b-fd14-4da5-bfe1-53835964a9b8','JC-BBR-2026-00126',NULL,'Air Filter Element','SP-AIR-FILT01',160.00,180.00,1,'customer','estimated',NULL,'2026-06-02 23:48:14');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('37e8f34d-53fa-4f59-85b2-453c9d305b6c','JC-BBR-2026-00126',NULL,'Rear Brake Shoe Assembly','SP-BRK-REAR01',350.00,380.00,1,'customer','estimated',NULL,'2026-06-02 23:48:14');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('3f7193ec-dcaa-4c82-814c-b78fdd5b31bd','JC-BBR-2026-00126',NULL,'Engine Oil','SP-OIL-10W30',450.00,480.00,6,'customer','estimated',NULL,'2026-06-02 23:48:14');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('771e8748-0c1e-465e-b6e3-f063ff69b807','JC-PTI-2026-00001',NULL,'Engine Flush Fluid Premium','SP-PTI-FLU01',150.00,200.00,1,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('7dcf6650-5364-4d22-87dc-301a4371d495','JC-BBR-2026-00011',NULL,'Oil','SP001',450.00,480.00,1,'customer','estimated',NULL,'2026-06-01 22:48:56');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('7f08c033-5756-41ac-85dc-aaad5e34b746','JC-PTI-2026-00001',NULL,'Spark Plug Champion NGK','SP-PTI-PLG01',120.00,150.00,2,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('8f3624fb-9943-4e50-a250-597d27b3b2aa','JC-PTI-2026-00001',NULL,'Clutch Cable Assembly','SP-PTI-CCB01',220.00,280.00,1,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('95dbd6df-ce01-4071-b648-ad23c3035bdc','JC-BBR-2025-00041',NULL,'Engine Oil 10W30','SP-OIL-10W30',450.00,480.00,1,'customer','estimated',NULL,'2026-06-01 22:51:27');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('a350ae04-965b-4cfe-a0a6-89f71e3a7558','JC-PTI-2026-00001',NULL,'Chain Sprocket Kit','SP-PTI-CHN01',520.00,650.00,1,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('af47c0dd-9aa6-42df-a835-f5bac0defa3e','JC-PTI-2026-00002',NULL,'Spark Plug Champion NGK','SP-PTI-PLG01',120.00,150.00,1,'customer','estimated',NULL,'2026-06-04 01:23:01');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('b0110300-6d5f-46ca-b779-66fb33933700','JC-PTI-2026-00002',NULL,'Engine Oil Premium 10W30 (800ml)','SP-PTI-OIL01',450.00,520.00,1,'customer','estimated',NULL,'2026-06-04 01:23:01');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('c7e8c356-2b6c-45f6-8feb-eb68cf5b3943','JC-PTI-2026-00002',NULL,'Air Filter Element','SP-PTI-AIR01',180.00,220.00,1,'customer','estimated',NULL,'2026-06-04 01:23:01');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('fd79630f-c004-44bb-b613-5ae14c60b87e','JC-BBR-2026-00126',NULL,'Spark Plug Champion NGK','SP-PLUG-NGK01',120.00,140.00,2,'customer','estimated',NULL,'2026-06-02 23:48:14');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-002-1','JC-BBR-2025-00213',NULL,'Spark Plug NGK','SP-PLUG-NGK01',120.00,140.00,1,'customer','completed',NULL,'2025-05-13 10:00:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-002-2','JC-BBR-2025-00213',NULL,'Brake Shoe','SP-BRAKE-SH01',130.00,160.00,1,'customer','completed',NULL,'2025-05-13 10:00:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-003-1','JC-BBR-2025-00389',NULL,'Front Fork Oil Seal','SP-FORK-SEAL',350.00,400.00,2,'customer','completed',NULL,'2025-09-20 11:00:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-003-2','JC-BBR-2025-00389',NULL,'Clutch Cable','SP-CLUTCH-CB',180.00,220.00,1,'customer','completed',NULL,'2025-09-20 11:00:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-003-3','JC-BBR-2025-00389',NULL,'Engine Oil 10W30','SP-OIL-10W30',450.00,480.00,1,'customer','completed',NULL,'2025-09-20 11:00:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-004-1','JC-BBR-2025-00078',NULL,'Engine Oil 10W30','SP-OIL-10W30',450.00,480.00,1,'customer','completed',NULL,'2025-03-10 09:00:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-004-2','JC-BBR-2025-00078',NULL,'Air Filter','SP-AIR-FILT01',280.00,320.00,1,'customer','completed',NULL,'2025-03-10 09:00:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-005-1','JC-BBR-2025-00301',NULL,'Rear Brake Shoe','SP-BRAKE-SH01',230.00,270.00,1,'customer','completed',NULL,'2025-08-22 10:30:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-005-2','JC-BBR-2025-00301',NULL,'Chain Sprocket Kit','SP-CHAIN-KT01',650.00,750.00,1,'customer','completed',NULL,'2025-08-22 10:30:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsi-005-3','JC-BBR-2025-00301',NULL,'Engine Oil 10W30','SP-OIL-10W30',450.00,480.00,1,'customer','completed',NULL,'2025-08-22 10:30:00');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('jsi-00125-001','JC-BBR-2026-00125',NULL,'Rear Brake Shoe Assembly','SP-BRK-REAR01',350.00,380.00,1,'customer','issued',NULL,'2026-06-01 03:14:42');
INSERT INTO `job_spare_items` (`id`, `job_card_id`, `spare_part_id`, `part_name`, `part_number`, `price`, `mrp`, `quantity`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('jsi-00125-002','JC-BBR-2026-00125',NULL,'Air Filter Element','SP-AIR-FILT01',160.00,180.00,1,'customer','issued',NULL,'2026-06-01 03:14:42');
/*!40000 ALTER TABLE `job_spare_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `job_service_items`
--

LOCK TABLES `job_service_items` WRITE;
/*!40000 ALTER TABLE `job_service_items` DISABLE KEYS */;
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('04dae87d-7d8d-4fa9-ab7f-ffdde45a4b8e','JC-BBR-2026-00126',NULL,'General Washing and Foam Polish','SRV-WSH-01',450.00,'customer','estimated',NULL,'2026-06-02 23:48:14');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('23b89ced-c08c-4f17-9ee4-e2d39cbb72e1','JC-PTI-2026-00001',NULL,'Spark Plug Replacement Labor','SRV-PTI-PLG',120.00,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('5f5d257f-900b-450f-b2d7-4199f0453cf7','JC-BBR-2026-00126',NULL,'General Service','SRV-GEN-01',650.00,'customer','estimated',NULL,'2026-06-02 23:48:14');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('82a334a8-d02a-49bd-80e9-220323055d1c','JC-PTI-2026-00001',NULL,'Express Washing & Polishing Bundle','SRV-PTI-WSH',400.00,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('9603b0bb-b215-4ace-9c55-fd32cd75f8a3','JC-PTI-2026-00002',NULL,'Express Washing & Polishing Bundle','SRV-PTI-WSH',400.00,'customer','estimated',NULL,'2026-06-04 01:23:01');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('b7ff9596-a5b4-495d-848f-128baabff7f4','JC-PTI-2026-00002',NULL,'Engine Oil Change Labor','SRV-PTI-OIL',150.00,'customer','estimated',NULL,'2026-06-04 01:23:01');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('cc5cdc62-0f84-4d2d-a20a-3ae9da42f002','JC-PTI-2026-00001',NULL,'General Service Standard Labor','SRV-PTI-GEN',650.00,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('df154d1a-2fe6-44d7-9ac8-74fc5c81d3c4','JC-PTI-2026-00002',NULL,'General Service Standard Labor','SRV-PTI-GEN',650.00,'customer','estimated',NULL,'2026-06-04 01:23:01');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('e287ab26-4390-4f7c-ae93-0cbaf1624d10','JC-PTI-2026-00001',NULL,'Air Filter Cleaning/Replacement Labor','SRV-PTI-AIR',180.00,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('ee811f4b-6ada-4dd9-9319-5cfcb75606f9','JC-BBR-2025-00041',NULL,'Oil Change','SVC-001',150.00,'customer','estimated',NULL,'2026-06-01 22:51:27');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('fddd696e-b837-4edc-987e-63cb87bc32a8','JC-PTI-2026-00001',NULL,'Chain Lubrication and Adjustment','SRV-PTI-CHN',200.00,'customer','estimated',NULL,'2026-06-04 00:54:20');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsvc-002-1','JC-BBR-2025-00213',NULL,'General Service Labor','SRV-GEN-01',150.00,'customer','completed',NULL,'2025-05-13 10:00:00');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsvc-003-1','JC-BBR-2025-00389',NULL,'Dent & Paint Minor','SRV-DNT-01',800.00,'customer','completed',NULL,'2025-09-20 11:00:00');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsvc-003-2','JC-BBR-2025-00389',NULL,'General Service Labor','SRV-GEN-01',250.00,'customer','completed',NULL,'2025-09-20 11:00:00');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsvc-004-1','JC-BBR-2025-00078',NULL,'General Service Labor','SRV-GEN-01',200.00,'customer','completed',NULL,'2025-03-10 09:00:00');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsvc-004-2','JC-BBR-2025-00078',NULL,'Washing & Polish','SRV-WSH-01',120.00,'customer','completed',NULL,'2025-03-10 09:00:00');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsvc-005-1','JC-BBR-2025-00301',NULL,'General Service Labor','SRV-GEN-01',300.00,'customer','completed',NULL,'2025-08-22 10:30:00');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('hjsvc-005-2','JC-BBR-2025-00301',NULL,'Chain Adjustment','SRV-CHN-01',150.00,'customer','completed',NULL,'2025-08-22 10:30:00');
INSERT INTO `job_service_items` (`id`, `job_card_id`, `service_id`, `service_name`, `service_code`, `rate`, `billed_to`, `status`, `from_package_id`, `created_at`) VALUES ('jsvc-00125-001','JC-BBR-2026-00125',NULL,'Brake Adjustment and Bleeding','SRV-BRK-01',300.00,'customer','completed',NULL,'2026-06-01 03:14:42');
/*!40000 ALTER TABLE `job_service_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventory_batches`
--

LOCK TABLES `inventory_batches` WRITE;
/*!40000 ALTER TABLE `inventory_batches` DISABLE KEYS */;
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00001','cccccccc-cccc-cccc-cccc-cccccccccccc','11111111-1111-1111-1111-111111111111','BATCH-001',280.00,380.00,350.00,50,45,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00002','aaa00001-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','BATCH-002',380.00,480.00,450.00,100,75,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00003','aaa00001-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','BATCH-003',95.00,140.00,120.00,200,183,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00004','aaa00001-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','BATCH-004',120.00,180.00,160.00,80,71,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00005','aaa00001-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','BATCH-005',290.00,380.00,350.00,40,33,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00006','aaa00001-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','BATCH-006',480.00,680.00,620.00,30,28,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00007','aaa00001-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','BATCH-007',180.00,260.00,240.00,25,22,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00008','aaa00001-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111','BATCH-008',120.00,175.00,150.00,60,55,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00009','aaa00001-0000-0000-0000-000000000008','11111111-1111-1111-1111-111111111111','BATCH-009',220.00,320.00,290.00,20,18,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00010','aaa00001-0000-0000-0000-000000000009','11111111-1111-1111-1111-111111111111','BATCH-010',160.00,230.00,210.00,15,12,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('batch-bbr-00011','aaa00001-0000-0000-0000-000000000010','11111111-1111-1111-1111-111111111111','BATCH-011',780.00,1100.00,980.00,10,8,NULL,NULL,'2026-01-01','2026-06-01 03:00:33');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00001','ptia-sp-00001','33333333-3333-3333-3333-000000000001','BATCH-PTI-001',360.00,520.00,450.00,80,78,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00002','ptia-sp-00002','33333333-3333-3333-3333-000000000001','BATCH-PTI-002',95.00,150.00,120.00,60,57,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00003','ptia-sp-00003','33333333-3333-3333-3333-000000000001','BATCH-PTI-003',130.00,220.00,180.00,50,49,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00004','ptia-sp-00004','33333333-3333-3333-3333-000000000001','BATCH-PTI-004',200.00,360.00,280.00,30,29,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00005','ptia-sp-00005','33333333-3333-3333-3333-000000000001','BATCH-PTI-005',420.00,650.00,520.00,20,19,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00006','ptia-sp-00006','33333333-3333-3333-3333-000000000001','BATCH-PTI-006',160.00,280.00,220.00,40,39,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00007','ptia-sp-00007','33333333-3333-3333-3333-000000000001','BATCH-PTI-007',120.00,200.00,150.00,45,44,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00008','ptia-sp-00008','33333333-3333-3333-3333-000000000001','BATCH-PTI-008',180.00,300.00,240.00,25,25,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00009','ptia-sp-00009','33333333-3333-3333-3333-000000000001','BATCH-PTI-009',90.00,160.00,130.00,35,35,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
INSERT INTO `inventory_batches` (`id`, `spare_part_id`, `garage_id`, `batch_no`, `purchase_price`, `mrp`, `selling_price`, `quantity`, `available_qty`, `expiry_date`, `vendor_id`, `purchase_date`, `created_at`) VALUES ('ptia-bat-00010','ptia-sp-00010','33333333-3333-3333-3333-000000000001','BATCH-PTI-010',480.00,750.00,600.00,15,15,NULL,NULL,'2026-06-01','2026-06-01 05:00:00');
/*!40000 ALTER TABLE `inventory_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inventory_transactions`
--

LOCK TABLES `inventory_transactions` WRITE;
/*!40000 ALTER TABLE `inventory_transactions` DISABLE KEYS */;
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('137c2995-e8ab-42b8-bc65-75df510db545','ptia-sp-00005','33333333-3333-3333-3333-000000000001','ptia-bat-00005','issue','job_card','JC-PTI-2026-00001',1,520.00,'33333333-3333-3333-3333-333333333333','2026-06-04 00:54:20');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('244a0257-fa82-45c0-aee1-e2cc5eb1367c','ptia-sp-00002','33333333-3333-3333-3333-000000000001','ptia-bat-00002','issue','job_card','JC-PTI-2026-00001',2,120.00,'33333333-3333-3333-3333-333333333333','2026-06-04 00:54:20');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('27401a84-c33d-41e1-868c-baaadff857ce','aaa00001-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','batch-bbr-00002','issue','job_card','JC-BBR-2025-00041',1,450.00,'33333333-3333-3333-3333-333333333333','2026-06-01 22:51:27');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('2bd16d76-1672-4da2-9886-5168cb10dbfd','ptia-sp-00003','33333333-3333-3333-3333-000000000001','ptia-bat-00003','issue','job_card','JC-PTI-2026-00002',1,180.00,'33333333-3333-3333-3333-333333333333','2026-06-04 01:23:01');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('368102fa-22a1-4bb9-9805-1860c75931de','aaa00001-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','batch-bbr-00005','issue','job_card','JC-BBR-2026-00126',1,350.00,'33333333-3333-3333-3333-333333333333','2026-06-02 23:48:14');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('37de7c36-5fc8-4db2-86d0-c9bcb8c646a2','ptia-sp-00001','33333333-3333-3333-3333-000000000001','ptia-bat-00001','issue','job_card','JC-PTI-2026-00001',1,450.00,'33333333-3333-3333-3333-333333333333','2026-06-04 00:54:20');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('4ba2f3eb-64bf-4ba8-bdf5-21aad8178d10','aaa00001-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','batch-bbr-00003','issue','job_card','JC-BBR-2026-00126',2,120.00,'33333333-3333-3333-3333-333333333333','2026-06-02 23:48:14');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('4f72a3a4-7f7f-477d-a26d-92aec416d137','ptia-sp-00001','33333333-3333-3333-3333-000000000001','ptia-bat-00001','issue','job_card','JC-PTI-2026-00002',1,450.00,'33333333-3333-3333-3333-333333333333','2026-06-04 01:23:01');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('62fd413f-001e-4b3c-8bdd-e654caaf314e','ptia-sp-00007','33333333-3333-3333-3333-000000000001','ptia-bat-00007','issue','job_card','JC-PTI-2026-00001',1,150.00,'33333333-3333-3333-3333-333333333333','2026-06-04 00:54:20');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('736d15d7-070f-4c1b-84da-fccc46a1c78c','aaa00001-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','batch-bbr-00004','issue','job_card','JC-BBR-2026-00126',1,160.00,'33333333-3333-3333-3333-333333333333','2026-06-02 23:48:14');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('80ee6583-b243-4c64-b8ae-e4905c8b3b76','ptia-sp-00004','33333333-3333-3333-3333-000000000001','ptia-bat-00004','issue','job_card','JC-PTI-2026-00001',1,280.00,'33333333-3333-3333-3333-333333333333','2026-06-04 00:54:20');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('d4ac8730-92e8-4bcc-9883-376908a14659','aaa00001-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','batch-bbr-00002','issue','job_card','JC-BBR-2026-00126',6,450.00,'33333333-3333-3333-3333-333333333333','2026-06-02 23:48:14');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('d76990c2-23ca-435b-8704-6255bc3c7ea8','ptia-sp-00002','33333333-3333-3333-3333-000000000001','ptia-bat-00002','issue','job_card','JC-PTI-2026-00002',1,120.00,'33333333-3333-3333-3333-333333333333','2026-06-04 01:23:01');
INSERT INTO `inventory_transactions` (`id`, `spare_part_id`, `garage_id`, `batch_id`, `transaction_type`, `reference_type`, `reference_id`, `quantity`, `unit_price`, `created_by`, `created_at`) VALUES ('f665baf4-4c8c-46ef-b0c4-2d327e991380','ptia-sp-00006','33333333-3333-3333-3333-000000000001','ptia-bat-00006','issue','job_card','JC-PTI-2026-00001',1,220.00,'33333333-3333-3333-3333-333333333333','2026-06-04 00:54:20');
/*!40000 ALTER TABLE `inventory_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('11fb0a68-d272-490b-948b-6d587c8b6d7c','INV-BBR-2026-00008','32891765-accc-44f0-95de-46d82c4b4399','11111111-1111-1111-1111-111111111111','7d8d88f2-9a66-46dd-986c-f9411e151e8b','estimate',450.00,0.00,NULL,0.00,81.00,531.00,450.00,0.00,'draft',NULL,'2026-06-01 22:47:07','2026-06-01 22:48:56');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('2e98b747-c6d9-4ae7-a4d2-fd80cea3dc33','INV-BBR-2026-00002','jc-uuid-00126','11111111-1111-1111-1111-111111111111','cust-rohan-00001','estimate',3200.00,0.00,NULL,0.00,576.00,3776.00,3200.00,0.00,'draft',NULL,'2026-06-01 03:45:12','2026-06-02 23:24:57');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('45dd4760-4c64-4f0f-a344-879ed7b9f6fd','INV-PTI-2026-00001','9380fe90-e07d-480c-9b17-bc3de80d2f55','33333333-3333-3333-3333-000000000001','28bbbe39-e8f9-4879-a1c7-20a8dd3848b0','estimate',1620.00,0.00,NULL,0.00,292.00,1912.00,1620.00,0.00,'draft',NULL,'2026-06-04 00:34:48','2026-06-04 00:34:48');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('54a98c6e-25e5-407b-819c-37107f376469','INV-PTI-2026-00002','d660b125-6dcf-4373-a9ae-c3d8ee380df9','33333333-3333-3333-3333-000000000001','cust-test-0001','estimate',1950.00,0.00,NULL,0.00,351.00,2301.00,1950.00,0.00,'draft',NULL,'2026-06-04 01:23:01','2026-06-04 01:23:01');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('f468ce04-5f24-4e34-8d73-d7368b894135','INV-BBR-2026-00001','jc-test-uuid-0001','11111111-1111-1111-1111-111111111111','cust-test-0001','estimate',1620.00,0.00,NULL,0.00,292.00,1912.00,1912.00,0.00,'draft',NULL,'2026-06-01 03:09:57','2026-06-01 03:09:57');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('hinv-ab1234-001','INV-2025-041','hist-jc-ab1234-001','11111111-1111-1111-1111-111111111111','cust-test-0001','tax_invoice',1080.00,0.00,NULL,0.00,194.40,1274.40,1274.40,0.00,'paid',NULL,'2025-01-04 18:00:00','2025-01-04 18:00:00');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('hinv-ab1234-002','INV-2025-213','hist-jc-ab1234-002','11111111-1111-1111-1111-111111111111','cust-test-0001','tax_invoice',400.00,0.00,NULL,0.00,72.00,472.00,472.00,0.00,'paid',NULL,'2025-05-13 17:00:00','2025-05-13 17:00:00');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('hinv-ab1234-003','INV-2025-389','hist-jc-ab1234-003','11111111-1111-1111-1111-111111111111','cust-test-0001','tax_invoice',2230.00,0.00,NULL,0.00,401.40,2631.40,2631.40,0.00,'partial',NULL,'2025-09-21 16:00:00','2025-09-21 16:00:00');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('hinv-pq4321-001','INV-2025-078','hist-jc-pq4321-001','11111111-1111-1111-1111-111111111111','cust-rohan-00001','tax_invoice',1050.00,50.00,NULL,0.00,180.00,1180.00,1180.00,0.00,'paid',NULL,'2025-03-10 16:30:00','2025-03-10 16:30:00');
INSERT INTO `invoices` (`id`, `invoice_no`, `job_card_id`, `garage_id`, `customer_id`, `invoice_type`, `subtotal`, `discount_amount`, `coupon_code`, `coupon_discount`, `tax_amount`, `total_amount`, `customer_amount`, `insurance_amount`, `status`, `pdf_url`, `created_at`, `updated_at`) VALUES ('hinv-pq4321-002','INV-2025-301','hist-jc-pq4321-002','11111111-1111-1111-1111-111111111111','cust-rohan-00001','tax_invoice',1780.00,0.00,NULL,0.00,320.40,2100.40,2100.40,0.00,'paid',NULL,'2025-08-22 17:00:00','2025-08-22 17:00:00');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vehicle_insurance`
--

LOCK TABLES `vehicle_insurance` WRITE;
/*!40000 ALTER TABLE `vehicle_insurance` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_insurance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `insurance_claims`
--

LOCK TABLES `insurance_claims` WRITE;
/*!40000 ALTER TABLE `insurance_claims` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurance_claims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `insurance_providers`
--

LOCK TABLES `insurance_providers` WRITE;
/*!40000 ALTER TABLE `insurance_providers` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurance_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sold_packages`
--

LOCK TABLES `sold_packages` WRITE;
/*!40000 ALTER TABLE `sold_packages` DISABLE KEYS */;
/*!40000 ALTER TABLE `sold_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `purchase_order_items`
--

LOCK TABLES `purchase_order_items` WRITE;
/*!40000 ALTER TABLE `purchase_order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `crm_followups`
--

LOCK TABLES `crm_followups` WRITE;
/*!40000 ALTER TABLE `crm_followups` DISABLE KEYS */;
/*!40000 ALTER TABLE `crm_followups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `salvages`
--

LOCK TABLES `salvages` WRITE;
/*!40000 ALTER TABLE `salvages` DISABLE KEYS */;
/*!40000 ALTER TABLE `salvages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `counter_sales`
--

LOCK TABLES `counter_sales` WRITE;
/*!40000 ALTER TABLE `counter_sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `counter_sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `counter_sale_items`
--

LOCK TABLES `counter_sale_items` WRITE;
/*!40000 ALTER TABLE `counter_sale_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `counter_sale_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-04 10:32:56
