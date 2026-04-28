# BookMax Production Extract SQL

These scripts prepare an export schema inside each production MySQL database.

They do not use `mysqldump`. Instead they:

- copy the required master/reference tables as full data
- copy only the last 3 months of booking/enquiry-centric transactional data
- preserve referential integrity by expanding from parent ids to linked child rows

## Files

- `lms_bookmax_extract.sql`
- `thm_bookmax_extract.sql`

## What the scripts create

Each script creates a sibling export schema:

- LMS: `<source_db>_bookmax_export`
- HotelMate: `<source_db>_bookmax_export`

That export schema contains:

- full master/reference tables
- filtered transactional tables
- helper id tables prefixed with `_selected_`
- `_export_counts` with row counts for verification

## THM master coverage

The HotelMate extract no longer relies on a broad "copy everything except transactions" rule.
It explicitly exports the property-side graph that BookMax depends on:

- `Organisation`
- `Role`
- `users_roles`
- `ApplicationUser`
- `Property`
- `Room`
- `Amenity`
- `PropertySubscription`
- `Branch`
- `Supplier`
- `BusinessTypeList`
- `BusinessServiceTypeList`
- `BusinessService`
- `BusinessServiceType`
- `ProductGroup`
- `Product`

That explicit list comes from the THM JPA model:

- `Property -> Room / PropertySubscription / Branch / Supplier`
- `Property -> BusinessService -> BusinessServiceType`
- `BusinessService -> ProductGroup -> Product`
- `ApplicationUser -> users_roles -> Role`

Heavy operational tables are not full-copied as masters:

- `RatesAndAvailability` is excluded from this extract.

This is intentional because `RatesAndAvailability` is date-grained operational inventory and was too heavy for a safe online production export.

If production has additional property-side tables that BookMax needs, add them explicitly to `bookmax_thm_copy_masters()` rather than relying on implicit full-schema copying.

## Run order

1. Connect to LMS production DB and run `lms_bookmax_extract.sql`
2. Connect to HotelMate production DB and run `thm_bookmax_extract.sql`
3. Dump the generated export schemas with your preferred DB export tool
4. Restore those export schemas into local DBs or map them into local target DB names

## Assumptions

- MySQL 5.x compatible syntax
- current database is the source database when the script runs
- the executing DB user can:
  - create schemas
  - create/drop tables
  - create/drop procedures
  - read `information_schema`

## Window

By default the scripts use:

- `window_start = CURDATE() - INTERVAL 3 MONTH`
- `window_end = CURDATE()`

You can change the two `SET @window_*` lines before running.
