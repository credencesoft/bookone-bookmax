# BookMax Demand Redistribution Engine

Last updated: 2026-04-18

## Purpose

This document defines the target BookMax demand-redistribution design for enquiry-mode and pay-later flows that start in BookMax and are operationally supervised from the THM Cockpit.

It is intended to answer:

- how BookMax should reuse the existing enquiry and property-outreach stack
- how THM onboarded properties and CRM lead properties differ in routing behavior
- what new orchestration entities are required
- which existing APIs are reusable and where new orchestration APIs are needed
- where booking creation, payment, and payout remain owned after guest confirmation

Use this document alongside:

- `BOOKMAX_CHECKOUT_FLOW.md`
- `BOOKMAX_REFACTOR_IMPLEMENTATION_PLAN.md`
- `BOOKONE_CROSS_PROJECT_FIELD_MAPPING.md`

## Scope

This engine is for:

- enquiry-first demand routing
- pay-later rescue and redistribution
- property response collection
- guest offer aggregation
- manual and automatic escalation

This engine is not the replacement for:

- THM booking creation
- booking payout and bank reconciliation
- generic CRM lead management

## Design Summary

BookMax should evolve the existing "send enquiry to other properties/leads" behavior into a managed routing engine.

The design principle is:

- BookMax backend owns routing logic and routing state
- THM Cockpit owns operational visibility and manual intervention
- THM booking domain still owns final booking creation, payment confirmation handoff, and payout lifecycle

## Supply Classes

### 1. THM Onboarded Property

This is an operationally active supply node.

Characteristics:

- property profile exists and is trusted
- geolocation exists
- onboarding/setup state is known
- structured response channels are available
- can participate in primary and level-1 redistribution
- higher confidence for booking conversion

Operational meaning:

- treat as structured supply
- expect faster SLA response
- can support reliable quote/availability response

### 2. CRM Lead Property

This is commercially known but not fully activated as THM supply.

Characteristics:

- property profile and contact details exist in CRM
- geolocation exists or should be inferred from city/locality
- no dependable live inventory/rate contract
- manual response mode only
- lower confidence and slower response path

Operational meaning:

- use as fallback or rescue supply
- do not assume structured availability
- manual quote mode only

## Routing Order

### Standard path

1. send to selected or primary THM onboarded property
2. if SLA expires or response is not usable, escalate to nearby onboarded properties
3. if still unresolved, escalate to nearby CRM lead properties

### Important rule

CRM lead properties must not be treated the same as onboarded properties.

They can receive the demand, but their response contract is manual and lower-confidence.

## Core Entities

### Enquiry

Existing LMS accommodation enquiry remains the base demand record.

It continues to hold:

- enquiry identity
- guest context
- stay dates
- requested property context
- booking linkage after conversion

### RoutingSession

New BookMax orchestration entity.

One routing session exists per rescue or redistribution attempt.

Suggested fields:

- `id`
- `enquiryId`
- `guestId` if available
- `primaryPropertyId`
- `requestedCity`
- `requestedLocality`
- `status`
- `currentLevel`
- `slaStartedAt`
- `slaDueAt`
- `businessMinutesRemaining`
- `acceptedOfferId`
- `closedAt`
- `closedReason`

### RoutingTarget

New BookMax orchestration entity.

One row per property the enquiry is sent to.

Suggested fields:

- `id`
- `routingSessionId`
- `propertyId`
- `targetType` = `ONBOARDED` | `CRM_LEAD`
- `routingLevel` = `PRIMARY` | `L1` | `L2`
- `sentAt`
- `status`
- `distanceKm`
- `rankingScore`
- `responseAt`
- `responseSummary`
- `respondedBy`

### PropertyResponse

Normalized captured response from a property.

Suggested fields:

- `id`
- `routingTargetId`
- `responseType` = `AVAILABLE` | `NOT_AVAILABLE` | `ALT_ROOM` | `NEED_CLARIFICATION` | `MANUAL_QUOTE`
- `quotedAmount`
- `taxAmount`
- `roomType`
- `cancellationPolicy`
- `notes`
- `validUntil`
- `rawPayload`

### Offer

Normalized guest-facing offer assembled by BookMax from property responses.

Suggested fields:

- `id`
- `routingSessionId`
- `propertyId`
- `sourceType`
- `roomType`
- `baseAmount`
- `taxAmount`
- `totalAmount`
- `cancellationPolicy`
- `confidenceLevel`
- `paymentSupported`
- `offerStatus`
- `validUntil`

## State Model

### Routing session states

- `NEW`
- `SENT_TO_PRIMARY`
- `PRIMARY_RESPONDED`
- `ESCALATED_L1`
- `ESCALATED_L2`
- `OFFERS_READY`
- `OFFER_ACCEPTED`
- `PAYMENT_PENDING`
- `BOOKED`
- `EXPIRED`
- `CLOSED`

### Routing target states

- `PENDING`
- `SENT`
- `VIEWED`
- `RESPONDED_AVAILABLE`
- `RESPONDED_UNAVAILABLE`
- `RESPONDED_ALT`
- `TIMED_OUT`
- `DECLINED`

### Offer states

- `OPEN`
- `SELECTED`
- `EXPIRED`
- `REJECTED`

## SLA Model

### Working-hour constraint

Default SLA runs only during business hours:

- `08:00 AM` to `10:00 PM`

The timer must be business-time aware, not just wall-clock aware.

Required behavior:

- pause outside business hours
- resume next business window
- store computed due time, not just start time

### Default response rule

- primary property gets the first SLA window
- if no usable response arrives in time, BookMax triggers escalation automatically

## Reuse of Existing Flow

The existing platform already has pieces we should reuse.

### Reuse directly

- LMS accommodation enquiry as the durable demand record
- existing property outreach persistence/history
- existing send-to-property flows
- existing email/WhatsApp notification channels
- existing THM booking creation after confirmation

### Improve with orchestration

Existing behavior is currently closer to:

- send enquiry
- persist outreach
- manually follow up

Target behavior should become:

- create routing session
- send to primary target
- run SLA
- auto-escalate
- collect responses
- normalize offers
- preserve one audit thread

## API Strategy

### Existing APIs to keep using underneath

- LMS enquiry APIs for demand persistence
- existing send-to-property / lead APIs
- property outreach history APIs
- WhatsApp/email send mechanisms
- THM booking creation APIs

### New orchestration APIs to add in BookMax

- `POST /api/v1/bookmax/routing/start`
- `GET /api/v1/bookmax/routing/{sessionId}`
- `POST /api/v1/bookmax/routing/{sessionId}/escalate`
- `POST /api/v1/bookmax/routing/{sessionId}/targets/{targetId}/response`
- `GET /api/v1/bookmax/routing/{sessionId}/offers`
- `POST /api/v1/bookmax/routing/{sessionId}/offers/{offerId}/accept`

### Cockpit-facing operational APIs

These may read from the same routing tables, but the cockpit should not become the orchestration owner.

Cockpit needs to support:

- live routing session view
- SLA countdown view
- target history
- manual resend / reroute
- reveal guest-details trigger for trusted/manual cases
- offer review
- override closure

## Guest and Property Communication Rules

### Guest

THM/BookMax remains the guest-facing owner.

That means:

- guest sees one unified offer list
- guest is not sent into fragmented property conversations
- payment link remains platform-owned

### Property

Property communication should continue to reuse the existing outreach stack, but through routing-session logic.

Default rule:

- send enquiry context without guest details by default
- reveal guest details only on explicit ops trigger or trusted flow

## Booking and Financial Ownership

This engine stops at offer acceptance and booking handoff.

After guest selects an offer:

1. BookMax records `offer_acceptance`
2. THM booking flow creates or finalizes booking
3. LMS enquiry is updated with booking linkage
4. payment and payout remain in the THM booking domain

This document does not move payout or bank-reconciliation ownership out of THM.

## THM Cockpit Role

THM Cockpit is the ops control surface for this engine.

It should provide:

- enquiry queue
- routing monitor
- target response timeline
- manual rescue actions
- property outreach visibility
- payment follow-up and booked handoff

It should not own:

- routing session truth
- target ranking rules
- automatic escalation logic

## Ranking and Eligibility

The ranking formula can evolve, but the first version should explicitly consider:

- distance
- property class or operational score
- response reliability
- booking conversion confidence
- supply type preference

Eligibility should at minimum distinguish:

- CRM lead
- onboarding in progress
- THM onboarded
- active supply

## Initial Delivery Plan

### Phase 1

- preserve existing outreach APIs
- introduce `RoutingSession`
- introduce `RoutingTarget`
- start with primary send + manual escalation

### Phase 2

- business-time SLA automation
- level-1 auto-redistribution to onboarded properties
- cockpit routing monitor

### Phase 3

- level-2 redistribution to CRM lead properties
- normalized response capture
- guest offer aggregation

### Phase 4

- offer acceptance and THM booking handoff
- analytics and ranking optimization

## Non-Goals for Initial Implementation

- real-time inventory synchronization for CRM lead properties
- payout redesign
- replacing THM booking orchestration
- replacing existing LMS enquiry persistence

