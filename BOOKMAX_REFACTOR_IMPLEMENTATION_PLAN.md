# Bookmax Refactor-First Implementation Plan

Last updated: 2026-04-10

## Current Status

This file started as a forward-looking refactor plan. It now serves two purposes:

- record which refactor goals are completed or materially in progress
- preserve the remaining cleanup and follow-up work

### Completed or materially delivered

- THM is now the captured-payment booking orchestrator.
- Razorpay no longer owns booking creation; it validates webhook input and delegates normalized captured-payment facts to THM.
- PayU now follows the same THM captured-payment delegation pattern for THM-source success callbacks.
- THM finalization is idempotent and reuses existing LMS-linked bookings on callback replay.
- LMS enquiry snapshot fields are used to reconstruct selected services and quoted totals during backend finalization.
- LMS now persists richer `serviceQuoteSummary` data for backend recovery of selected add-ons and quoted service pricing.
- `paymentGateway` and `paymentMode` are now separated across THM, Razorpay, PayU, and Bookmax.
- Bookmax hardened checkout flows now suppress browser-side booking creation and add-on creation for `Razorpay` and `PayU`.
- `booking-confirm.component.ts` now polls LMS for backend-created booking linkage instead of creating bookings in the browser for backend-finalized gateways.
- Bookmax voucher confirmation now falls back to backend booking service lines when enquiry-side add-on state is unavailable.
- THM downstream voucher and booking-email read models now include coupon, promotion, advance, due, and richer service details.
- THM voucher generation aggregates services across grouped bookings instead of only reading the primary booking's services.
- Razorpay webhook signature validation is implemented.

### Still pending or intentionally deferred

- delete obsolete legacy frontend callback and direct-booking paths after compatibility review
- add focused frontend regression coverage for backend-finalized pay-now behavior
- continue configuration cleanup and environment normalization where still inconsistent
- centralize all authoritative pricing logic fully in backend if frontend-calculated fallbacks remain

## Goal

Introduce two new booking concepts safely:

- add-on or upsell hotel services
- percentage-based discounts

while fixing the current architectural issues:

- hard-coded URLs across services
- orchestration happening in the wrong service
- duplicated pricing logic
- non-maintainable cross-service coupling

This plan recommended a focused refactor first, followed by feature delivery on top of the corrected seams. That refactor-first decision has now been validated by the implemented backend finalization changes.

## Executive Recommendation

Do **not** start with a broad cleanup refactor.

Do a **targeted refactor first** in three areas only:

- configuration and service client cleanup
- booking orchestration ownership
- pricing ownership and request contract cleanup

Then implement add-ons and percentage discounts on top of that narrower refactor.

This avoided baking new features into the previous incorrect ownership model where `java-razorpay` orchestrated booking creation.

## Target Architecture

### Desired ownership

- `bookone-bookmax`
  - collect user selections
  - show progress and status
  - stop doing business-rule-heavy orchestration
- `java-razorpay`
  - create Razorpay order
  - validate webhook
  - forward payment outcome to booking orchestrator
  - stop owning booking conversion logic
- `java-the-hotel-mate`
  - become the booking orchestrator
  - own final booking pricing breakdown
  - create booking
  - update downstream systems after successful booking creation
- `java-lms`
  - store enquiry state and booking linkage
  - stay as enquiry persistence service
- `channel-integration`
  - receive normalized external reservation payload only
- `api-java-notify-service`
  - keep WhatsApp-specific tracking and notifications only

### Design principle

Payment gateway services should not own booking-domain orchestration.

Booking-domain logic belongs with the booking service.

That principle is now the implemented direction for the hardened `Razorpay` and `PayU` booking finalization paths.

## Delivery Strategy

### Why refactor first

The new features are not isolated UI changes. They affect:

- enquiry totals
- booking totals
- payment amount creation
- webhook settlement assumptions
- downstream reservation payloads
- voucher and confirmation displays

If add-ons and percentage discounts are added before ownership is cleaned up, the codebase will become harder to change and test.

### Why not do a full refactor first

A broad rewrite will slow delivery and create migration risk across many already-active flows.

The right approach is a narrow refactor that creates stable seams, then feature implementation, then cleanup of old paths.

## Phases

Status legend:

- completed = implemented and validated in current refactor work
- partial = direction implemented, but cleanup remains
- pending = still future work

## Phase 0 - Baseline and Decision Lock

Status: completed

### Objective

Freeze the current flow and agree on target ownership before code changes.

### Deliverables

- approved sequence diagrams for current flow and target flow
- confirmed target ownership for orchestration
- list of active flows to preserve during migration
- test matrix for payment and booking conversion paths

### Scope

- no functional changes
- documentation and architecture alignment only

### Risks

- team starts coding before ownership is agreed
- hidden legacy flow is missed

### Mitigation

- require sign-off on target sequence before Phase 1 starts
- inventory current flows explicitly:
  - current web Razorpay polling flow
  - `booking_id` webhook flow
  - older direct frontend booking flow

## Phase 1 - Configuration and Integration Cleanup

Status: partial

### Objective

Remove hard-coded URLs and create maintainable service integration boundaries.

### Changes

- move all hard-coded URLs to environment or properties files
- standardize config keys across services
- replace ad hoc `RestTemplate` endpoint strings with centralized client wrappers
- document which base URL is authoritative for each integration

### Deliverables

- no hard-coded production endpoints in business logic
- integration client classes per downstream dependency
- environment-specific config verified for India and production variants

### Risks

- environment mismatch after config extraction
- accidental break in non-prod flows

### Mitigation

- preserve old values in config initially
- validate with smoke tests per environment
- do not combine this phase with orchestration changes in one deploy if avoidable

## Phase 2 - Introduce Booking Command Contract

Status: partial

### Objective

Create one normalized backend contract for booking conversion and pricing input.

### New contract concepts

- enquiry reference
- room pricing details
- selected add-ons
- discount model
- payment settlement details
- computed totals breakdown

### Suggested request structure

- enquiryId
- propertyId
- roomId
- stay dates
- guest counts
- selectedAddOns[]
- percentageDiscount
- discountSource
- paymentMode
- paidAmount
- couponCode
- promotionName
- metadata for source channel

### Important rule

Do not let frontend, payment service, and booking service all compute totals independently.

The booking service should become the pricing authority.

### Risks

- schema drift across LMS, THM, and frontend DTOs
- existing flows depend on current loose DTO shape

### Mitigation

- add new fields in backward-compatible form first
- keep existing fields for transition period
- version behavior internally if needed without changing public endpoint shape immediately

## Phase 3 - Move Orchestration to java-the-hotel-mate

Status: materially completed for hardened PayU and Razorpay captured-payment flows

### Objective

Shift booking conversion orchestration out of `java-razorpay` and into `java-the-hotel-mate`.

### Target change

Current state:

- gateway adapters terminate raw callbacks and normalize payment facts
- THM reads LMS enquiry snapshot
- THM creates or reuses booking idempotently
- THM updates LMS booking linkage and downstream systems

Target state:

- `java-razorpay` validates webhook and forwards settlement event
- `java-the-hotel-mate` fetches enquiry or receives booking command
- `java-the-hotel-mate` computes final totals
- `java-the-hotel-mate` creates booking
- `java-the-hotel-mate` updates LMS booking linkage
- `java-the-hotel-mate` calls downstream systems or emits post-booking event

### Implementation options

#### Option A - THM endpoint becomes orchestrator endpoint

- add a new THM endpoint such as `POST /api/thm/booking/convert-from-payment`
- `java-razorpay` calls that endpoint after successful webhook validation

#### Option B - Event-driven internal handoff

- `java-razorpay` emits a payment-captured event
- THM consumes and performs orchestration

### Recommendation

Use Option A first.

It proved simpler, faster, and lower-risk than introducing a new eventing model during the same feature delivery cycle.

### Risks

- partial migration leaves two orchestrators active
- duplicate booking creation on retries

### Mitigation

- add idempotency guard using enquiryId plus payment reference
- introduce feature flag to switch webhook path gradually
- keep old path available behind fallback until cutover is proven

## Phase 4 - Centralize Pricing Logic

Status: partial

### Objective

Make one backend service authoritative for all booking totals.

### Pricing rules to centralize

- base room amount
- number of rooms and nights
- add-on charges
- percentage discounts
- coupon or promotion interactions
- tax calculation
- advance payment and paid amount handling
- payable and outstanding amount

### Recommendation

Implement pricing in `java-the-hotel-mate` because it owns booking creation.

Frontend should send intent and selected options, but not be the source of truth for final totals.

### Risks

- mismatch between displayed frontend total and backend total
- payment intent amount differs from final booking amount

### Mitigation

- add a pricing preview endpoint before payment initiation
- use backend-calculated amount for payment intent creation
- store pricing breakdown snapshot on enquiry and booking

## Phase 5 - Feature Delivery: Add-ons and Percentage Discounts

Status: partial

### Objective

Implement the actual business features after the architecture seam is ready.

### Add-ons / upsell services

Required capabilities:

- select zero or more add-ons in frontend
- persist add-ons in enquiry or booking command
- include add-ons in pricing preview
- include add-ons in booking creation
- include add-ons in voucher, booking confirmation, and external reservation if required

### Percentage discount

Required capabilities:

- support percentage-based discount source
- compute discount before tax according to agreed rule
- preserve audit trail of discount reason and source
- show discount breakdown consistently in frontend and backend documents

### Risks

- promotion logic conflicts with percentage discount logic
- add-ons may not be supported downstream by every consumer

### Mitigation

- define precedence rules clearly:
  - promotion versus manual percentage discount
  - add-ons before or after discount
  - tax on discounted subtotal or original subtotal
- add mapping rules for downstream systems that cannot accept add-on granularity

## Phase 6 - Legacy Flow Consolidation

Status: pending

### Objective

Reduce duplicate paths after the new architecture is stable.

### Cleanup targets

- older frontend direct-booking flow in `Confirm-Booking.component.ts`
- older `booking-complete` direct update path
- older `confirm-payment` callback path
- duplicated pricing or payment save logic in frontend
- duplicate enquiry update logic across services

### Risks

- removing legacy flow too early breaks non-obvious business process

### Mitigation

- keep usage telemetry or logs for old endpoints before removing
- deprecate first, remove later

## Repo-by-Repo Changes

## bookone-bookmax

### Phase 1

- remove hard-coded callback and service URL usage from components where possible
- centralize endpoint consumption through service layer only

### Phase 2

- add DTO support for add-ons and percentage discounts
- stop spreading pricing calculations across multiple components

### Phase 4

- call backend pricing preview endpoint before payment intent
- render backend pricing breakdown instead of trusting local-only calculation

### Phase 5

- add UI for add-on selection
- add UI for percentage discount display and confirmation
- update booking summary, payment summary, voucher pages

### Later cleanup

- retire duplicate legacy booking paths if confirmed unused
- remove now-guarded browser-side booking creation branches for backend-finalized gateways once compatibility review is complete

## java-the-hotel-mate

### Phase 2

- extend booking request model to accept add-ons and discount metadata
- add pricing service or pricing module

### Phase 3

- introduce orchestrator endpoint for payment-to-booking conversion
- fetch enquiry or accept normalized booking command
- own LMS booking linkage update
- own downstream external reservation trigger

### Phase 4

- compute final pricing authoritatively
- persist pricing breakdown on booking

### Phase 5

- create booking with add-ons
- apply percentage discounts consistently
- expose voucher and confirmation data with pricing breakdown

## java-razorpay

### Phase 1

- remove hard-coded dependent service URLs from service logic and use config-backed clients consistently

### Phase 3

- reduce `BookingPaymentServiceImpl` responsibilities
- webhook should validate event and forward settlement to THM orchestrator
- remove direct LMS update and external reservation orchestration from payment service over time

### Phase 5

- ensure payment intent amount uses backend-authoritative pricing
- keep only gateway-specific metadata here

## java-lms

### Phase 2

- extend enquiry model to store add-on and discount metadata where required
- add fields for pricing snapshot if needed

### Phase 3

- accept booking linkage updates from THM orchestrator
- clarify whether both `bookingId` and `bookingReservationId` must be written

Current answer:

- both `bookingId` and `bookingReservationId` are written in the finalized captured-payment flow

### Phase 5

- surface add-on and discount information for lead or enquiry views if business requires it

## channel-integration

### Phase 3

- verify expected normalized reservation payload contract

### Phase 5

- extend payload mapping for add-ons and discounts only if downstream systems support them
- otherwise map only final totals and notes

## api-java-notify-service

### Phase 3

- keep WhatsApp enquiry update responsibility narrowly scoped
- avoid becoming a secondary booking orchestrator

### Phase 5

- update WhatsApp confirmation templates to reflect add-ons and discount breakdown if required

## booking-java-api

### Phase 0

- identify whether `/api/website/*` flows are still active for any customer path

### Phase 6

- decide whether this stack remains a supported alternate path or becomes legacy-only
- avoid implementing the new features here unless it is still a real active flow

## Recommended Sequence of Execution

1. Phase 0 - agree target ownership and test matrix
2. Phase 1 - extract configuration and integration clients
3. Phase 2 - define and introduce unified booking command and pricing contract
4. Phase 3 - move orchestration to THM behind a safe migration path
5. Phase 4 - centralize pricing logic in THM
6. Phase 5 - implement add-ons and percentage discounts end to end
7. Phase 6 - consolidate or remove legacy duplicate flows

## Release Strategy

### Safe rollout approach

- release config cleanup first
- release THM orchestrator behind feature flag
- dual-run or shadow-log for webhook events if possible
- cut current `java-razorpay` booking orchestration after verification
- release add-ons and percentage discounts after authoritative pricing is live

### Suggested flags

- `thm.booking.orchestrator.enabled`
- `pricing.preview.authoritative.enabled`
- `booking.addons.enabled`
- `booking.percentage.discount.enabled`

Note:

- the current delivered work was implemented directly rather than through visible application-level feature flags in this frontend repo

## Test Strategy

### Must-cover cases

- payment captured with full payment
- payment captured with partial payment
- booking conversion retry or duplicate webhook
- duplicate successful PayU callback after payment is already persisted as paid
- add-ons with no discount
- add-ons with percentage discount
- promotion with percentage discount conflict
- group enquiry versus single enquiry
- downstream external reservation payload verification
- voucher totals matching backend calculation

### Required checks

- payment amount equals backend pricing preview amount
- booking amount equals payment amount according to business rule
- enquiry and booking linkage are written consistently
- no duplicate booking on webhook retries
- frontend waits for LMS `bookingId` instead of creating bookings in-browser for hardened PayU and Razorpay paths

## Major Risks

### Risk: migration creates duplicate bookings

Impact:

- severe

Mitigation:

- idempotency keys
- unique booking conversion guard
- webhook replay protection

Current status:

- materially mitigated in THM for captured-payment finalization

### Risk: pricing mismatch across systems

Impact:

- severe

Mitigation:

- backend pricing authority
- persisted pricing snapshot
- payment intent created from authoritative total only

### Risk: legacy path still active but undocumented

Impact:

- high

Mitigation:

- endpoint usage audit
- deprecation logs
- staged removal only

Current status:

- still relevant for `booking-complete`, `confirm-payment`, and older `payment.component` flows

### Risk: downstream systems cannot represent add-ons or discount granularity

Impact:

- medium

Mitigation:

- map final totals and notes for unsupported channels
- keep detailed breakdown internally

### Risk: too much refactor before feature delivery

Impact:

- schedule delay

Mitigation:

- keep refactor limited to ownership, config, and pricing seams
- defer generic cleanup until after feature stabilization

## Final Recommendation

Implement this as a **refactor-first but narrow-scope** program.

Do these first:

- fix configuration and hard-coded URLs
- move orchestration ownership toward `java-the-hotel-mate`
- centralize pricing authority

Then implement:

- add-on or upsell services
- percentage-based discounts

Only after that should the team clean up duplicate legacy flows.

That ordering remains correct. The orchestration move has already paid off by enabling backend-finalized PayU and Razorpay flows without depending on browser completion.

That sequence reduces long-term maintenance cost without turning the initiative into an open-ended rewrite.

## Concrete Phase 1 Task Breakdown

This section turns Phase 1 into an execution checklist with file-level starting points.

## Phase 1 Objective

Remove hard-coded endpoint usage, standardize configuration ownership, and introduce reusable integration clients without changing business behavior.

## Phase 1 Acceptance Criteria

- no business-service file should build production URLs inline
- no component should choose between gateway URLs directly using string literals
- base URLs should come from one configuration source per repo
- cross-service HTTP calls should move toward dedicated client classes or wrappers
- behavior remains functionally identical after cleanup

## Repo-by-Repo Starting Points

## 1. bookone-bookmax

### Primary goal

Remove direct hard-coded backend URLs from frontend service methods and make `environment.ts` the only base URL source.

### Start with these files

- `src/services/hotel-booking.service.ts`
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `src/environments/environment.india-prod.ts`
- `src/app/app.component.ts`

### Immediate tasks

1. Replace hard-coded URLs in `hotel-booking.service.ts` with environment-backed values.
2. Normalize gateway URL usage so every payment endpoint comes from environment config.
3. Stop mixing `API_URL_IN`, `environment.apiUrl`, `environment.apiUrlBookone`, and raw URL literals without clear ownership.
4. Add grouped environment keys for:
  - THM API
  - LMS API
  - BookOne API
  - Razorpay API
  - PayU API
  - scheduler API
  - channel-integration API
5. Add comments or naming cleanup in environment files so service ownership is obvious.

### Known hotspots

- `fetchBookingById(...)` uses a hard-coded THM URL
- `paymentIntent(...)` uses a hard-coded THM URL
- `paymentIntentPhonepe(...)` uses a hard-coded PhonePe URL
- `paymentIntentRayzorpay(...)` uses a hard-coded Razorpay URL
- `processPayment(...)` uses a hard-coded THM URL

### Suggested first code tasks

- introduce `environment.paymentGatewayUrls` or equivalent grouped config
- introduce `environment.serviceEndpoints` or equivalent grouped config
- keep the public method signatures unchanged in `hotel-booking.service.ts`

### Deliverable

- one frontend service layer with no embedded production URL literals for internal APIs

## 2. java-razorpay

### Primary goal

Externalize endpoint usage consistently and reduce ad hoc `RestTemplate` creation.

### Start with these files

- `src/main/resources/application-india_prod.properties`
- `src/main/java/co/nz/csoft/razorpay/serviceImpl/BookingPaymentServiceImpl.java`
- `src/main/java/co/nz/csoft/razorpay/serviceImpl/EnquiryPaymentServiceImpl.java`
- `src/main/java/co/nz/csoft/razorpay/serviceImpl/PaymentLinkServiceImpl.java`
- `src/main/java/co/nz/csoft/razorpay/serviceImpl/RazorpayPaymentGatewayServiceImpl.java`
- `src/main/java/co/nz/csoft/razorpay/controller/RazorpayPaymentController.java`
- `src/main/java/co/nz/csoft/razorpay/serviceImpl/ExternalAPIServiceImpl.java`

### Immediate tasks

1. Replace hard-coded notification URLs in `BookingPaymentServiceImpl.java` with config-backed properties.
2. Remove local `new RestTemplate()` usage inside service methods and inject or reuse one configured client.
3. Standardize config naming:
  - `bookone.API.url`
  - `hotelmate.API.url`
  - `crm.base.url`
  - `thm.booking.url`
  - `external.reservation.url`
  - add new WhatsApp enquiry API base property instead of embedding notification URLs in code
4. Remove placeholder callback literals such as example callback URLs from gateway service code.
5. Create explicit client wrappers or helper methods for:
  - LMS client
  - THM client
  - notification client
  - external reservation client

### Known hotspots

- `BookingPaymentServiceImpl.java` contains hard-coded notification service URLs
- `BookingPaymentServiceImpl.java` creates `RestTemplate` instances inline
- `PaymentLinkServiceImpl.java` contains website-stack orchestration calls that should be isolated behind clearer clients
- `RazorpayPaymentGatewayServiceImpl.java` contains a placeholder callback URL literal

### Suggested first code tasks

- add new properties like `notification.base.url` and `notification.whatsappEnquiry.url`
- introduce a `RestTemplate` bean if one does not already exist
- replace method-local `RestTemplate` construction with injected client usage

### Deliverable

- `java-razorpay` has no service-to-service production URL literals inside orchestration methods

## 3. java-the-hotel-mate

### Primary goal

Identify and clean hard-coded callback or external endpoint usage so THM is ready to become the orchestrator in later phases.

### Start with these files

- `src/main/resources/application-india_prod.properties`
- `src/main/resources/application.properties`
- `src/main/java/co/nz/csoft/thehotelmate/serviceImpl/BookingServiceImpl.java`
- `src/main/java/co/nz/csoft/thehotelmate/util/AtomAES.java`
- `src/main/java/co/nz/csoft/thehotelmate/serviceImpl/GoogleAPIServiceImpl.java`
- `src/main/java/co/nz/csoft/thehotelmate/controller/InternetAccessController.java`

### Immediate tasks

1. Replace hard-coded Razorpay callback URL in `BookingServiceImpl.java` with config-backed value.
2. Move Atom payment return URL constants out of `AtomAES.java` into config.
3. Review other endpoint literals and classify them as:
  - external vendor constants
  - environment config
  - dead or legacy code candidates
4. Create or confirm a single HTTP client configuration approach for outbound calls.

### Known hotspots

- `BookingServiceImpl.java` hard-codes Razorpay webhook callback URL
- `AtomAES.java` hard-codes a BookOne callback URL
- `GoogleAPIServiceImpl.java` embeds Google Places API base path as code constant

### Suggested first code tasks

- add `razorpay.webhook.callback.url` or equivalent config
- add `atom.response.url` config
- keep vendor API base constants only when they are truly vendor-static and not environment-dependent

### Deliverable

- THM is configuration-clean enough to accept orchestration responsibilities in Phase 3

## 4. api-java-notify-service

### Primary goal

Remove cross-service hard-coded URLs for scheduler and notification dispatch where environment-specific values are currently embedded.

### Start with these files

- `src/main/resources/application-india_prod.properties`
- `src/main/resources/application.properties`
- `src/main/java/com/bookone_messaging_api/controller/WhatsappController.java`
- `src/main/java/com/bookone_messaging_api/service/impl/WhatsappServiceImpl.java`
- `src/main/java/com/bookone_messaging_api/service/impl/TenantMetaConfigServiceImpl.java`

### Immediate tasks

1. Replace hard-coded scheduler send-message URLs in `WhatsappController.java` with properties.
2. Review image-link literals used in WhatsApp flows and decide which belong in tenant config versus app config.
3. Separate true tenant content defaults from service integration URLs.
4. Avoid embedding bookone-hosted CDN asset URLs directly in controller logic if they need to vary by tenant or environment.

### Known hotspots

- `WhatsappController.java` hard-codes scheduler API URLs
- `WhatsappController.java` hard-codes flow image links
- `WhatsappServiceImpl.java` contains hard-coded image links

### Suggested first code tasks

- add scheduler URL config
- add flow image asset config where appropriate
- move reusable outbound-call creation into helper clients if repeated

### Deliverable

- notification service no longer mixes integration URLs with business flow code

## 5. booking-java-api

### Primary goal

Clean the alternate website stack so it can either be maintained separately or deprecated cleanly.

### Start with these files

- `src/main/resources/application-india_prod.properties`
- `src/main/java/co/nz/csoft/controller/WebsiteController.java`
- `src/main/java/co/nz/csoft/controller/BookingController.java`
- `src/main/java/co/nz/csoft/service/impl/BookingServiceImpl.java`
- `src/main/java/co/nz/csoft/service/impl/RazorpayPaymentServiceImpl.java`
- `src/main/java/co/nz/csoft/service/impl/WhatsAppServiceImpl.java`
- `src/main/java/co/nz/csoft/util/AtomAES.java`
- `src/main/java/co/nz/csoft/model/Config.java`
- `src/main/java/co/nz/csoft/config/AppConfig.java`

### Immediate tasks

1. Audit whether `/api/website/*` is still active for production traffic.
2. Remove inline `RestTemplate` creation where repeated.
3. Replace hard-coded callback and payment URLs in legacy payment utilities.
4. Move `Config.java` style static payment constants toward property-backed configuration or mark as legacy.
5. Ensure website-stack integration URLs are clearly separated from THM-stack integration URLs.

### Known hotspots

- `WebsiteController.java` and `BookingController.java` instantiate `RestTemplate` inline in some flows
- `BookingServiceImpl.java` mixes configuration and inline HTTP usage
- `RazorpayPaymentServiceImpl.java` constructs payment-link URLs and clients inline
- `AtomAES.java` contains hard-coded callback values
- `Config.java` contains static Paytm endpoint constants

### Suggested first code tasks

- classify this repo as active-path or legacy-path before doing invasive cleanup
- if active, add consistent config extraction and client wrappers
- if legacy, confine cleanup to safety and maintainability only

### Deliverable

- a clear decision whether this website stack remains supported or is legacy-only

## 6. channel-integration

### Primary goal

Confirm that incoming reservation payload handling is config-clean and isolate any environment-sensitive downstream configuration.

### Start with these files

- `src/main/resources/application*.properties`
- `src/main/java/co/nz/csoft/bookone/reservation/ExternalReservationController.java`
- `src/main/java/co/nz/csoft/config/*.java`

### Immediate tasks

1. Review outbound integration configuration used after reservation ingestion.
2. Ensure any downstream credentials or endpoints are property-driven.
3. Ignore generated schema files for this phase; focus only on runtime integration code.

### Suggested first code tasks

- check reservation service classes for endpoint assembly
- separate generated schema content from actual runtime integration logic in the audit

### Deliverable

- no Phase 1 action on generated SOAP/XSD code unless it affects runtime configuration

## Cross-Repo Phase 1 Task Order

### Week 1 focus

1. frontend environment normalization in `bookone-bookmax`
2. `java-razorpay` config extraction and client cleanup
3. THM callback and endpoint config cleanup

### Week 2 focus

1. notification service URL extraction
2. decide active versus legacy status of `booking-java-api`
3. clean remaining inline HTTP client creation in active code paths

## Suggested Work Tickets

### Ticket P1-1 Frontend endpoint normalization

- repo: `bookone-bookmax`
- files: `hotel-booking.service.ts`, `environment*.ts`
- outcome: no raw internal API URL literals in service methods

### Ticket P1-2 Razorpay integration config cleanup

- repo: `java-razorpay`
- files: `application-india_prod.properties`, `BookingPaymentServiceImpl.java`, `PaymentLinkServiceImpl.java`
- outcome: no notification or integration host literals in orchestration code

### Ticket P1-3 Shared HTTP client cleanup in java-razorpay

- repo: `java-razorpay`
- files: `BookingPaymentServiceImpl.java`, `EnquiryPaymentServiceImpl.java`, `ExternalAPIServiceImpl.java`
- outcome: no repeated method-local `RestTemplate` construction in active services

### Ticket P1-4 THM callback config cleanup

- repo: `java-the-hotel-mate`
- files: `BookingServiceImpl.java`, `AtomAES.java`, properties files
- outcome: payment callback URLs are property-backed

### Ticket P1-5 Notification service URL cleanup

- repo: `api-java-notify-service`
- files: `WhatsappController.java`, `WhatsappServiceImpl.java`, properties files
- outcome: scheduler and flow asset URLs are configurable

### Ticket P1-6 Website stack classification and cleanup

- repo: `booking-java-api`
- files: `WebsiteController.java`, `BookingServiceImpl.java`, `RazorpayPaymentServiceImpl.java`, `Config.java`
- outcome: active-path decision made and config cleanup started only where justified

## Phase 1 Non-Goals

Do not do these in Phase 1:

- move orchestration from `java-razorpay` to THM yet
- introduce add-ons feature logic
- introduce percentage-discount feature logic
- change payment or booking behavior
- remove legacy flows without traffic validation

Historical note:

- orchestration has now moved to THM for the hardened captured-payment paths; the remaining warning is about not removing legacy flows without usage validation

## Phase 1 Output Checklist

- configuration map per repo
- raw URL literal audit completed for active checkout path files
- client-wrapper or HTTP helper approach selected per Java repo
- frontend service layer normalized to environment-based URLs
- no behavior change in booking conversion flow yet