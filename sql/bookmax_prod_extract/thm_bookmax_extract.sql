-- BookMax HotelMate production extract
-- Run while connected to the HotelMate production database.

SET @window_start := DATE_SUB(CURDATE(), INTERVAL 3 MONTH);
SET @window_end := CURDATE();
SET @source_db := DATABASE();
SET @export_db := CONCAT(@source_db, '_bookmax_export');

SET SESSION wait_timeout = 28800;
SET SESSION interactive_timeout = 28800;
SET SESSION net_read_timeout = 600;
SET SESSION net_write_timeout = 600;
SET SESSION innodb_lock_wait_timeout = 600;
SET SESSION max_execution_time = 0;

SET @sql := CONCAT('CREATE DATABASE IF NOT EXISTS `', @export_db, '`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @tbl_booking := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'booking'
  LIMIT 1
);
SET @tbl_booking_history := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'bookinghistory'
  LIMIT 1
);
SET @tbl_invoice := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'invoice'
  LIMIT 1
);
SET @tbl_invoice_line := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'invoiceline'
  LIMIT 1
);
SET @tbl_service := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'service'
  LIMIT 1
);
SET @tbl_expense := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'expense'
  LIMIT 1
);
SET @tbl_order := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'bookoneorder'
  LIMIT 1
);
SET @tbl_order_line := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'orderline'
  LIMIT 1
);
SET @tbl_payment := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'payment'
  LIMIT 1
);
SET @tbl_audit_report := (
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = 'auditreport'
  LIMIT 1
);

SET @col_booking_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_booking
    AND LOWER(REPLACE(column_name, '_', '')) = 'id'
  LIMIT 1
);
SET @col_booking_created := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_booking
    AND LOWER(REPLACE(column_name, '_', '')) = 'createddate'
  LIMIT 1
);
SET @col_booking_updated := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_booking
    AND LOWER(REPLACE(column_name, '_', '')) = 'lastmodifieddate'
  LIMIT 1
);
SET @col_booking_history_booking_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_booking_history
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingid'
  LIMIT 1
);

SET @col_invoice_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_invoice
    AND LOWER(REPLACE(column_name, '_', '')) = 'id'
  LIMIT 1
);
SET @col_invoice_booking_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_invoice
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingid'
  LIMIT 1
);
SET @col_invoice_order_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_invoice
    AND LOWER(REPLACE(column_name, '_', '')) = 'orderid'
  LIMIT 1
);

SET @col_invoice_line_booking_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_invoice_line
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingid'
  LIMIT 1
);
SET @col_invoice_line_invoice_fk := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_invoice_line
    AND LOWER(REPLACE(column_name, '_', '')) = 'invoice'
  LIMIT 1
);
SET @col_invoice_line_order_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_invoice_line
    AND LOWER(REPLACE(column_name, '_', '')) = 'orderid'
  LIMIT 1
);

SET @col_service_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_service
    AND LOWER(REPLACE(column_name, '_', '')) = 'id'
  LIMIT 1
);
SET @col_service_booking_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_service
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingid'
  LIMIT 1
);
SET @col_service_order_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_service
    AND LOWER(REPLACE(column_name, '_', '')) = 'orderid'
  LIMIT 1
);
SET @col_service_payment_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_service
    AND LOWER(REPLACE(column_name, '_', '')) = 'paymentid'
  LIMIT 1
);

SET @col_expense_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_expense
    AND LOWER(REPLACE(column_name, '_', '')) = 'id'
  LIMIT 1
);
SET @col_expense_booking_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_expense
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingid'
  LIMIT 1
);
SET @col_expense_order_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_expense
    AND LOWER(REPLACE(column_name, '_', '')) = 'orderid'
  LIMIT 1
);
SET @col_expense_payment_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_expense
    AND LOWER(REPLACE(column_name, '_', '')) = 'paymentid'
  LIMIT 1
);

SET @col_order_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_order
    AND LOWER(REPLACE(column_name, '_', '')) = 'id'
  LIMIT 1
);
SET @col_order_booking_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_order
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingid'
  LIMIT 1
);
SET @col_order_payment_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_order
    AND LOWER(REPLACE(column_name, '_', '')) = 'paymentid'
  LIMIT 1
);
SET @col_order_invoice_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_order
    AND LOWER(REPLACE(column_name, '_', '')) = 'invoiceid'
  LIMIT 1
);
SET @col_order_date := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_order
    AND LOWER(REPLACE(column_name, '_', '')) IN ('ordereddate', 'createddate', 'lastmodifieddate')
  ORDER BY FIELD(LOWER(REPLACE(column_name, '_', '')), 'ordereddate', 'createddate', 'lastmodifieddate')
  LIMIT 1
);

SET @col_order_line_order_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_order_line
    AND LOWER(REPLACE(column_name, '_', '')) = 'orderid'
  LIMIT 1
);

SET @col_payment_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_payment
    AND LOWER(REPLACE(column_name, '_', '')) = 'id'
  LIMIT 1
);
SET @col_payment_order_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_payment
    AND LOWER(REPLACE(column_name, '_', '')) = 'orderid'
  LIMIT 1
);
SET @col_payment_service_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_payment
    AND LOWER(REPLACE(column_name, '_', '')) = 'serviceid'
  LIMIT 1
);
SET @col_payment_expense_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_payment
    AND LOWER(REPLACE(column_name, '_', '')) = 'expenseid'
  LIMIT 1
);

SET @col_audit_report_booking_id := (
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = @source_db AND table_name = @tbl_audit_report
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingid'
  LIMIT 1
);

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_selected_booking_ids`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql := CONCAT('CREATE TABLE `', @export_db, '`.`_selected_booking_ids` (booking_id BIGINT PRIMARY KEY)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_selected_order_ids`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql := CONCAT('CREATE TABLE `', @export_db, '`.`_selected_order_ids` (order_id BIGINT PRIMARY KEY)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_selected_invoice_ids`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql := CONCAT('CREATE TABLE `', @export_db, '`.`_selected_invoice_ids` (invoice_id BIGINT PRIMARY KEY)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_selected_service_ids`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql := CONCAT('CREATE TABLE `', @export_db, '`.`_selected_service_ids` (service_id BIGINT PRIMARY KEY)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_selected_expense_ids`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql := CONCAT('CREATE TABLE `', @export_db, '`.`_selected_expense_ids` (expense_id BIGINT PRIMARY KEY)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_selected_payment_ids`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql := CONCAT('CREATE TABLE `', @export_db, '`.`_selected_payment_ids` (payment_id BIGINT PRIMARY KEY)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_export_counts`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql := CONCAT(
  'CREATE TABLE `', @export_db, '`.`_export_counts` (table_name VARCHAR(128) PRIMARY KEY, row_count BIGINT NOT NULL)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DROP PROCEDURE IF EXISTS bookmax_thm_copy_table;
DROP PROCEDURE IF EXISTS bookmax_thm_copy_table_if_present;
DROP PROCEDURE IF EXISTS bookmax_thm_copy_masters;

DELIMITER $$

CREATE PROCEDURE bookmax_thm_copy_table(
  IN p_export_db VARCHAR(128),
  IN p_source_db VARCHAR(128),
  IN p_source_table VARCHAR(128),
  IN p_where_clause LONGTEXT
)
BEGIN
  SET @drop_sql = CONCAT('DROP TABLE IF EXISTS `', p_export_db, '`.`', p_source_table, '`');
  PREPARE stmt FROM @drop_sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;

  SET @create_sql = CONCAT(
    'CREATE TABLE `', p_export_db, '`.`', p_source_table, '` AS ',
    'SELECT * FROM `', p_source_db, '`.`', p_source_table, '` WHERE 1 = 0'
  );
  PREPARE stmt FROM @create_sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;

  SET @insert_sql = CONCAT(
    'INSERT INTO `', p_export_db, '`.`', p_source_table, '` ',
    'SELECT * FROM `', p_source_db, '`.`', p_source_table, '` WHERE ', p_where_clause
  );
  PREPARE stmt FROM @insert_sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;

  SET @count_sql = CONCAT(
    'REPLACE INTO `', p_export_db, '`.`_export_counts` (table_name, row_count) ',
    'SELECT ''', p_source_table, ''', COUNT(*) FROM `', p_export_db, '`.`', p_source_table, '`'
  );
  PREPARE stmt FROM @count_sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END$$

CREATE PROCEDURE bookmax_thm_copy_table_if_present(
  IN p_export_db VARCHAR(128),
  IN p_source_db VARCHAR(128),
  IN p_table_key VARCHAR(128)
)
BEGIN
  DECLARE v_table VARCHAR(128);

  SELECT table_name
  INTO v_table
  FROM information_schema.tables
  WHERE table_schema = p_source_db
    AND table_type = 'BASE TABLE'
    AND LOWER(REPLACE(table_name, '_', '')) = LOWER(REPLACE(p_table_key, '_', ''))
  LIMIT 1;

  IF v_table IS NOT NULL THEN
    SET @drop_sql = CONCAT('DROP TABLE IF EXISTS `', p_export_db, '`.`', v_table, '`');
    PREPARE stmt FROM @drop_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SET @copy_sql = CONCAT(
      'CREATE TABLE `', p_export_db, '`.`', v_table, '` AS ',
      'SELECT * FROM `', p_source_db, '`.`', v_table, '`'
    );
    PREPARE stmt FROM @copy_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SET @count_sql = CONCAT(
      'REPLACE INTO `', p_export_db, '`.`_export_counts` (table_name, row_count) ',
      'SELECT ''', v_table, ''', COUNT(*) FROM `', p_export_db, '`.`', v_table, '`'
    );
    PREPARE stmt FROM @count_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$

CREATE PROCEDURE bookmax_thm_copy_masters(
  IN p_export_db VARCHAR(128),
  IN p_source_db VARCHAR(128)
)
BEGIN
  /*
    Explicit property-side master graph based on the THM domain model:
    Organisation -> Property -> Room / Subscription / Branch / Supplier
    Property -> BusinessService -> BusinessServiceType
    BusinessService -> ProductGroup -> Product
    ApplicationUser -> users_roles -> Role
    BusinessTypeList / BusinessServiceTypeList are global setup masters for service configuration.
  */
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'Organisation');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'Role');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'users_roles');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'ApplicationUser');

  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'Property');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'Room');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'Amenity');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'PropertySubscription');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'Branch');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'Supplier');

  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'BusinessTypeList');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'BusinessServiceTypeList');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'BusinessService');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'BusinessServiceType');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'ProductGroup');
  CALL bookmax_thm_copy_table_if_present(p_export_db, p_source_db, 'Product');
END$$

DELIMITER ;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_booking_ids` (booking_id) ',
  'SELECT DISTINCT `', @col_booking_id, '` FROM `', @source_db, '`.`', @tbl_booking, '` ',
  'WHERE (',
  '(`', @col_booking_created, '` IS NOT NULL AND `', @col_booking_created, '` >= @window_start AND `', @col_booking_created, '` < DATE_ADD(@window_end, INTERVAL 1 DAY)) ',
  'OR (`', @col_booking_updated, '` IS NOT NULL AND `', @col_booking_updated, '` >= @window_start AND `', @col_booking_updated, '` < DATE_ADD(@window_end, INTERVAL 1 DAY))',
  ')'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_order_ids` (order_id) ',
  'SELECT DISTINCT `', @col_order_id, '` ',
  'FROM `', @source_db, '`.`', @tbl_order, '` ',
  'WHERE `', @col_order_booking_id, '` IN (SELECT booking_id FROM `', @export_db, '`.`_selected_booking_ids`) ',
  '   OR (`', @col_order_date, '` IS NOT NULL AND `', @col_order_date, '` >= @window_start AND `', @col_order_date, '` < DATE_ADD(@window_end, INTERVAL 1 DAY) ',
  '       AND `', @col_order_booking_id, '` IS NOT NULL)'
  ,
  ')'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_invoice_ids` (invoice_id) ',
  'SELECT DISTINCT `', @col_invoice_id, '` ',
  'FROM `', @source_db, '`.`', @tbl_invoice, '` ',
  'WHERE `', @col_invoice_booking_id, '` IN (SELECT booking_id FROM `', @export_db, '`.`_selected_booking_ids`) ',
  '   OR `', @col_invoice_order_id, '` IN (SELECT order_id FROM `', @export_db, '`.`_selected_order_ids`)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_service_ids` (service_id) ',
  'SELECT DISTINCT `', @col_service_id, '` ',
  'FROM `', @source_db, '`.`', @tbl_service, '` ',
  'WHERE `', @col_service_booking_id, '` IN (SELECT booking_id FROM `', @export_db, '`.`_selected_booking_ids`)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_expense_ids` (expense_id) ',
  'SELECT DISTINCT `', @col_expense_id, '` ',
  'FROM `', @source_db, '`.`', @tbl_expense, '` ',
  'WHERE `', @col_expense_booking_id, '` IN (SELECT booking_id FROM `', @export_db, '`.`_selected_booking_ids`) ',
  '   OR `', @col_expense_order_id, '` IN (SELECT order_id FROM `', @export_db, '`.`_selected_order_ids`)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_payment_ids` (payment_id) ',
  'SELECT DISTINCT `', @col_payment_id, '` ',
  'FROM `', @source_db, '`.`', @tbl_payment, '` ',
  'WHERE `', @col_payment_order_id, '` IN (SELECT order_id FROM `', @export_db, '`.`_selected_order_ids`) ',
  '   OR `', @col_payment_service_id, '` IN (SELECT service_id FROM `', @export_db, '`.`_selected_service_ids`) ',
  '   OR `', @col_payment_expense_id, '` IN (SELECT expense_id FROM `', @export_db, '`.`_selected_expense_ids`)'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CALL bookmax_thm_copy_masters(@export_db, @source_db);

SET @copy_booking_filter := CONCAT(
  '`', @col_booking_id, '` IN (SELECT booking_id FROM `', @export_db, '`.`_selected_booking_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_booking, @copy_booking_filter);

SET @copy_booking_history_filter := CONCAT(
  '`', @col_booking_history_booking_id, '` IN (SELECT booking_id FROM `', @export_db, '`.`_selected_booking_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_booking_history, @copy_booking_history_filter);

SET @copy_order_filter := CONCAT(
  '`', @col_order_id, '` IN (SELECT order_id FROM `', @export_db, '`.`_selected_order_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_order, @copy_order_filter);

SET @copy_order_line_filter := CONCAT(
  '`', @col_order_line_order_id, '` IN (SELECT order_id FROM `', @export_db, '`.`_selected_order_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_order_line, @copy_order_line_filter);

SET @copy_service_filter := CONCAT(
  '`', @col_service_id, '` IN (SELECT service_id FROM `', @export_db, '`.`_selected_service_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_service, @copy_service_filter);

SET @copy_expense_filter := CONCAT(
  '`', @col_expense_id, '` IN (SELECT expense_id FROM `', @export_db, '`.`_selected_expense_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_expense, @copy_expense_filter);

SET @copy_payment_filter := CONCAT(
  '`', @col_payment_id, '` IN (SELECT payment_id FROM `', @export_db, '`.`_selected_payment_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_payment, @copy_payment_filter);

SET @copy_invoice_filter := CONCAT(
  '`', @col_invoice_id, '` IN (SELECT invoice_id FROM `', @export_db, '`.`_selected_invoice_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_invoice, @copy_invoice_filter);

SET @copy_invoice_line_filter := CONCAT(
  '`', @col_invoice_line_booking_id, '` IN (SELECT booking_id FROM `', @export_db, '`.`_selected_booking_ids`) ',
  'OR `', @col_invoice_line_invoice_fk, '` IN (SELECT invoice_id FROM `', @export_db, '`.`_selected_invoice_ids`) ',
  'OR `', @col_invoice_line_order_id, '` IN (SELECT order_id FROM `', @export_db, '`.`_selected_order_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_invoice_line, @copy_invoice_line_filter);

SET @copy_audit_report_filter := CONCAT(
  '`', @col_audit_report_booking_id, '` IN (SELECT booking_id FROM `', @export_db, '`.`_selected_booking_ids`)'
);
CALL bookmax_thm_copy_table(@export_db, @source_db, @tbl_audit_report, @copy_audit_report_filter);

SET @sql := CONCAT('SELECT * FROM `', @export_db, '`.`_export_counts` ORDER BY table_name');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DROP PROCEDURE IF EXISTS bookmax_thm_copy_table;
DROP PROCEDURE IF EXISTS bookmax_thm_copy_table_if_present;
DROP PROCEDURE IF EXISTS bookmax_thm_copy_masters;
