-- BookMax LMS production extract
-- Run while connected to the LMS production database.

SET @window_start := DATE_SUB(CURDATE(), INTERVAL 3 MONTH);
SET @window_end := CURDATE();
SET @source_db := DATABASE();
SET @export_db := CONCAT(@source_db, '_bookmax_export');

SET @norm_accommodation_enquiry := 'accommodationenquiry';
SET @norm_accommodation_enquiry_tracker := 'accommodationenquirytracker';
SET @norm_property_enquiry := 'propertyenquiry';

SET @sql := CONCAT('CREATE DATABASE IF NOT EXISTS `', @export_db, '`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @tbl_accommodation_enquiry := (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = @norm_accommodation_enquiry
  LIMIT 1
);

SET @tbl_accommodation_enquiry_tracker := (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = @norm_accommodation_enquiry_tracker
  LIMIT 1
);

SET @tbl_property_enquiry := (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = @source_db
    AND LOWER(REPLACE(table_name, '_', '')) = @norm_property_enquiry
  LIMIT 1
);

SET @col_enquiry_id := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'enquiryid'
  LIMIT 1
);

SET @col_group_enquiry_id := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'groupenquiryid'
  LIMIT 1
);

SET @col_booking_id := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingid'
  LIMIT 1
);

SET @col_booking_reservation_id := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'bookingreservationid'
  LIMIT 1
);

SET @col_ae_created := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'createddate'
  LIMIT 1
);

SET @col_ae_updated := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'updateddate'
  LIMIT 1
);

SET @col_tracker_enquiry_id := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry_tracker
    AND LOWER(REPLACE(column_name, '_', '')) = 'enquiryid'
  LIMIT 1
);

SET @col_tracker_created := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry_tracker
    AND LOWER(REPLACE(column_name, '_', '')) = 'createddate'
  LIMIT 1
);

SET @col_tracker_updated := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_accommodation_enquiry_tracker
    AND LOWER(REPLACE(column_name, '_', '')) = 'updateddate'
  LIMIT 1
);

SET @col_property_enquiry_fk := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_property_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'enquiryid'
  LIMIT 1
);

SET @col_property_enquiry_date := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_property_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) IN ('dateofenquiry', 'createddate', 'createddate')
  ORDER BY FIELD(LOWER(REPLACE(column_name, '_', '')), 'dateofenquiry', 'createddate')
  LIMIT 1
);

SET @col_property_enquiry_created := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_property_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'createddate'
  LIMIT 1
);

SET @col_property_enquiry_updated := (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = @source_db
    AND table_name = @tbl_property_enquiry
    AND LOWER(REPLACE(column_name, '_', '')) = 'lastmodifieddate'
  LIMIT 1
);

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_selected_enquiry_ids`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT('CREATE TABLE `', @export_db, '`.`_selected_enquiry_ids` (enquiry_id BIGINT PRIMARY KEY)');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT('DROP TABLE IF EXISTS `', @export_db, '`.`_export_counts`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT(
  'CREATE TABLE `', @export_db, '`.`_export_counts` (',
  'table_name VARCHAR(128) PRIMARY KEY, ',
  'row_count BIGINT NOT NULL)',
  ''
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DROP PROCEDURE IF EXISTS bookmax_lms_copy_table;
DROP PROCEDURE IF EXISTS bookmax_lms_copy_masters;

DELIMITER $$

CREATE PROCEDURE bookmax_lms_copy_table(
  IN p_export_db VARCHAR(128),
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
    'SELECT * FROM `', DATABASE(), '`.`', p_source_table, '` WHERE 1 = 0'
  );
  PREPARE stmt FROM @create_sql;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;

  SET @insert_sql = CONCAT(
    'INSERT INTO `', p_export_db, '`.`', p_source_table, '` ',
    'SELECT * FROM `', DATABASE(), '`.`', p_source_table, '` WHERE ', p_where_clause
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

CREATE PROCEDURE bookmax_lms_copy_masters(IN p_export_db VARCHAR(128))
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE v_table VARCHAR(128);

  DECLARE cur CURSOR FOR
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_type = 'BASE TABLE'
      AND LOWER(REPLACE(table_name, '_', '')) NOT IN (
        'accommodationenquiry',
        'accommodationenquirytracker',
        'propertyenquiry'
      );

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;

  read_loop: LOOP
    FETCH cur INTO v_table;
    IF done THEN
      LEAVE read_loop;
    END IF;

    SET @drop_sql = CONCAT('DROP TABLE IF EXISTS `', p_export_db, '`.`', v_table, '`');
    PREPARE stmt FROM @drop_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SET @copy_sql = CONCAT(
      'CREATE TABLE `', p_export_db, '`.`', v_table, '` AS ',
      'SELECT * FROM `', DATABASE(), '`.`', v_table, '`'
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
  END LOOP;

  CLOSE cur;
END$$

DELIMITER ;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_enquiry_ids` (enquiry_id) ',
  'SELECT DISTINCT `', @col_enquiry_id, '` ',
  'FROM `', @source_db, '`.`', @tbl_accommodation_enquiry, '` ',
  'WHERE (',
  '(`', @col_ae_created, '` IS NOT NULL AND `', @col_ae_created, '` >= @window_start AND `', @col_ae_created, '` < DATE_ADD(@window_end, INTERVAL 1 DAY)) ',
  'OR (`', @col_ae_updated, '` IS NOT NULL AND `', @col_ae_updated, '` >= @window_start AND `', @col_ae_updated, '` < DATE_ADD(@window_end, INTERVAL 1 DAY))',
  ')'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_enquiry_ids` (enquiry_id) ',
  'SELECT DISTINCT sibling.`', @col_enquiry_id, '` ',
  'FROM `', @source_db, '`.`', @tbl_accommodation_enquiry, '` seed ',
  'JOIN `', @source_db, '`.`', @tbl_accommodation_enquiry, '` sibling ',
  '  ON sibling.`', @col_group_enquiry_id, '` = seed.`', @col_group_enquiry_id, '` ',
  'WHERE seed.`', @col_enquiry_id, '` IN (SELECT enquiry_id FROM `', @export_db, '`.`_selected_enquiry_ids`) ',
  '  AND seed.`', @col_group_enquiry_id, '` IS NOT NULL'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_enquiry_ids` (enquiry_id) ',
  'SELECT DISTINCT `', @col_tracker_enquiry_id, '` ',
  'FROM `', @source_db, '`.`', @tbl_accommodation_enquiry_tracker, '` ',
  'WHERE (',
  '(`', @col_tracker_created, '` IS NOT NULL AND `', @col_tracker_created, '` >= @window_start AND `', @col_tracker_created, '` < DATE_ADD(@window_end, INTERVAL 1 DAY)) ',
  'OR (`', @col_tracker_updated, '` IS NOT NULL AND `', @col_tracker_updated, '` >= @window_start AND `', @col_tracker_updated, '` < DATE_ADD(@window_end, INTERVAL 1 DAY))',
  ')'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @property_enquiry_filter := CONCAT(
  '(',
  IF(
    @col_property_enquiry_date IS NOT NULL,
    CONCAT(
      '`', @col_property_enquiry_date, '` IS NOT NULL AND `', @col_property_enquiry_date,
      '` >= @window_start AND `', @col_property_enquiry_date, '` < DATE_ADD(@window_end, INTERVAL 1 DAY)'
    ),
    '1 = 0'
  ),
  IF(
    @col_property_enquiry_created IS NOT NULL
    AND (@col_property_enquiry_date IS NULL OR @col_property_enquiry_created <> @col_property_enquiry_date),
    CONCAT(
      ' OR (`', @col_property_enquiry_created, '` IS NOT NULL AND `', @col_property_enquiry_created,
      '` >= @window_start AND `', @col_property_enquiry_created, '` < DATE_ADD(@window_end, INTERVAL 1 DAY))'
    ),
    ''
  ),
  IF(
    @col_property_enquiry_updated IS NOT NULL,
    CONCAT(
      ' OR (`', @col_property_enquiry_updated, '` IS NOT NULL AND `', @col_property_enquiry_updated,
      '` >= @window_start AND `', @col_property_enquiry_updated, '` < DATE_ADD(@window_end, INTERVAL 1 DAY))'
    ),
    ''
  ),
  ')'
);

SET @sql := CONCAT(
  'INSERT IGNORE INTO `', @export_db, '`.`_selected_enquiry_ids` (enquiry_id) ',
  'SELECT DISTINCT `', @col_property_enquiry_fk, '` ',
  'FROM `', @source_db, '`.`', @tbl_property_enquiry, '` ',
  'WHERE ', @property_enquiry_filter
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CALL bookmax_lms_copy_masters(@export_db);

SET @copy_ae_filter := CONCAT(
  '`', @col_enquiry_id, '` IN (SELECT enquiry_id FROM `', @export_db, '`.`_selected_enquiry_ids`)'
);
CALL bookmax_lms_copy_table(@export_db, @tbl_accommodation_enquiry, @copy_ae_filter);

SET @copy_tracker_filter := CONCAT(
  '`', @col_tracker_enquiry_id, '` IN (SELECT enquiry_id FROM `', @export_db, '`.`_selected_enquiry_ids`)'
);
CALL bookmax_lms_copy_table(@export_db, @tbl_accommodation_enquiry_tracker, @copy_tracker_filter);

SET @copy_property_enquiry_filter := CONCAT(
  '`', @col_property_enquiry_fk, '` IN (SELECT enquiry_id FROM `', @export_db, '`.`_selected_enquiry_ids`)'
);
CALL bookmax_lms_copy_table(@export_db, @tbl_property_enquiry, @copy_property_enquiry_filter);

SET @sql := CONCAT('SELECT * FROM `', @export_db, '`.`_export_counts` ORDER BY table_name');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DROP PROCEDURE IF EXISTS bookmax_lms_copy_table;
DROP PROCEDURE IF EXISTS bookmax_lms_copy_masters;
