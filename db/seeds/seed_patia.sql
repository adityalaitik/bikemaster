-- ============================================================
-- BikeMasters — Patia Branch seed data
-- Garage ID : 33333333-3333-3333-3333-000000000001
-- Garage code: PTI-003
-- Run after seed_data.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS=0;

-- ── Garage ────────────────────────────────────────────────────
INSERT IGNORE INTO `garages`
  (`id`,`organization_id`,`name`,`code`,`address`,`city`,`state`,`pincode`,`phone`,`email`,`gstin`,`logo_url`,`is_active`,`created_at`,`updated_at`)
VALUES
  ('33333333-3333-3333-3333-000000000001',
   '8843e4fb-63d2-4376-976b-ab9b61c65eec',
   'Patia Branch','PTI-003',
   'Plot No. 42, Patia Main Road',
   'Bhubaneswar','Odisha','751024',
   '+91 674 987654','ptia@bikemasters.in',
   '21CCCCC0000A1Z2',NULL,1,
   '2026-06-01 05:00:00','2026-06-01 05:00:00');

-- ── Designations ──────────────────────────────────────────────
INSERT IGNORE INTO `designations` (`id`,`garage_id`,`name`,`created_at`) VALUES
  ('ptia-desig-001','33333333-3333-3333-3333-000000000001','Senior Technician','2026-06-01 05:00:00'),
  ('ptia-desig-002','33333333-3333-3333-3333-000000000001','Service Advisor','2026-06-01 05:00:00');

-- ── Users ─────────────────────────────────────────────────────
INSERT IGNORE INTO `users`
  (`id`,`organization_id`,`email`,`phone`,`password_hash`,`first_name`,`last_name`,`avatar_url`,`role`,`is_active`,`last_login_at`,`created_at`,`updated_at`)
VALUES
  ('ptia-user-00001','8843e4fb-63d2-4376-976b-ab9b61c65eec',
   'manager.ptia@bikemasters.in','+91 88888 11111',
   '$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y',
   'Deepak','Mohanty',NULL,'garage_manager',1,NULL,
   '2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-user-00002','8843e4fb-63d2-4376-976b-ab9b61c65eec',
   'advisor.ptia@bikemasters.in','+91 88888 22222',
   '$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y',
   'Sneha','Pattnaik',NULL,'service_advisor',1,NULL,
   '2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-user-00003','8843e4fb-63d2-4376-976b-ab9b61c65eec',
   'tech.ptia@bikemasters.in','+91 88888 33333',
   '$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y',
   'Bikash','Nayak',NULL,'technician',1,NULL,
   '2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-user-00004','8843e4fb-63d2-4376-976b-ab9b61c65eec',
   'cashier.ptia@bikemasters.in','+91 88888 44444',
   '$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y',
   'Kavita','Rath',NULL,'cashier',1,NULL,
   '2026-06-01 05:00:00','2026-06-01 05:00:00');

-- ── user_garage_assignments ────────────────────────────────────
INSERT IGNORE INTO `user_garage_assignments` (`id`,`user_id`,`garage_id`,`is_primary`,`created_at`) VALUES
  ('ptia-uga-000001','ptia-user-00001','33333333-3333-3333-3333-000000000001',1,'2026-06-01 05:00:00'),
  ('ptia-uga-000002','ptia-user-00002','33333333-3333-3333-3333-000000000001',1,'2026-06-01 05:00:00'),
  ('ptia-uga-000003','ptia-user-00003','33333333-3333-3333-3333-000000000001',1,'2026-06-01 05:00:00'),
  ('ptia-uga-000004','ptia-user-00004','33333333-3333-3333-3333-000000000001',1,'2026-06-01 05:00:00'),
  -- super_admin (Aditya) also gets non-primary Patia access
  ('ptia-uga-admin01','33333333-3333-3333-3333-333333333333','33333333-3333-3333-3333-000000000001',0,'2026-06-01 05:00:00');

-- ── Employees ─────────────────────────────────────────────────
INSERT IGNORE INTO `employees`
  (`id`,`user_id`,`garage_id`,`designation_id`,`employee_code`,`name`,`phone`,`email`,`type`,`is_active`,`created_at`,`updated_at`)
VALUES
  ('ptia-emp-000001','ptia-user-00001','33333333-3333-3333-3333-000000000001','ptia-desig-002',
   'EMP-PTI-001','Deepak Mohanty','+91 88888 11111',NULL,'service_advisor',1,
   '2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-emp-000002','ptia-user-00003','33333333-3333-3333-3333-000000000001','ptia-desig-001',
   'EMP-PTI-102','Bikash Nayak','+91 88888 33333',NULL,'technician',1,
   '2026-06-01 05:00:00','2026-06-01 05:00:00');

-- ── customer_sources ──────────────────────────────────────────
INSERT IGNORE INTO `customer_sources` (`id`,`garage_id`,`name`,`company_name`,`is_active`) VALUES
  ('ptia-src-00001','33333333-3333-3333-3333-000000000001','Walk-in',NULL,1),
  ('ptia-src-00002','33333333-3333-3333-3333-000000000001','Online Booking',NULL,1),
  ('ptia-src-00003','33333333-3333-3333-3333-000000000001','Referral',NULL,1);

-- ── spare_parts ───────────────────────────────────────────────
INSERT IGNORE INTO `spare_parts`
  (`id`,`garage_id`,`part_name`,`part_number`,`brand_id`,`compatible_brand`,`compatible_model`,`compatible_variant`,`part_brand`,`bin_location`,`hsn_code`,`unit`,`tax_category_id`,`reorder_level`,`is_active`,`created_at`,`updated_at`)
VALUES
  ('ptia-sp-00001','33333333-3333-3333-3333-000000000001','Engine Oil Premium 10W30 (800ml)','SP-PTI-OIL01',NULL,'Honda','Activa 6G','Standard','OEM','Rack A1','27101971','BTL',NULL,10,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00002','33333333-3333-3333-3333-000000000001','Spark Plug Champion NGK','SP-PTI-PLG01',NULL,'Universal','All Models','N/A','NGK','Rack B2','85111000','PCS',NULL,20,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00003','33333333-3333-3333-3333-000000000001','Air Filter Element','SP-PTI-AIR01',NULL,'Universal','All Models','N/A','OEM','Storage','84212300','PCS',NULL,15,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00004','33333333-3333-3333-3333-000000000001','Rear Brake Shoe Assembly','SP-PTI-BRK01',NULL,'Universal','All Models','N/A','OEM','Storage','87083000','SET',NULL,8,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00005','33333333-3333-3333-3333-000000000001','Chain Sprocket Kit','SP-PTI-CHN01',NULL,'Universal','All Models','N/A','OEM','Storage','73151100','SET',NULL,5,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00006','33333333-3333-3333-3333-000000000001','Clutch Cable Assembly','SP-PTI-CCB01',NULL,'Universal','All Models','N/A','OEM','Storage','87089900','PCS',NULL,10,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00007','33333333-3333-3333-3333-000000000001','Engine Flush Fluid Premium','SP-PTI-FLU01',NULL,'Universal','All Models','N/A','OEM','Storage','38119000','BTL',NULL,15,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00008','33333333-3333-3333-3333-000000000001','Fork Oil 10W (500ml)','SP-PTI-FRK01',NULL,'Universal','All Models','N/A','OEM','Storage','27101971','BTL',NULL,5,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00009','33333333-3333-3333-3333-000000000001','Throttle Cable Standard','SP-PTI-THR01',NULL,'Universal','All Models','N/A','OEM','Storage','87089900','PCS',NULL,8,1,'2026-06-01 05:00:00','2026-06-01 05:00:00'),
  ('ptia-sp-00010','33333333-3333-3333-3333-000000000001','Battery 12V 7Ah','SP-PTI-BAT01',NULL,'Universal','All Models','N/A','Amara Raja','Storage','85072000','PCS',NULL,5,1,'2026-06-01 05:00:00','2026-06-01 05:00:00');

-- ── inventory_batches ─────────────────────────────────────────
INSERT IGNORE INTO `inventory_batches`
  (`id`,`spare_part_id`,`garage_id`,`batch_no`,`purchase_price`,`mrp`,`selling_price`,`quantity`,`available_qty`,`vendor_id`,`purchase_date`,`created_at`)
VALUES
  ('ptia-bat-00001','ptia-sp-00001','33333333-3333-3333-3333-000000000001','BATCH-PTI-001',360.00,520.00,450.00,80,80,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00002','ptia-sp-00002','33333333-3333-3333-3333-000000000001','BATCH-PTI-002', 95.00,150.00,120.00,60,60,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00003','ptia-sp-00003','33333333-3333-3333-3333-000000000001','BATCH-PTI-003',130.00,220.00,180.00,50,50,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00004','ptia-sp-00004','33333333-3333-3333-3333-000000000001','BATCH-PTI-004',200.00,360.00,280.00,30,30,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00005','ptia-sp-00005','33333333-3333-3333-3333-000000000001','BATCH-PTI-005',420.00,650.00,520.00,20,20,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00006','ptia-sp-00006','33333333-3333-3333-3333-000000000001','BATCH-PTI-006',160.00,280.00,220.00,40,40,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00007','ptia-sp-00007','33333333-3333-3333-3333-000000000001','BATCH-PTI-007',120.00,200.00,150.00,45,45,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00008','ptia-sp-00008','33333333-3333-3333-3333-000000000001','BATCH-PTI-008',180.00,300.00,240.00,25,25,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00009','ptia-sp-00009','33333333-3333-3333-3333-000000000001','BATCH-PTI-009', 90.00,160.00,130.00,35,35,NULL,'2026-06-01','2026-06-01 05:00:00'),
  ('ptia-bat-00010','ptia-sp-00010','33333333-3333-3333-3333-000000000001','BATCH-PTI-010',480.00,750.00,600.00,15,15,NULL,'2026-06-01','2026-06-01 05:00:00');

-- ── services ──────────────────────────────────────────────────
INSERT IGNORE INTO `services`
  (`id`,`garage_id`,`service_name`,`service_code`,`category`,`hsn_sac_code`,`default_rate`,`tax_category_id`,`is_active`,`created_at`)
VALUES
  ('svc-ptia-00001','33333333-3333-3333-3333-000000000001','General Service Standard Labor','SRV-PTI-GEN','Mechanical Services','998714',650.00,NULL,1,'2026-06-01 05:00:00'),
  ('svc-ptia-00002','33333333-3333-3333-3333-000000000001','Express Washing & Polishing Bundle','SRV-PTI-WSH','Mechanical Services','998714',400.00,NULL,1,'2026-06-01 05:00:00'),
  ('svc-ptia-00003','33333333-3333-3333-3333-000000000001','Engine Oil Change Labor','SRV-PTI-OIL','Mechanical Services','998714',150.00,NULL,1,'2026-06-01 05:00:00'),
  ('svc-ptia-00004','33333333-3333-3333-3333-000000000001','Brake Adjustment and Bleeding','SRV-PTI-BRK','Mechanical Services','998714',300.00,NULL,1,'2026-06-01 05:00:00'),
  ('svc-ptia-00005','33333333-3333-3333-3333-000000000001','Chain Lubrication and Adjustment','SRV-PTI-CHN','Mechanical Services','998714',200.00,NULL,1,'2026-06-01 05:00:00'),
  ('svc-ptia-00006','33333333-3333-3333-3333-000000000001','Spark Plug Replacement Labor','SRV-PTI-PLG','Mechanical Services','998714',120.00,NULL,1,'2026-06-01 05:00:00'),
  ('svc-ptia-00007','33333333-3333-3333-3333-000000000001','Air Filter Cleaning/Replacement Labor','SRV-PTI-AIR','Mechanical Services','998714',180.00,NULL,1,'2026-06-01 05:00:00'),
  ('svc-ptia-00008','33333333-3333-3333-3333-000000000001','Fork Alignment and Straightening','SRV-PTI-FRK','Mechanical Services','998714',600.00,NULL,1,'2026-06-01 05:00:00');

-- ── packages ──────────────────────────────────────────────────
INSERT IGNORE INTO `packages`
  (`id`,`garage_id`,`package_name`,`description`,`total_price`,`validity_days`,`is_active`,`created_at`)
VALUES
  ('pkg-ptia-00001','33333333-3333-3333-3333-000000000001','Premium Annual Tune-up','Complete annual service with oil, spark plug and wash',1250.00,30,1,'2026-06-01 05:00:00'),
  ('pkg-ptia-00002','33333333-3333-3333-3333-000000000001','Express Monsoon Service','Quick service with brake check and wash',850.00,7,1,'2026-06-01 05:00:00');

-- ── package_items ─────────────────────────────────────────────
INSERT IGNORE INTO `package_items`
  (`id`,`package_id`,`item_type`,`spare_part_id`,`service_id`,`quantity`,`rate`)
VALUES
  ('pki-ptia-001','pkg-ptia-00001','spare','ptia-sp-00001',NULL,1.000,450.00),
  ('pki-ptia-002','pkg-ptia-00001','spare','ptia-sp-00002',NULL,1.000,120.00),
  ('pki-ptia-003','pkg-ptia-00001','service',NULL,'svc-ptia-00001',1.000,650.00),
  ('pki-ptia-004','pkg-ptia-00001','service',NULL,'svc-ptia-00002',1.000,400.00),
  ('pki-ptia-005','pkg-ptia-00002','service',NULL,'svc-ptia-00002',1.000,400.00),
  ('pki-ptia-006','pkg-ptia-00002','service',NULL,'svc-ptia-00004',1.000,300.00),
  ('pki-ptia-007','pkg-ptia-00002','spare','ptia-sp-00007',NULL,1.000,150.00);

-- ── offers ────────────────────────────────────────────────────
INSERT IGNORE INTO `offers`
  (`id`,`garage_id`,`title`,`description`,`offer_type`,`discount_value`,`applicable_to`,`start_date`,`end_date`,`is_active`,`created_at`)
VALUES
  ('off-ptia-001','33333333-3333-3333-3333-000000000001',
   'Patia Grand Opening Discount','20% off on all labor for first 3 months',
   'percentage',20.00,'all','2026-06-01','2026-08-31',1,'2026-06-01 05:00:00'),
  ('off-ptia-002','33333333-3333-3333-3333-000000000001',
   'Loyal Rider Benefit','Flat Rs.100 off for repeat customers (3rd+ visit)',
   'fixed',100.00,'all','2026-06-01','2026-12-31',1,'2026-06-01 05:00:00'),
  ('off-ptia-003','33333333-3333-3333-3333-000000000001',
   'Free Engine Flush Combo','Free Engine Flush Fluid with any major service',
   'free_part',150.00,'all','2026-06-01','2026-12-31',1,'2026-06-01 05:00:00');

SET FOREIGN_KEY_CHECKS=1;
