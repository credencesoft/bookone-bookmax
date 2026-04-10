# BookOne Cross-Project Field Mapping

Last updated: 2026-04-10

## Purpose

This document is the centralized model reference for end-to-end field ownership and field-label mapping across the active booking stack.

Use it to answer two questions quickly:

- where a field originates and which service owns it
- how the same business concept is represented as it moves through UI, LMS, payment adapters, THM, notifications, and downstream integrations

This should remain the cross-project source of truth for mapping awareness. Repo-local DTO comments and API docs can still exist, but this file should be the place used during design and change review.

## Why This Lives In `bookone-bookmax`

This mapping is not owned by a single backend service.

`bookone-bookmax` is the correct home for the master mapping because it already contains the maintained cross-repo checkout flow and refactor plan, and it is the entry point where most end-to-end change analysis starts.

Recommended rule:

- keep the master end-to-end mapping here
- keep implementation-specific DTO/entity details inside each owning repo
- update both when a business field contract changes

## Active System Chain

Primary chain for hotel booking flow:

1. `UI` - `bookone-bookmax`
2. `Enquiry API` - `java-lms`
3. `Booking Orchestrator` - `java-the-hotel-mate`
4. `Payment Adapter` - `java-razorpay` or `java-api-payu`
5. `Channel / PMS Push` - `channel-integration`
6. `Notification API` - `api-java-notify-service`
7. `Alternate / Legacy Email-Web Booking Stack` - `booking-java-api`
8. `Core / shared business concept references` - document explicitly when `bookone-core` or another shared model is introduced into the active flow

## Mapping Model

For each business field, capture these columns.

| Field Label | Business Meaning | Source Of Truth | UI Field / State | LMS Field | THM Field | Razorpay / PayU Field | Channel Field | Notification Field | Legacy / Alternate Field | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Example: `paymentGateway` | Which gateway handled payment capture | THM callback normalization | `paymentGateway` | enquiry metadata or status payload | `paymentGateway` | adapter-specific callback mapped into THM request | n/a | optional display only | optional | Keep distinct from `paymentMode` |

## Current Hotel Flow Mapping

The table below reflects the latest implemented changes across UI, LMS, and THM for the active hotel booking flow.

| Field Label | Business Meaning | Source Of Truth | UI Field / State | LMS Field | THM Field | Razorpay / PayU Field | Channel Field | Notification Field | Legacy / Alternate Field | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `enquiryId` | Durable enquiry identifier created before payment | LMS | enquiry/session state passed through checkout flow | `AccommodationEnquiry.enquiryId` | used to fetch enquiry during captured-payment finalization | carried in order notes / callback context | optional mapping only | optional reference only | may exist in older flows | Primary recovery key before booking exists |
| `bookingId` | Canonical booking identifier after THM finalization | THM | Bookmax now polls LMS until `bookingId` is populated instead of creating booking in browser for hardened gateways | `AccommodationEnquiry.bookingId` | `Booking.id` | not authoritative; adapters only receive/forward context | used after THM booking creation | may be used in booking-triggered notification flows | present in alternate stacks | LMS is the lookup surface for UI, THM is the owner |
| `bookingReservationId` | External-facing reservation reference | THM | UI reads linked booking confirmation after LMS update | `AccommodationEnquiry.bookingReservationId` | THM booking reservation/property reservation number | not authoritative | used for downstream reservation sync | can be used for customer-facing communication | present in older email/web flows | THM writes it, LMS stores it for polling and lookup |
| `paymentGateway` | Gateway brand that captured payment | THM normalized from payment adapter callback | `payment.paymentGateway` and checkout gateway selection | stored with enquiry metadata where applicable | captured-payment request field and stored booking/payment label | `Razorpay` or `PayU` normalized into THM request | optional transport only | display-only if rendered | may be flattened in legacy flows | Must remain separate from `paymentMode` |
| `paymentMode` | Actual payment instrument such as UPI or Card | THM normalized from adapter callback | `payment.paymentMode` | optional enquiry metadata only | booking/payment/email DTO `paymentMode` | raw callback/payment-status field mapped into THM | optional transport only | available for email/template rendering | legacy flows may use same label differently | Do not use this field to represent gateway identity |
| `couponCode` | Guest-applied coupon identifier | THM booking, mirrored in LMS when needed pre-finalization | `booking.couponCode`, `enquiry.couponCode`, pricing request state | `AccommodationEnquiry.couponCode` | `BookingDto.couponCode`, `BookingEmailDto.couponCode`, voucher/email model | optional passthrough only | mapped only if downstream supports it | available for email/voucher rendering | may exist in older web/email flows | Guard display when absent |
| `promotionName` | Human-readable promotion/offer label | THM booking, mirrored in LMS when needed pre-finalization | `booking.promotionName`, `enquiry.promotionName` | `AccommodationEnquiry.promotionName` | `BookingDto.promotionName`, `BookingEmailDto.promotionName`, voucher/email model | optional passthrough only | mapped only if downstream supports it | available for email/voucher rendering | may exist in older web/email flows | Keep separate from coupon code |
| `advanceAmount` | Amount collected or payable at booking time | THM pricing summary | `booking.advanceAmount`, pricing request state, confirmation UI | enquiry copy may be stored for recovery/display | `BookingDto.advanceAmount`, `BookingEmailDto.advanceAmount`, voucher/email totals | captured amount may be forwarded by adapter; THM remains authoritative for booking summary | optional downstream financial mapping | rendered in voucher/email when greater than zero | older flows may show same field | Guest-facing label should be clear: advance payable or paid |
| `dueAmount` | Outstanding amount due after booking | THM pricing summary | derived from backend booking data for confirmation/voucher views | not primary LMS pricing field | `BookingEmailDto.dueAmount`, voucher/email totals | not owned by adapter | optional if downstream supports balance fields | render only when applicable | varies in legacy flows | Zero-safe/guarded display |
| `serviceQuoteSummary` | Durable quoted service snapshot before booking exists | LMS | UI serializes selected add-ons into enquiry payload via hotel booking service | `AccommodationEnquiry.serviceQuoteSummary` | THM parses enquiry snapshot to reconstruct booking services during captured-payment finalization | not owned by adapter | not primary | not primary | n/a | This replaced browser-only reliance for selected services |
| `services` | Canonical booked add-on/service lines after booking finalization | THM | Bookmax voucher flow now falls back to backend `booking.services` when enquiry add-ons are unavailable | not primary once booking exists; LMS only stores pre-booking snapshot | booking service records and `BookingEmailDto.services` | not owned by adapter | optional downstream mapping | available for voucher/email rendering | may not exist in older simplified flows | THM is the guest-facing truth after booking creation |
| `quantityApplied` | Quantity actually booked for a service line | THM service line | UI may originate requested quantity before payment | may be embedded inside `serviceQuoteSummary` snapshot JSON | `CalculatedSelectedServiceDto.quantityApplied`, `BookingEmailDto.ServiceDetails.quantityApplied` | not owned by adapter | optional only | rendered in voucher/email additional services section | n/a | Prefer backend quantity over browser cache after finalization |
| `unitPrice` | Per-unit service price | THM booked service line, with LMS snapshot used pre-booking | UI quoted display only | may be embedded inside `serviceQuoteSummary` snapshot JSON | `BookingEmailDto.ServiceDetails.unitPrice` and booked service amounts | not owned by adapter | optional only | rendered in voucher/email service section | n/a | Distinguish quoted unit price from final booked totals |
| `discountAmount` | Discount value at booking or service level | THM pricing summary / THM service line | UI may show estimated discount before payment | snapshot may carry quoted discount context | `BookingEmailDto.discountAmount`, `BookingEmailDto.ServiceDetails.discountAmount`, voucher/email totals | not owned by adapter | optional only | rendered in voucher/email | may vary in older flows | Must distinguish booking-level and service-level discount |

## Latest Implemented Documentation Notes

- Bookmax hardened checkout now relies on LMS polling for backend-created bookings in `Razorpay` and `PayU` flows instead of browser-side booking creation.
- Bookmax voucher confirmation now falls back to backend booking services when enquiry-side selected add-on data is unavailable.
- LMS is now the durable store for selected service snapshot data through `serviceQuoteSummary`.
- THM reconstructs booking services from LMS snapshot data during captured-payment finalization.
- THM email and voucher models now include coupon, promotion, advance, due, and richer service line details.
- THM voucher rendering aggregates services across grouped bookings and shows them in a dedicated additional-services section.

## File-Level Ownership Map

Use this section during implementation review. It shows where a field is written, stored, transformed, and rendered in the current active flow.

| Field Label | UI writer / reader | LMS storage | THM assembly / owner | THM renderer / downstream output | Notes |
| --- | --- | --- | --- | --- | --- |
| `serviceQuoteSummary` | `bookone-bookmax/src/services/hotel-booking.service.ts` via `enrichEnquiryWithServiceSnapshot(...)` writes serialized selected services into the enquiry request | `java-lms/src/main/java/co/nz/csoft/dto/AccommodationEnquiryDto.java` and `java-lms/src/main/java/co/nz/csoft/model/AccommodationEnquiry.java` | THM captured-payment finalization reads LMS enquiry snapshot and reconstructs booking services from stored quote summary | indirectly rendered later through booked `services` in vouchers and email payloads | Primary fix for avoiding browser-only add-on persistence |
| `bookingId` | Bookmax checkout confirmation and voucher flows read booking linkage from enquiry/session instead of creating bookings in browser | `AccommodationEnquiry.bookingId` | THM creates booking and updates LMS linkage | Bookmax voucher and confirmation fetch booking using backend-created id | LMS is the UI polling surface, THM is the creator |
| `bookingReservationId` | Bookmax reads reservation linkage after LMS update | `AccommodationEnquiry.bookingReservationId` | THM writes reservation reference after booking creation | exposed in voucher/email as reservation number | External-facing reference derived from THM |
| `couponCode` | Bookmax carries `booking.couponCode`, `enquiry.couponCode`, and pricing/enquiry payload state | `AccommodationEnquiryDto.couponCode` and `AccommodationEnquiry.couponCode` | THM maps booking coupon into `BookingDto` and `BookingEmailDto`; `buildBookingEmailDto(...)` copies it into booking and email detail models | `EmailServiceImpl.preparePersonalization(...)`, `voucher.html`, and `package-voucher.html` render it with guard conditions | Keep distinct from `promotionName` |
| `promotionName` | Bookmax carries `booking.promotionName`, `enquiry.promotionName`, and pricing/enquiry payload state | `AccommodationEnquiryDto.promotionName` and `AccommodationEnquiry.promotionName` | THM maps promotion into booking and `BookingEmailDto`; `buildBookingEmailDto(...)` propagates it into top-level and per-booking detail models | `EmailServiceImpl.preparePersonalization(...)`, `voucher.html`, and `package-voucher.html` render it with guard conditions | Human-readable offer label |
| `advanceAmount` | Bookmax confirmation UI reads and forwards `booking.advanceAmount` in booking/pricing/enquiry state | may be mirrored in enquiry data for display or recovery | THM owns booking-level amount and maps it into `BookingDto` and `BookingEmailDto`; `buildBookingEmailDto(...)` aggregates it across grouped bookings | `EmailServiceImpl.preparePersonalization(...)`, `PdfServiceImpl.generateBookingVoucher(...)`, `voucher.html`, and `package-voucher.html` render it as guest-facing advance payable/paid value | Use zero-safe guest display |
| `dueAmount` | UI should read from backend booking/email response rather than rederive locally when possible | not primary LMS pricing field | THM computes outstanding amount and places it into `BookingEmailDto.dueAmount`; grouped totals are assembled in email/voucher flows | `EmailServiceImpl.preparePersonalization(...)`, `PdfServiceImpl.generateBookingVoucher(...)`, and voucher templates render balance due conditionally | THM remains authoritative |
| `services` | `bookone-bookmax/src/app/views/landing/booking-confirmation-voucher/booking-confirmation-voucher.component.ts` now falls back to backend booking services through `resolveSelectedAddOns(...)` and `getSelectedAddOnsFromBookings()` | LMS stores pre-booking snapshot only, not final service truth | THM persists final service rows; `buildBookingEmailDto(...)` maps them into `BookingEmailDto.ServiceDetails`; `PdfServiceImpl.generateBookingVoucher(...)` aggregates them across grouped bookings | `EmailServiceImpl.preparePersonalization(...)`, `voucher.html`, and `package-voucher.html` render additional service details | Backend `booking.services` is the guest-facing fallback when enquiry/session state is missing |
| `quantityApplied` | UI may originate requested quantity before payment | embedded inside `serviceQuoteSummary` snapshot JSON when enquiry is saved | THM maps final service quantity into `BookingEmailDto.ServiceDetails.quantityApplied` | `voucher.html` and `package-voucher.html` render quantity in the additional-services table | Prefer backend-finalized quantity over browser cache |
| `paymentMode` | Bookmax writes `payment.paymentMode` and reads mode in confirmation views | optional enquiry metadata only | THM normalizes and stores payment instrument on booking/payment models and `BookingEmailDto.paymentMode` | `EmailServiceImpl.preparePersonalization(...)` and voucher/email outputs render payment mode | Must not be used as gateway identity |
| `paymentGateway` | Bookmax sets gateway context during checkout initiation | optional enquiry metadata or status context | THM owns normalized gateway meaning after adapter callback | may be rendered or logged downstream where needed | Keep separate from `paymentMode` in all mappings |

## Current File Paths Used In This Mapping

- UI enquiry snapshot writer: `bookone-bookmax/src/services/hotel-booking.service.ts`
- UI booking-service fallback reader: `bookone-bookmax/src/app/views/landing/booking-confirmation-voucher/booking-confirmation-voucher.component.ts`
- LMS enquiry DTO: `java-lms/src/main/java/co/nz/csoft/dto/AccommodationEnquiryDto.java`
- LMS enquiry entity: `java-lms/src/main/java/co/nz/csoft/model/AccommodationEnquiry.java`
- THM email read model: `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/dto/BookingEmailDto.java`
- THM email assembly: `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java`
- THM voucher assembly: `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/PdfServiceImpl.java`
- THM email template payload builder: `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/email/EmailServiceImpl.java`
- THM voucher templates: `java-the-hotel-mate/src/main/resources/templates/voucher.html` and `java-the-hotel-mate/src/main/resources/templates/package-voucher.html`

## Source References

Use these references when validating that the documented ownership still matches the implementation.

### UI references

- `bookone-bookmax/src/services/hotel-booking.service.ts:398` submits LMS accommodation enquiries
- `bookone-bookmax/src/services/hotel-booking.service.ts:408` builds the enriched enquiry snapshot in `enrichEnquiryWithServiceSnapshot(...)`
- `bookone-bookmax/src/services/hotel-booking.service.ts:427` writes `serviceQuoteSummary`
- `bookone-bookmax/src/services/hotel-booking.service.ts:81` calls THM booking email generation
- `bookone-bookmax/src/services/hotel-booking.service.ts:99` calls THM voucher generation
- `bookone-bookmax/src/services/hotel-booking.service.ts:106` fetches booking by backend booking id
- `bookone-bookmax/src/app/views/landing/Confirm-Booking/Confirm-Booking.component.ts:700` writes `bookingReservationId` back into enquiry state
- `bookone-bookmax/src/app/views/landing/Confirm-Booking/Confirm-Booking.component.ts:701` writes `bookingId` back into enquiry state
- `bookone-bookmax/src/app/views/landing/booking-confirmation-voucher/booking-confirmation-voucher.component.ts:489` resolves displayed add-ons for voucher confirmation
- `bookone-bookmax/src/app/views/landing/booking-confirmation-voucher/booking-confirmation-voucher.component.ts:498` starts fallback logic in `resolveSelectedAddOns(...)`
- `bookone-bookmax/src/app/views/landing/booking-confirmation-voucher/booking-confirmation-voucher.component.ts:505` derives add-ons from backend booking services in `getSelectedAddOnsFromBookings()`

### LMS references

- `java-lms/src/main/java/co/nz/csoft/controller/AccommodationEnquiryController.java:65` creates accommodation enquiry records
- `java-lms/src/main/java/co/nz/csoft/controller/AccommodationEnquiryController.java:82` fetches enquiry by id for UI polling and backend recovery
- `java-lms/src/main/java/co/nz/csoft/controller/AccommodationEnquiryController.java:303` fetches enquiry by `bookingReservationId`
- `java-lms/src/main/java/co/nz/csoft/dto/AccommodationEnquiryDto.java:89` defines `bookingReservationId`
- `java-lms/src/main/java/co/nz/csoft/dto/AccommodationEnquiryDto.java:111` defines `bookingId`
- `java-lms/src/main/java/co/nz/csoft/dto/AccommodationEnquiryDto.java:117` defines `couponCode`
- `java-lms/src/main/java/co/nz/csoft/dto/AccommodationEnquiryDto.java:118` defines `promotionName`
- `java-lms/src/main/java/co/nz/csoft/dto/AccommodationEnquiryDto.java:128` defines `serviceQuoteSummary`
- `java-lms/src/main/java/co/nz/csoft/model/AccommodationEnquiry.java:104` stores `bookingReservationId`
- `java-lms/src/main/java/co/nz/csoft/model/AccommodationEnquiry.java:125` stores `bookingId`
- `java-lms/src/main/java/co/nz/csoft/model/AccommodationEnquiry.java:130` stores `couponCode`
- `java-lms/src/main/java/co/nz/csoft/model/AccommodationEnquiry.java:131` stores `promotionName`
- `java-lms/src/main/java/co/nz/csoft/model/AccommodationEnquiry.java:142` stores `serviceQuoteSummary`

### THM references

- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/controller/ThmController.java:532` exposes `POST /booking/captured-payment`
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/controller/ThmController.java:1117` exposes voucher generation endpoint
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/controller/ThmController.java:1162` exposes booking email generation endpoint
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java:5727` assembles `BookingEmailDto` in `buildBookingEmailDto(...)`
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java:5851` maps booking-level `advanceAmount` into email booking details
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java:5853` maps booking-level `couponCode` into email booking details
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java:5854` maps booking-level `promotionName` into email booking details
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java:5919` maps top-level `couponCode`
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java:5920` maps top-level `promotionName`
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java:5968` maps aggregated `advanceAmount`
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/serviceImpl/PdfServiceImpl.java:225` assembles voucher data in `generateBookingVoucher(...)`
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/email/EmailServiceImpl.java:1287` builds SendGrid personalization data in `preparePersonalization(...)`
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/email/EmailServiceImpl.java:1319` adds `advanceAmount` to the email template payload
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/email/EmailServiceImpl.java:1325` adds `couponCode` to the email template payload
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/email/EmailServiceImpl.java:1327` adds `promotionName` to the email template payload
- `java-the-hotel-mate/src/main/java/co/nz/csoft/thehotelmate/email/EmailServiceImpl.java:1329` adds `dueAmount` to the email template payload

## API Endpoint Ownership

This section maps the active endpoints to the fields they primarily create, enrich, or expose.

| Endpoint | Owning repo | Primary responsibility | Fields most relevant to mapping |
| --- | --- | --- | --- |
| `POST /api/v1/accommodationEnquiry` | `java-lms` | create/update durable enquiry snapshot from UI | `enquiryId`, `serviceQuoteSummary`, `couponCode`, `promotionName`, pre-booking pricing snapshot |
| `GET /api/v1/accommodationEnquiry/{enquiryId}` | `java-lms` | return enquiry state for UI polling and THM recovery | `bookingId`, `bookingReservationId`, `serviceQuoteSummary`, enquiry pricing fields |
| `POST /api/thm/booking/captured-payment` | `java-the-hotel-mate` | finalize booking from normalized payment capture | `paymentGateway`, `paymentMode`, `advanceAmount`, `couponCode`, `promotionName`, reconstructed `services` |
| `GET /api/thm/generateBookingVoucher?bookingId=...` | `java-the-hotel-mate` | assemble voucher model and render grouped booking/service totals | `services`, `advanceAmount`, `outstandingAmount`, `couponCode`, `promotionName` |
| `GET /api/thm/bookingEmailToCustomer?bookingId=...` | `java-the-hotel-mate` | assemble SendGrid email payload | `services`, `advanceAmount`, `dueAmount`, `couponCode`, `promotionName`, `paymentMode` |

## Review Rule

When any booking, pricing, coupon, promotion, payment, or service field changes, review all five layers in order:

1. UI write path
2. LMS snapshot model
3. THM booking finalization
4. THM email/voucher assembly
5. guest-facing render path

## Ownership Rules

Use these rules when deciding where a field should be defined and reviewed.

- `bookone-bookmax` owns transient UI-only state and user-input labels.
- `java-lms` owns durable enquiry snapshot fields needed for recovery and backend finalization.
- `java-the-hotel-mate` owns booking-domain fields and normalized post-payment meaning.
- `java-razorpay` and `java-api-payu` own raw gateway callback/request fields, but should normalize into THM-owned business fields instead of creating parallel business concepts.
- `channel-integration` only owns downstream transport mapping, not booking business semantics.
- `api-java-notify-service` owns delivery-channel rendering fields, not booking truth.
- `booking-java-api` should be treated as alternate or legacy unless a specific active flow still depends on it.

## Priority Business Fields To Track

Start the mapping with the fields below, because they are the ones most likely to drift across services.

### Booking Identity

| Field Label | Source Of Truth | Notes |
| --- | --- | --- |
| `enquiryId` | LMS | Connects UI session to durable enquiry state |
| `bookingId` | THM | Canonical booking identifier after finalization |
| `bookingReservationId` | THM propagated into LMS | External-facing reservation reference |
| `transactionId` | payment adapter then THM | Preserve raw gateway linkage |

### Payment Semantics

| Field Label | Source Of Truth | Notes |
| --- | --- | --- |
| `paymentGateway` | THM normalized from adapter | `Razorpay`, `PayU`; never merge with payment mode |
| `paymentMode` | THM normalized from adapter | `UPI`, `Card`, `NetBanking`, etc. |
| `paymentStatus` | THM | Backend-finalized status used for booking completion |
| `advanceAmount` | THM booking pricing | Guest-facing payable-at-booking amount |
| `dueAmount` | THM booking pricing | Outstanding payable amount |
| `convenienceFee` | THM pricing summary | Zero-safe in guest outputs |

### Discount / Offer Semantics

| Field Label | Source Of Truth | Notes |
| --- | --- | --- |
| `couponCode` | THM booking + LMS snapshot if needed before booking | Show only when present |
| `promotionName` | THM booking + LMS snapshot if needed before booking | Keep separate from coupon code |
| `discountAmount` | THM pricing summary | Zero-safe in vouchers/emails |
| `discountPercentage` | THM pricing summary | Default display should be `0%` when absent |

### Add-On / Service Semantics

| Field Label | Source Of Truth | Notes |
| --- | --- | --- |
| `serviceQuoteSummary` | LMS | Durable enquiry snapshot for backend recovery |
| `services` | THM booking services | Canonical booked service lines after finalization |
| `quantityApplied` | THM service line | Avoid relying on browser-only token storage |
| `unitPrice` | THM service line / LMS snapshot before booking | Keep quoted and booked meanings explicit |
| `discountAmount` | THM service line | Service-level discount, not booking-level total |
| `netAmount` | THM service line | Final guest-facing line total |

## Change Workflow

When adding or changing a field, update the mapping in this order:

1. Add or update the field label in this document.
2. Mark the system that is the source of truth.
3. Record the exact repo-level field names used in UI, LMS, THM, adapter, and notification layers.
4. Note any intentional field split, merge, or normalization.
5. Link the code change or PR that implemented the update.

## Current Recommendation

For the active refactor and feature work, keep the authoritative mapping document in this repository and use THM/LMS/payment repos for implementation details only.

That gives you one place to review the model across:

- `bookone-bookmax`
- `java-lms`
- `java-the-hotel-mate`
- `java-razorpay`
- `java-api-payu`
- `channel-integration`
- `api-java-notify-service`
- `booking-java-api`

If you want, the next step can be to populate this file with a concrete row-by-row mapping for the current hotel booking flow fields already touched in the refactor.