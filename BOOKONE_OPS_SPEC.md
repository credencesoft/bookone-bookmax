# BookOne Internal Operations Platform — Complete Specification
## For Replit Implementation

> **Purpose:** Rebuild the internal BookOne operations platform as a clean, modern web application  
> **Target users:** Internal sales team, ops delivery team, account managers, leadership  
> **Design reference:** The `/engage/leads` pipeline page (frosted-glass header, gradient pipeline columns, pill-tag cards)  
> **Constraint:** Must remain API-compatible with existing Spring Boot backend (`java-lms`) — no breaking changes to existing endpoints

---

## 1. System Overview

BookOne is a hospitality SaaS company selling property management software (PMS, Channel Manager, Booking Engine, etc.) to hotels. This platform manages the full internal lifecycle:

```
Lead captured → Qualified → Demo → Proposal → Deal closed (contract + payment)
  → Ops case auto-created → Product tasks assigned → Property goes live
    → Ongoing support cases tracked → Reporting at all cadences
```

### Tech stack (existing, must be honoured)
| Layer | Stack |
|---|---|
| API | Spring Boot 2.4.4 / Java 8 / JPA Hibernate / MySQL |
| Auth | JWT token stored in localStorage, sent as `Authorization: Bearer <token>` |
| Angular app | Angular 20, Angular Material, PrimeNG, CDK DragDrop |
| File uploads | Cloud bucket via existing `FileService.fileUploadToCloud()` → returns URL string |
| Base API URL | `API_URL_LMS` env variable (e.g. `https://api.bookone.io`) |

---

## 2. Data Models (existing, non-breaking)

### 2.1 BusinessLeads (sales lead)
```
id, organisationId, propertyId
name (property/company name)
ownerName, ownerMobile, ownerEmail
city, state, country, address
source (WhatsApp | Instagram | Referral | Website | Cold Call | …)
status (string — see §3.1 for all values)
priority (Low | Medium | High)
productLines: string[]  (PMS | Channel Manager | Booking Engine | Website | POS | SMO | Qracle | OTASetup | Google Hotels | HotelMate | Email/GSuite | DigitalMarketing | PaymentGateway | SEO | Revenue Management)
accountManagerId, accountManagerName
assignedDate, dateCollected
nextFollowUpDate, lastFollowUpDate
demoDate, demoPerformed (int)
proposalSentDate, proposalAmount
advanceAmount, paymentMode, paymentStatus
contractUrl, contractSignedAt
paymentProofUrl
caseId (FK → ServiceManagement.id once onboarded)
handoffNotes, goLiveTargetDate
trainingStatus, emailStatus
feedBack, comments
score (computed 0–100)
```

### 2.2 ServiceManagement (ops case)
Full field list from `ServiceManagement.java` entity + `ServiceManagementDto`:
```
id                   Long          PK, auto-increment
organisationId       Long          multi-tenant key — ALWAYS filter by this
propertyId           Long          nullable, links to property
name                 String        case/property name (display title)
serviceRequestNo     String        auto-generated SR-XXXXXX (via generateServiceReservationNumber)
status               String        "New" | "Inprogress" | "On Hold" | "Closed" | "Resolved"
priority             String        "Low" | "Medium" | "High" | "Critical"
platform             String        "Bookone" | "HotelMate"
assignedTo           List<String>  stored as @ElementCollection — list of user names (not IDs)
createdBy            String        username of creator
number               String        optional reference number
dateCreate           Date          creation date
dueDate              Date          expected resolution date
dateFixed            Date          actual fix date (set when closed/resolved)
description          MEDIUMTEXT    full issue description
resolution           MEDIUMTEXT    resolution notes
comments             MEDIUMTEXT    internal discussion comments
feedBack             MEDIUMTEXT    client feedback
timeTakenToResolve   Double        hours taken to resolve
orderBookingNo       String        linked booking/order reference
jiraNo               String        Jira ticket reference
serviceType          List<String>  @ElementCollection — e.g. ["Setup", "Training", "Bug Fix"]
amount               BigDecimal    billable amount (if applicable)
demoPerfrmed         int           number of demos performed (note: typo in source, kept for compatibility)
issueDescriptionUrl  String        cloud URL to screenshot/recording of issue
issueResolutionUrl   String        cloud URL to screenshot/recording of resolution
updatedToClient      String        "Yes" | "No" — has client been notified of update
sentToTheClient      String        "Yes" | "No" — has resolution been sent to client
leadId               Long          nullable FK → BusinessLeads.id (set when case auto-created from deal)
trackerToken         String        internal tracking reference
startedAt            Timestamp     when ops work started on this case
completedAt          Timestamp     when case was resolved/closed
slaDueAt             Timestamp     SLA deadline for this case
performanceScore     Integer       0–100 score for ops team performance on this case
handoffNotes         MEDIUMTEXT    notes from sales → ops handoff
internalNotes        MEDIUMTEXT    internal ops notes (not visible to client)
clientMobile         String        client contact number
goLiveTargetDate     java.sql.Date target go-live date for property
```

### 2.3 ServiceTask (task within a case)
Full field list from `ServiceTask.java` entity + `ServiceTaskDto`:
```
id                   Long          PK, auto-increment
serviceManagementId  Long          FK → ServiceManagement.id  (REQUIRED — links task to case)
productCode          String        short code e.g. "PMS", "CM", "BE", "WEB"
productName          String        full name e.g. "Property Management System"
title                String        task description e.g. "Room Configuration", "Rate Plan Setup"
slaHours             Integer       hours allowed to complete this task
status               String        "NOT_STARTED" | "IN_PROGRESS" | "DONE" | "BLOCKED"
performanceScore     Integer       0–100 score for task completion quality
canStartAt           Timestamp     earliest date/time this task can begin
slaDueAt             Timestamp     SLA deadline for this task (canStartAt + slaHours)
startedAt            Timestamp     auto-set server-side when status → "IN_PROGRESS" (if null)
completedAt          Timestamp     auto-set server-side when status → "DONE" (if null)
```

**JSON date format:** All timestamp fields serialised as `"yyyy-MM-dd HH:mm:ss"` (from `@JsonFormat` on DTO)

### 2.4 ProductOnboardingTask (template)
```
id, productCode, taskTitle, slaHours
dependsOnTaskId, assigneeRole, sortOrder, active
checklistItems → ProductServiceChecklist[]
```

### 2.5 ProductServiceChecklist (checklist per task)
```
id, productOnboardingTaskId
itemCode, title, blocksGoLive (bool), sortOrder
```

### 2.6 BusinessFollowUp
```
id, businessLeadId
followUpDate, nextFollowUpDate
notes, followUpBy
status
```

---

## 3. Process Flows

### 3.1 Sales Lead Lifecycle

**Status values (in order):**
```
Loaded → Follow Up → Field Visit → Demo Fixed → Demo Performed
→ SendProposal → Sent → Received → Onboarding → Onboard
→ Onboarded (terminal — property live)

Side exits: Not Reachable | Switch Off | Excluded | Closed
Special: Referral | Under Construction | Under Renovation | Training
```

**Pipeline kanban mapping:**
```
New Inquiries    → Loaded, Not Reachable, Switch Off
Qualified (MQL)  → Follow Up, Referral
Proposal/Discuss → SendProposal, Sent, Received, NotReceived, Field Visit, Under Construction, Under Renovation
Demo/Onboarding  → Demo Fixed, Demo Performed, Onboarding, Training
Closed/Won       → Onboarded, Onboard, Closed
```

**Automated transitions:**
1. Sales rep sets status → `Onboard` on any lead that is NOT already `Onboard` or `Onboarded`
2. System validates: `productLines` must not be empty (block if empty)
3. **Deal Closure Dialog opens** — collects:
   - Contract PDF upload → `contractUrl`
   - Payment proof upload → `paymentProofUrl`
   - Go-live target date → `goLiveTargetDate`
   - Handoff notes
4. On submit → `POST /api/v1/businessLead/{leadId}/close-deal`
5. API auto-creates a `ServiceManagement` case + `ServiceTask` rows per product line per `ProductOnboardingTask` template
6. Lead's `caseId` field is populated with the new case ID

### 3.2 Follow-Up Process
- Each lead has a `nextFollowUpDate` and `lastFollowUpDate`
- Follow-ups are logged as `BusinessFollowUp` records with date, notes, outcome
- "Follow Up Due Today" metric shown on dashboard
- Daily digest: all leads with `nextFollowUpDate = today`

### 3.3 Demo Tracking
- Demo scheduled → `demoDate` set, status → `Demo Fixed`
- Demo completed → `demoPerformed++`, status → `Demo Performed`
- Demo tracker page shows all scheduled + completed demos by date range

### 3.4 Ops Case + Task Process — Full Coupled Flow

The `ServiceManagement` (case) and `ServiceTask` (tasks) entities are tightly coupled. A case is the parent; tasks are its children. This section explains the full lifecycle from every entry point.

---

#### 3.4.1 Case Status State Machine

```
         ┌──────────────────────────────────────────────┐
         │                                              │
   [CREATE]                                             │
         │                                              │
         ▼                                              │
       "New" ──────────────────────────────────► "On Hold"
         │                                              │
         ▼                                              ▼
    "Inprogress" ────────────────────────────► "On Hold"
         │                                              │
         ▼                                              │
    "Resolved" ◄──────────────────────────────────────-┤
         │                                              │
         ▼                                              │
      "Closed" ◄──────────────────────────────────────-┘
```

**Valid status values (exact strings stored in DB):**
- `"New"` — just created, not yet being worked on
- `"Inprogress"` — actively being worked on (note: no space, no capital P)
- `"On Hold"` — blocked waiting for client or dependency
- `"Resolved"` — fix applied, waiting for client confirmation
- `"Closed"` — fully done, no further action needed

**Kanban column mapping:**
```
Kanban column "New"         → status = "New"
Kanban column "In Progress" → status = "Inprogress"   ← id in caseColumns array
Kanban column "On Hold"     → status = "On Hold"
Kanban column "Closed"      → status = "Closed"
```

**Important:** "Resolved" is a valid DB status but is NOT a separate kanban column — resolved cases appear in "Closed" column visually. Replit UI must handle this gracefully (e.g. show "Resolved" as a sub-chip on the Closed card).

---

#### 3.4.2 Task Status State Machine

```
  "NOT_STARTED" ──────────────────────────────────► "BLOCKED"
       │                                                  │
       ▼                                                  │
  "IN_PROGRESS" ──────────────────────────────────► "BLOCKED"
       │                                                  │
       ▼                                                  │
    "DONE"       ◄─────────────────────────────────────-─┘
```

**Valid status values (UPPERCASE, underscore):**
- `"NOT_STARTED"` — default when task is created
- `"IN_PROGRESS"` — actively being worked; `startedAt` auto-set server-side on first transition
- `"DONE"` — completed; `completedAt` auto-set server-side on first transition
- `"BLOCKED"` — cannot proceed (dependency, client issue, etc.)

**Auto-timestamp rules (enforced by server, not UI):**
- On `PATCH /tasks/{id}/status?status=IN_PROGRESS`: if `startedAt` is null → server sets `startedAt = now()`
- On `PATCH /tasks/{id}/status?status=DONE`: if `completedAt` is null → server sets `completedAt = now()`
- These also apply on full `PATCH /tasks/{id}` (body update) — same logic runs before save
- UI must **refresh the task after save** to show the server-set timestamps

---

#### 3.4.3 Case Creation — Two Pathways

**Pathway A — Manual creation (existing flow):**
```
User → Service Management List (/ops/cases)
  → Click "+ New Case"
  → Fill form: name, platform, assignedTo, serviceType, priority, description, dueDate
  → POST /api/service/create
  → serviceRequestNo auto-generated (SR-XXXXXX pattern)
  → Case appears in Kanban with status "New"
  → Tasks added manually via Case Detail page
```

**Pathway B — Auto-creation from Lead close-deal (onboarding flow):**
```
Sales Rep → Lead Detail (/sales/lead/:id)
  → Click "Start Onboarding"
  → Deal Closure Dialog:
      Step 1: Upload contract PDF → contractUrl
              Upload payment proof → paymentProofUrl
      Step 2: Set goLiveTargetDate + handoffNotes
      Step 3: Review product checklist
      Step 4: Confirm → POST /api/v1/businessLead/{leadId}/close-deal
  → API side effects:
      a. Lead status → "Onboard"
      b. Lead.caseId populated with new ServiceManagement.id
      c. ServiceManagement created with leadId = lead.id
      d. ServiceTask rows auto-created from ProductOnboardingTask templates
         (one task per productLine per template)
  → Ops team immediately sees new case in Kanban "New" column
  → Sales rep sees "View Case →" CTA on lead (links to /ops/case/:caseId)
```

---

#### 3.4.4 The Three Service Management Pages — Entry Points and Navigation

The three pages are designed to work as a unified flow. Replit must implement all three and link them together:

```
Page 1: /ops/cases  ──────────────────────────────────────────────────────
  "Service Management List" (table view, paginated)
  
  Entry via: Sidebar nav, Business Lead header CTA, Service Management header
  
  Shows: All cases for this organisation, filterable, paginated
  Columns: SR#, Date, Property Name, Assigned To, Service Types, Status,
           Due Date, Priority, Time to Resolve, Actions
  
  Actions per row:
  ├── open_in_new icon → /ops/case/:id          (Case Detail — full Jira-style edit)
  ├── eye icon → view dialog (read-only, existing)
  ├── edit icon → edit dialog (existing form)
  └── delete icon → delete with confirmation
  
  Header CTAs:
  ├── "+ New Case" → opens AddServiceRequest dialog
  └── "Ops Kanban" → /ops/kanban

Page 2: /ops/kanban  ─────────────────────────────────────────────────────
  "Ops Kanban" (kanban board — cases then drill into tasks)
  
  Entry via: Sidebar nav, "Ops Kanban" CTA from /ops/cases, "Ops Kanban" CTA
             from Business Lead Management header
  
  State A — Case Board (no selectedCase):
    Shows 4 columns: New | In Progress | On Hold | Closed
    Each case card: avatar, name, SR#, assignedTo, platform chip, priority pill,
                    dueDate, trackerToken, "Tasks" hint, external-link icon
    Drag card → PATCH /api/service/{id}/status
    Click card → drill into State B
    Click external-link icon → /ops/case/:id (without drilling into tasks)
    
  State B — Task Board (selectedCase is set):
    Shows 4 columns: NOT_STARTED | IN_PROGRESS | DONE | BLOCKED
    Each task card: avatar, title, productCode chip, status pill,
                    slaHours chip, performanceScore pill,
                    startedAt, completedAt, slaDueAt dates
    Drag task card → PATCH /api/service/tasks/{taskId}/status
    "Back to Cases" button → returns to State A
    "Case Details" button → /ops/case/:id

Page 3: /ops/case/:id  ───────────────────────────────────────────────────
  "Case Detail" (Jira-style detail + task editing)
  
  Entry via: open_in_new icon from /ops/cases table,
             "Case Details" button from Kanban task board,
             external-link icon on case card in Kanban
  
  Left panel:
    - Case title (large inline edit input)
    - Description, Resolution, Comments, Feedback (MEDIUMTEXT textareas)
    - Handoff Notes, Internal Notes (MEDIUMTEXT textareas)
    - Issue Description URL, Issue Resolution URL (URL inputs)
    - Tasks panel → shows all ServiceTask rows for this case
        Each task = clickable row → expands inline edit panel
        Expanded panel fields:
          title, productCode, productName,
          status (select: NOT_STARTED|IN_PROGRESS|DONE|BLOCKED),
          slaHours (number), performanceScore (0–100 number),
          canStartAt (datetime), slaDueAt (datetime),
          startedAt (datetime), completedAt (datetime)
        [Save Task] → PATCH /api/service/tasks/{taskId}
        [Cancel] → collapses panel, discards edits
  
  Right sidebar:
    Details:    status, priority, platform, assignedTo (multi-select from users),
                createdBy, clientMobile
    Dates:      dateCreate, dueDate, dateFixed, goLiveTargetDate
    References: serviceRequestNo, orderBookingNo, jiraNo, trackerToken,
                amount, timeTakenToResolve
    Client:     updatedToClient (Yes/No), sentToTheClient (Yes/No)
    Lead link:  if leadId != null → "← View Lead" CTA → /sales/lead/:leadId
  
  Header:
    Breadcrumb: "Service Management → SR-XXXXXX"
    Status chip (coloured), Priority badge
    [Save Case] → POST /api/service/create (upsert — uses id field if present)
```

---

#### 3.4.5 Data Flow Diagrams

**Case data flow — read:**
```
GET /api/service/findById/{id}
  → ServiceManagementService.findById(id)
  → ServiceManagementRepository.findById(id)
  → ModelMapper → ServiceManagementDto
  → Response {
      id, organisationId, propertyId, name, serviceRequestNo,
      status, priority, platform, assignedTo[], createdBy,
      dateCreate, dueDate, dateFixed, description, resolution,
      comments, feedBack, timeTakenToResolve, orderBookingNo,
      jiraNo, serviceType[], amount, issueDescriptionUrl,
      issueResolutionUrl, updatedToClient, sentToTheClient,
      leadId, trackerToken, startedAt, completedAt, slaDueAt,
      performanceScore, handoffNotes, internalNotes,
      clientMobile, goLiveTargetDate
    }
```

**Task data flow — read:**
```
GET /api/service/{caseId}/tasks
  → ServiceTaskRepository.findByServiceManagementId(caseId)
  → ModelMapper → ServiceTaskDto[]
  → Response [
      { id, serviceManagementId, productCode, productName,
        title, slaHours, status, performanceScore,
        canStartAt, slaDueAt, startedAt, completedAt }
    ]
```

**Task status update — drag-drop:**
```
PATCH /api/service/tasks/{taskId}/status?status=IN_PROGRESS
  → find task by id
  → task.status = "IN_PROGRESS"
  → if task.startedAt == null → task.startedAt = now()
  → save → return ServiceTaskDto
  ← UI: update card in new column, show new startedAt date
```

**Full task update — from Case Detail:**
```
PATCH /api/service/tasks/{taskId}
  Body: { title, productCode, productName, status,
          slaHours, performanceScore, canStartAt,
          slaDueAt, startedAt, completedAt }
  → null-safe: only non-null fields overwrite existing values
  → same startedAt/completedAt auto-set logic applies
  → return updated ServiceTaskDto
  ← UI: replace task in tasks[] array with returned object
```

**Case status update — drag-drop:**
```
PATCH /api/service/{id}/status?status=Inprogress
  → find case by id
  → case.status = "Inprogress"
  → save → return ServiceManagementDto
  ← UI: update card in new column (optimistic — revert on error)
```

**Case save — from Case Detail:**
```
POST /api/service/create
  Body: full ServiceManagementDto (with id field set → acts as upsert)
  → ServiceManagementService.createServiceManagement(dto)
  → if dto.id != null → treated as update
  → return saved ServiceManagementDto
```

---

#### 3.4.6 Search Criteria API — Full Parameter List

`GET /api/service/getBySearchCriteria` accepts all of these (all optional except organisationId, page, size):

```
organisationId   Long           REQUIRED
propertyId       Long           optional — filter by property
name             String         optional — partial match on name
fromDate         Date           optional — dateCreate >= fromDate
toDate           Date           optional — dateCreate <= toDate
status           String         optional — exact status match
assignedToList   List<String>   optional — multiple assignee names (repeated param)
serviceList      List<String>   optional — multiple service types (repeated param)
serviceRequestNo String         optional — partial/exact SR# match
platform         String         optional — "Bookone" | "HotelMate"
page             int            REQUIRED — 0-indexed
size             int            REQUIRED — records per page

Response: ServiceManagementPaginatedResponseDto {
  services: ServiceManagementDto[]
  pageNumber: int
  pageSize: int
  totalElement: int
  totalPages: int
}
```

For the Kanban board, call with `page=0&size=500` to load all cases at once (no pagination on kanban).

### 3.5 Property Onboarding Checklist
Per product line, a checklist of tasks must be completed:

**PMS (10 items):** Account setup, Room configuration, Rate plans, Tax setup, Payment gateway, Staff training, OTA connect, Test booking, Reporting setup, Go-live sign-off  
**Channel Manager (4 items):** Channel mapping, Rate sync, Availability sync, Test reservation  
**Booking Engine (3 items):** Website embed, Payment test, Live booking verification  
**Engage/Marketing (3 items):** WhatsApp integration, Campaign setup, First blast  
**General/Other (3 items):** Domain email setup, Training session, Handoff call  

Some items are `blocksGoLive: true` — these must be complete before the case can move to `Closed`.

---

## 4. Pages & Features Required

### 4.1 SALES PIPELINE (`/sales/pipeline`)

**Design:** Engage-style — frosted glass header, gradient columns, pill-tag cards

**Header:**
- Title: "Sales Pipeline" / subtitle: "Real-time Lead Conversion"
- Search bar (property name, city, owner, phone)
- Filters: Status dropdown, Source dropdown, Assignee dropdown, Product Lines multi-select, Client Response (Cold/Warm/Hot), Min Score slider
- Saved filter presets (save/load/delete)
- View toggle: Kanban / List
- Buttons: New Lead, Export CSV, Bulk Assign panel (assign N leads to account manager)

**Kanban view (5 columns):**
Each column shows count badge, card for each lead:
- Card: Avatar (initial), Property name, Owner name, Source pill, Product lines count, Location, Score pill, Date pill
- Footer: Assignee dropdown (inline), selection checkbox, action buttons (call, message, view)
- Drag between columns → updates status via API + shows "Saving…" indicator

**List view:**
- Table: Selection, Lead, Source, Interest (product lines), Assignee, Score, Status, Last Activity, Actions
- Status chip coloured by stage
- Inline assignee dropdown
- Pagination / load more

**Metric strip (list view):**
- Total Leads, MQL Count, Demo Booked, Closed Won, Pipeline Value (₹)

**Lead Score algorithm (display only):**
- +20 if demo performed, +20 if proposal sent, +20 if advance received, +15 if follow-up done this week, +15 if client response = Hot, +10 if product lines > 2

### 4.2 LEAD DETAIL (`/sales/lead/:id`)

**Design:** Jira-style — left content + right sidebar, sticky header

**Header:** Breadcrumb, status chip, priority badge, Save button

**Left — main content:**
- Property name (large editable title)
- Owner details (name, mobile, email)
- Description / notes (rich text area)
- Comments, Feedback
- Contract URL (link + upload trigger)
- Payment Proof URL (link + upload trigger)

**Left — Follow-up timeline:**
- Chronological list of all `BusinessFollowUp` entries
- Add follow-up form: date, next follow-up date, notes, outcome
- Each entry shows: who logged it, when, outcome

**Left — Demo history:**
- List of demos with date, status, notes
- Schedule new demo button

**Right sidebar — Details:**
- Status (select), Priority (select), Source
- Account Manager (select from users)
- Product Lines (multi-select checkboxes)
- Client Response (Cold/Warm/Hot)

**Right sidebar — Dates:**
- Date Collected, Assigned Date, Next Follow-up, Go-Live Target

**Right sidebar — Financial:**
- Advance Amount, Payment Mode, Payment Status
- Proposal Amount

**Right sidebar — Links:**
- Case ID (clickable → ops case detail)
- Jira No, Tracker Token

**Bottom — Onboard CTA:**
If not yet onboarded: prominent "Start Onboarding" button → opens Deal Closure Dialog

### 4.3 DEAL CLOSURE DIALOG (modal)

Triggered from Lead Detail or Lead List when clicking "Onboard"

**Steps:**
1. **Upload** — Contract PDF (file upload → cloud), Payment Proof (file upload → cloud)
2. **Go-Live** — Date picker for go-live target date, Handoff notes textarea
3. **Checklist** — Accordion per product line showing all `ProductOnboardingTask` items + checklist sub-items with blocker badges
4. **Confirm** — Review summary, submit button

On submit:
- `POST /api/v1/businessLead/{leadId}/close-deal?contractUrl=…&paymentProofUrl=…&handoffNotes=…&goLiveTargetDate=…`
- Lead status → `Onboard`
- Ops case + tasks auto-created
- Dialog closes, lead row refreshes, "View Case →" CTA appears

### 4.4 OPS KANBAN (`/ops/kanban`)

**Design:** Engage pipeline style (frosted header, gradient columns, avatar cards, pill tags)

**Case board (4 columns):**  
`New → Inprogress → On Hold → Closed`

Each case card:
- Avatar (first letter of name)
- Case name, Service Request No
- Assigned to (names)
- Platform chip (Bookone | HotelMate)
- Priority pill
- Due date, Tracker token
- "View Tasks →" label + "open in new" icon → Case Detail

Drag card → updates case status via `PATCH /api/service/{id}/status`

**Task board (4 columns, click case to enter):**  
`NOT_STARTED → IN_PROGRESS → DONE → BLOCKED`

Each task card:
- Avatar, task title, product code
- SLA hours chip, status pill
- Started at, completed at, SLA due date
- Performance score pill

Drag task → `PATCH /api/service/tasks/{taskId}/status`  
`startedAt` auto-set when → `IN_PROGRESS`  
`completedAt` auto-set when → `DONE`

**Header filters:** Search, Platform, Assigned To, Date range

**Metric strip:** Count per column + total

**Skeleton loading per column** while API loads

**Back button** from task board → returns to case board

### 4.5 CASE DETAIL (`/ops/case/:id`)

**Design:** Jira-style — sticky header + left content + right sidebar

**Sticky header:**
- Breadcrumb (Service Management → Case #SR-XXXXXX)
- Status chip, Priority badge
- "Save Case" button (saves all fields in one call)

**Left — editable fields:**
- Case title (large inline input)
- Description, Resolution, Comments (rich text areas)
- Handoff Notes, Internal Notes, Client Feedback
- Issue Description URL, Issue Resolution URL

**Left — Tasks panel:**
- Header: "Tasks (N)"
- Each task = clickable row: avatar, title, product chip, status chip, SLA badge
- Click → expands inline panel with all task fields editable:
  - Title, Product Code, Product Name
  - Status (select: NOT_STARTED | IN_PROGRESS | DONE | BLOCKED)
  - SLA Hours, Performance Score (0–100)
  - Can Start At, SLA Due At, Started At, Completed At (datetime inputs)
- Save Task button, Cancel button
- Auto-sets `startedAt` / `completedAt` based on status change

**Right sidebar — Details:**
- Status, Priority, Platform, Assigned To (select from users)
- Created By, Client Mobile

**Right sidebar — Dates:**
- Date Created, Due Date, Date Fixed, Go-Live Target

**Right sidebar — References:**
- Service Request No, Order/Booking No, Jira No
- Tracker Token, Amount, Time to Resolve (h)

**Right sidebar — Client Comms:**
- Updated to Client (Yes/No), Sent to Client (Yes/No)

### 4.6 PROPERTY ONBOARDING TRACKER (`/ops/onboarding`)

**Purpose:** See all properties currently being onboarded — one row per `ServiceManagement` case that came from a lead (`leadId != null`), grouped by stage.

**View:** Card grid with progress bars

Each property card shows:
- Property name, owner, city
- Product lines (chip list)
- Go-live target date + countdown ("X days")
- Overall completion % (tasks DONE / total tasks)
- Per-product progress bar (e.g. PMS 7/10, CM 3/4)
- Assigned ops team member
- Quick links: Case Detail, Lead Detail
- Status: On Track | At Risk (if any blocker task is not DONE and go-live < 7 days) | Overdue

**Filters:** Platform, Assigned To, Status, Go-Live month

**Alert banner** at top if any property has `blocksGoLive` tasks incomplete and go-live < 3 days

### 4.7 SERVICE MANAGEMENT LIST (`/ops/cases`)

**Design:** Same frosted header + table as engage list view

**Header buttons:** + New Case, Ops Kanban, View Reports, Excel Export

**Filters:** Status, Platform, Assigned To, Service Type, Date range, Search by name or SR#

**Table columns:** SR#, Date, Property Name, Assigned To, Service Types, Status, Due Date, Priority, Time to Resolve, Actions

**Row actions:**
- `open_in_new` → Case Detail page
- Eye → View (read-only form, existing)
- Edit → Edit form (existing)
- Delete (with confirmation)

**Pagination:** Server-side, 10/25/50 per page

### 4.8 REPORTING

#### 4.8.1 Daily Report (`/reports/daily`)

**Audience:** Sales team leader, ops manager

**Sections:**

**Today's Sales Activity:**
- Leads contacted today (grouped by account manager)
- Demos scheduled today
- Follow-ups due and completed today
- Proposals sent today
- Deals closed today

**Ops Activity:**
- Cases opened today
- Tasks completed today
- Tasks overdue (past SLA due date + not DONE)
- Cases closed today

**Format:** Summary cards at top + detail table expandable per section

#### 4.8.2 Weekly Report (`/reports/weekly`)

**Date range:** Mon–Sun (with week selector)

**Sales section:**
- Leads by status transition (funnel chart)
- Lead volume by source (bar chart)
- Demos performed vs. target
- Proposals sent vs. received
- Deals closed + revenue (advance amount sum)
- Account manager leaderboard table: name | leads contacted | demos | proposals | closed | revenue

**Ops section:**
- Cases opened vs. closed
- Average time to resolve (by platform, by service type)
- Tasks by product line (which product lines are busiest)
- SLA compliance rate (tasks completed before SLA due)
- Performance scores average by assignee
- Tasks Due Yesterday,Today,7 Days


**Property onboarding section:**
- Properties that went live this week
- Properties at risk (blocker tasks incomplete)
- Overall completion rate

#### 4.8.3 Monthly Report (`/reports/monthly`)

**Month selector + year**

**Sales:**
- Monthly pipeline funnel (leads at each stage, start vs. end of month)
- Revenue closed (advance amount) vs. target
- Top performing account managers
- Top performing cities/regions
- Product line demand breakdown (which products are selling)
- Conversion rate: Lead → Demo → Proposal → Won

**Ops:**
- Cases raised vs. resolved by platform
- Average resolution time trend (line chart, last 6 months)
- Issue type breakdown (pie chart)
- Property service report (issues per property)
- Top recurring issues (by service type count)

**Business health:**
- New properties onboarded
- Properties that renewed / churned (if tracked)
- Revenue trend (bar chart, last 12 months)

**Export:** Each report section has "Download Excel" button

---

## 5. Existing API Endpoints (all must remain working)

### Sales / Leads
```
GET    /api/v1/businessLead/findAll
GET    /api/v1/businessLead/findByOrganisationId?organisationId=
GET    /api/v1/businessLead/findByCriteria  (many query params)
GET    /api/v1/businessLead/findById/{id}
POST   /api/v1/businessLead/create
PUT    /api/v1/businessLead/update/{id}
DELETE /api/v1/businessLead/delete/{id}
GET    /api/v1/businessLead/report
GET    /api/v1/businessLead/city-report
GET    /api/v1/businessLead/followup-report
GET    /api/v1/businessLead/download/leadsToExcel
POST   /api/v1/businessLead/{leadId}/close-deal      ← NEW
GET    /api/v1/businessLead/product-checklist/{productCode}  ← NEW
```

### Service Management / Cases

All case endpoints are under `/api/service`. Auth header required on all.

```
GET    /api/service/findAll
         → List<ServiceManagementDto> — all cases across all orgs (admin only)

GET    /api/service/findById/{id}
         → ServiceManagementDto — single case by ID

GET    /api/service/findByPropertyId?organisationId=&propertyId=
         → List<ServiceManagementDto>

GET    /api/service/findByOrganisationId?organisationId=
         → List<ServiceManagementDto>

GET    /api/service/organisation/{organisationId}/dates?fromDate=&toDate=&propertyId=
         → List<ServiceManagementDto> — by date range

GET    /api/service/getBySearchCriteria?organisationId=&page=&size=[+optional filters]
         → ServiceManagementPaginatedResponseDto { services[], pageNumber, pageSize,
                                                   totalElement, totalPages }
         Optional params: propertyId, name, fromDate, toDate, status, platform,
                         assignedToList (repeatable), serviceList (repeatable),
                         serviceRequestNo

POST   /api/service/create
         Body: ServiceManagementDto (id=null → INSERT, id=123 → UPDATE/upsert)
         → ServiceManagementDto (201 on create)

DELETE /api/service/deleteById/{id}
         → 200 OK

PATCH  /api/service/{id}/status?status=Inprogress     ← Kanban case drag-drop
         → ServiceManagementDto

GET    /api/service/{caseId}/tasks                    ← Kanban task board / Case Detail
         → List<ServiceTaskDto>

PATCH  /api/service/tasks/{taskId}/status?status=IN_PROGRESS   ← Kanban task drag-drop
         → ServiceTaskDto (with auto-set startedAt / completedAt)

PATCH  /api/service/tasks/{taskId}                    ← Case Detail save task
         Body: ServiceTaskDto (null fields are ignored — partial update)
         → ServiceTaskDto (with auto-set timestamps if status changed)

GET    /api/service/getServiceManagementReport?propertyId=&fromDate=&toDate=&platform=
         → List<ServiceManagementReportDto>

GET    /api/service/getPropertyServiceReport?propertyId=&fromDate=&toDate=&platform=
         → List<PropertyServiceReportDto>

GET    /api/service/getIssueTypeReport?propertyId=&fromDate=&toDate=&platform=
         → List<IssueTypeReportDto>

GET    /api/service/download/serviceToExcel?organisationId=&[filters]
         → application/octet-stream (serviceManagement.xlsx)

GET    /api/service/downloadServiceManagementReportToExcel?propertyId=&fromDate=&toDate=&platform=
         → application/octet-stream (serviceManagementReport.xlsx)

GET    /api/service/downloadPropertyServiceExcelReport?propertyId=&fromDate=&toDate=&platform=
         → application/octet-stream (PropertyServiceReport.xlsx)

GET    /api/service/downloadIssueTypeExcelReport?propertyId=&fromDate=&toDate=&platform=
         → application/octet-stream (IssueTypeReport.xlsx)
```

**ServiceManagementDto shape (used for both request body and response):**
```json
{
  "id": 42,
  "organisationId": 1,
  "propertyId": 5,
  "name": "Grand Hotel - PMS Setup",
  "serviceRequestNo": "SR-000042",
  "status": "Inprogress",
  "priority": "High",
  "platform": "Bookone",
  "assignedTo": ["Alice", "Bob"],
  "createdBy": "john.smith",
  "number": "",
  "dateCreate": "2026-03-01",
  "dueDate": "2026-03-15",
  "dateFixed": null,
  "description": "Full PMS onboarding for Grand Hotel",
  "resolution": null,
  "comments": null,
  "feedBack": null,
  "timeTakenToResolve": null,
  "orderBookingNo": null,
  "jiraNo": "BOOK-1234",
  "serviceType": ["Setup", "Training"],
  "amount": null,
  "demoPerfrmed": 0,
  "issueDescriptionUrl": null,
  "issueResolutionUrl": null,
  "updatedToClient": "No",
  "sentToTheClient": "No",
  "leadId": 88,
  "trackerToken": "TRK-0042",
  "startedAt": "2026-03-02 09:00:00",
  "completedAt": null,
  "slaDueAt": "2026-03-10 17:00:00",
  "performanceScore": null,
  "handoffNotes": "Property needs VPN access for setup",
  "internalNotes": null,
  "clientMobile": "+64211234567",
  "goLiveTargetDate": "2026-03-20"
}
```

**ServiceTaskDto shape:**
```json
{
  "id": 101,
  "serviceManagementId": 42,
  "productCode": "PMS",
  "productName": "Property Management System",
  "title": "Room Configuration",
  "slaHours": 4,
  "status": "IN_PROGRESS",
  "performanceScore": null,
  "canStartAt": "2026-03-02 09:00:00",
  "slaDueAt": "2026-03-02 13:00:00",
  "startedAt": "2026-03-02 09:15:00",
  "completedAt": null
}
```

### Follow Ups
```
GET    /api/v1/businessFollowUp/findByBusinessLeadId/{id}
POST   /api/v1/businessFollowUp/create
PUT    /api/v1/businessFollowUp/update/{id}
DELETE /api/v1/businessFollowUp/delete/{id}
```

### Dashboard
```
GET    /api/dashboard  → DashboardResponse { totalLeads, newLeadsToday, followUpsDueToday, demosThisWeek, casesOpen, casesClosedThisWeek }
```

---

## 6. Design System

### Colour palette (from `/engage/leads`)
```scss
// Background
page-bg:       radial-gradient(top-left, rgba(24,69,108,0.07), transparent) + linear-gradient(#f7fafe → #eef4fa)

// Primary brand
primary:       #18456c       // buttons, active states
primary-hover: #122f4d

// Text
heading:       #0f2240
body:          #172b4d
muted:         #59708d / #627590
subtle:        #8394aa

// Cards / surfaces
card-bg:       #ffffff
card-border:   #dae5f1
column-bg:     linear-gradient(#f8fbff → #f4f7fb)
column-border: #d9e4f0

// Status pills (all border-radius: 6px, font-size: 11px, font-weight: 700)
pill-new:      bg #eef4ff  color #3b5fc7  border #d0ddff
pill-progress: bg #fff4df  color #c07c18  border #f7dfaf
pill-done:     bg #e6f8ed  color #1e9d68  border #cde9d5
pill-blocked:  bg #ffebe6  color #bf2600  border #ffc8b8
pill-default:  bg #f4f5f7  color #5e6c84  border #dfe1e6

pill-high:     bg #ffebe6  color #bf2600
pill-medium:   bg #fff4df  color #974f0c
pill-low:      bg #f4f5f7  color #5e6c84

// Frosted glass header
header-bg:     radial-gradient(top-left, rgba(255,255,255,0.98), ...) + linear-gradient(#fff → #f3f7fd → #edf4fb)
header-border: rgba(208,220,235,0.95)
header-shadow: 0 18px 40px rgba(12,31,56,0.08), inset 0 1px 0 rgba(255,255,255,0.8)
header-radius: 24px

// Kanban column
col-radius:    18px
col-shadow:    0 12px 28px rgba(8,17,47,0.05)

// Cards
card-radius:   16px
card-hover:    border-color #93b1d1, shadow 0 8px 18px rgba(14,34,62,0.08), translateY(-1px)
card-drag:     shadow 0 12px 28px rgba(13,31,58,0.18)

// Filter bar
filter-radius: 14px
filter-height: 40px
filter-shadow: 0 6px 16px rgba(18,39,67,0.035)
```

### Typography
```scss
page-title:    clamp(28px, 3vw, 42px), weight 800, letter-spacing -0.05em
section-title: 17px, weight 700, color #193152
card-title:    14px, weight 700, color #1a3353
card-meta:     12px, weight 400, color #627590
pill-text:     11px, weight 700
eyebrow:       10px, weight 700, uppercase, letter-spacing 0.09em, color #5c78a2
```

### Component patterns
```
Search bar:     flex + border + border-radius:14px + pi-search icon + plain input (no Material)
Filter pill:    same border-radius:14px, height 40px, pi icon + plain input
Button primary: height 40px, border-radius:12px, bg #18456c, shadow 0 12px 24px rgba(24,69,108,0.2)
Button ghost:   height 40px, border-radius:12px, border #d4dfeb, bg rgba(255,255,255,0.72)
Column count:   border-radius:999px, bg #e8edf5, color #425875, min-width 26px, height 26px
Avatar circle:  36px × 36px, border-radius:50%, bg #e8eef8, color #34557f, font-weight 800
Drag handle:    pi-grip-vertical, color #90a1b7
Empty state:    border 1px dashed #cfdaea, border-radius:14px, pi-inbox icon, centred
Metric pill:    border-radius:999px, border #d9e4f0, bg white, count 18px bold + label 11px uppercase
```

---

## 7. User Roles & Permissions

| Role | Access |
|---|---|
| **Sales Rep** | Own leads only: view/edit/add leads, log follow-ups, schedule demos, send proposals |
| **Account Manager** | All leads for their organisation: everything Sales Rep can do + bulk assign |
| **Ops Team** | All service cases + tasks: view/edit cases, drag kanban, update task status |
| **Manager / Admin** | Full access: all pages, all reports, all users' data, config |

Role is determined from JWT token claims. Pages that require a role show a "Not authorised" state if role is insufficient.

---

## 8. Navigation Structure

```
Sidebar:
├── Dashboard                /dashboard
├── Sales
│   ├── Pipeline             /sales/pipeline        ← main kanban
│   ├── All Leads            /sales/leads           ← list view
│   ├── Follow Ups           /sales/followups
│   └── Demo Tracker         /sales/demos
├── Ops Delivery
│   ├── Ops Kanban           /ops/kanban            ← case + task boards
│   ├── All Cases            /ops/cases             ← list
│   ├── Onboarding Tracker   /ops/onboarding
│   └── Case Detail          /ops/case/:id
├── Reports
│   ├── Daily                /reports/daily
│   ├── Weekly               /reports/weekly
│   └── Monthly              /reports/monthly
└── Settings
    └── Product Tasks        /settings/tasks        ← manage ProductOnboardingTask templates
```

---

## 9. Key UX Behaviours

### Drag and drop
- Visual placeholder (0.42 opacity) stays in source column during drag
- Drop saves to API; on error reverts card to original column
- "Saving stage update…" indicator shown while PATCH in flight

### Optimistic updates
- All status changes update UI immediately, then sync to API
- Failed syncs revert and show error toast

### Loading states
- Skeleton cards (shimmer animation) per column while board loads
- Animated loading bar in header during fetch

### Empty states
- Dashed border box with `pi-inbox` icon + "No cases" text per empty column
- Full page empty state if no leads match filters

### Responsive
- `< 1200px`: 2-column grid
- `< 700px`: 1-column grid, header stacks vertically

### Filter persistence
- Filters saved to `localStorage` keyed by page — restored on revisit
- "Reset" clears both localStorage and state

### Search
- Debounced 300ms on search input
- `Enter` key triggers immediate search

### Toast notifications
- Success: green, top-right, 3s auto-dismiss
- Error: red, top-right, 5s, manual dismiss

---

## 10. What to Build in Replit (Phase Plan)

### Phase 1 — Shell + Auth (Day 1)
- [ ] Project scaffold (React + Vite OR Next.js — pick what Replit handles best)
- [ ] Design system: colours, typography, base components (Button, Pill, Avatar, SearchBar, FilterPill, MetricPill, FrostedHeader, Column, Card, EmptyState)
- [ ] Login page (email + password → POST to existing auth endpoint → store JWT)
- [ ] Sidebar navigation with role-based visibility
- [ ] API service layer (Axios with JWT interceptor)

### Phase 2 — Sales Pipeline (Day 2)
- [ ] `/sales/pipeline` — 5-column kanban with drag-drop
- [ ] Lead cards with all metadata
- [ ] Filter bar + search + view toggle
- [ ] Metric strip (list view)
- [ ] `/sales/lead/:id` — full detail page

### Phase 3 — Deal Closure + Onboarding (Day 3)
- [ ] Deal Closure Dialog (multi-step: upload → dates → checklist → confirm)
- [ ] File upload to cloud (connect to existing `FileService`)
- [ ] Product checklist accordion per product line
- [ ] `POST /{leadId}/close-deal` integration

### Phase 4 — Ops Kanban + Case Detail (Day 4)

**Service Management → Case → Task is a 3-page tightly coupled flow. Build all three together.**

- [ ] `/ops/cases` — Service Management List (paginated table)
  - [ ] Filter bar: status, platform, assignedTo, serviceType, date range, search by name/SR#
  - [ ] Paginated table with columns: SR#, Date, Name, AssignedTo, ServiceTypes, Status, DueDate, Priority, TimeToResolve, Actions
  - [ ] Row actions: open_in_new → Case Detail, eye → view dialog, edit → edit dialog, delete
  - [ ] Header: "+ New Case" (opens form dialog), "Ops Kanban" button
  - [ ] Call `GET /api/service/getBySearchCriteria?organisationId=&page=&size=` for data

- [ ] `/ops/kanban` — dual-mode board (case board + task board)
  - [ ] **State A — Case Board** (no selected case)
    - [ ] 4 columns: New | In Progress | On Hold | Closed
    - [ ] Map "Inprogress" status value → "In Progress" column label
    - [ ] Map "Resolved" cases into "Closed" column with sub-chip showing "Resolved"
    - [ ] Case card: avatar (first letter), name, SR#, assignedTo, platform chip, priority pill, dueDate, trackerToken, "Tasks" hint label, external-link icon
    - [ ] Drag case → `PATCH /api/service/{id}/status?status=` (optimistic, revert on error)
    - [ ] Click card → enter State B (task board)
    - [ ] Click external-link icon → navigate to `/ops/case/:id`
    - [ ] Header filters: search, platform filter, assignedTo filter
    - [ ] Metric strip: count per column + total
    - [ ] Skeleton loading (4 columns × 3 skeleton cards) while loading
    - [ ] Call `GET /api/service/getBySearchCriteria?organisationId=&page=0&size=500` (no pagination on kanban)
  - [ ] **State B — Task Board** (case selected, rendered in same route)
    - [ ] Header changes: title = "Task Board", subtitle = case name, back button, "Case Details" button
    - [ ] 4 columns: NOT_STARTED | IN_PROGRESS | DONE | BLOCKED
    - [ ] Task card: avatar, title, productCode chip, status pill, slaHours chip, performanceScore pill, slaDueAt, startedAt, completedAt
    - [ ] Drag task → `PATCH /api/service/tasks/{taskId}/status?status=`
    - [ ] After drag response: replace task in column with returned DTO (to show server-set timestamps)
    - [ ] "Back to Cases" → clear selectedCase, return to State A
    - [ ] "Case Details" → navigate to `/ops/case/:id`
    - [ ] Task meta bar: total task count, platform, assignedTo
    - [ ] Call `GET /api/service/{caseId}/tasks` when case is selected

- [ ] `/ops/case/:id` — Case Detail (Jira-style)
  - [ ] Load: `GET /api/service/findById/{id}` + `GET /api/service/{id}/tasks` in parallel
  - [ ] Load users: existing users endpoint (for assignedTo dropdown)
  - [ ] **Sticky header:** breadcrumb (Service Mgmt → SR-XXXXXX), status chip, priority badge, [Save Case] button
  - [ ] **Left — case fields (editable):**
    - Large title input (`name` field)
    - Textareas: description, resolution, comments, feedBack, handoffNotes, internalNotes
    - URL inputs: issueDescriptionUrl, issueResolutionUrl
    - Number inputs: timeTakenToResolve, performanceScore, amount
  - [ ] **Left — Tasks panel:**
    - Header: "Tasks (N)" count
    - List of all ServiceTask rows for this case
    - Each task row (collapsed): avatar, title, productCode chip, status chip, slaHours badge, slaDueAt
    - Click row → expand inline edit panel (push rows below down)
    - **Expanded panel fields (10 fields in 2-col grid):**
      - title (text), productCode (text), productName (text)
      - status (select: NOT_STARTED | IN_PROGRESS | DONE | BLOCKED)
      - slaHours (number), performanceScore (number 0–100)
      - canStartAt (datetime-local), slaDueAt (datetime-local)
      - startedAt (datetime-local), completedAt (datetime-local)
    - [Save Task] → `PATCH /api/service/tasks/{taskId}` with full edited task object
    - After save: replace tasks[idx] with returned DTO (shows server-set timestamps)
    - [Cancel] → collapse panel, discard edits
    - Only one task expanded at a time
  - [ ] **Right sidebar — Details:** status (select), priority (select), platform (select: Bookone|HotelMate), assignedTo (multi-select from users list), createdBy (read-only), clientMobile
  - [ ] **Right sidebar — Dates:** dateCreate (read-only), dueDate (date), dateFixed (date), goLiveTargetDate (date)
  - [ ] **Right sidebar — References:** serviceRequestNo (read-only), orderBookingNo, jiraNo, trackerToken, amount, timeTakenToResolve
  - [ ] **Right sidebar — Client Comms:** updatedToClient (Yes/No toggle), sentToTheClient (Yes/No toggle)
  - [ ] **Right sidebar — Lead Link:** if `leadId != null` → show "← View Lead" CTA navigating to `/sales/lead/:leadId`
  - [ ] [Save Case] → `POST /api/service/create` with full case DTO (id field included → upsert)

**Cross-linking requirements (all three pages must link to each other):**
```
/ops/cases  ──────────► /ops/kanban    (header CTA "Ops Kanban")
/ops/cases  ──────────► /ops/case/:id  (open_in_new icon per row)
/ops/kanban ──────────► /ops/cases     (sidebar nav "All Cases")
/ops/kanban ──────────► /ops/case/:id  (external-link icon on case card OR "Case Details" from task board)
/ops/case/:id ────────► /ops/kanban    (breadcrumb / back navigation)
/ops/case/:id ────────► /sales/lead/:id (if leadId != null — "View Lead" CTA)
/sales/lead/:id ──────► /ops/case/:id   (if caseId != null — "View Case" CTA)
```

### Phase 5 — Onboarding Tracker (Day 5)
- [ ] `/ops/onboarding` — property cards with per-product progress bars
- [ ] At-risk alerts, blocker task warnings
- [ ] Go-live countdown

### Phase 6 — Reports (Day 6–7)
- [ ] `/reports/daily` — today's activity cards + tables
- [ ] `/reports/weekly` — funnel chart, bar charts, leaderboard table
- [ ] `/reports/monthly` — full analytics with export

### Phase 7 — Polish (Day 8)
- [ ] All responsive breakpoints
- [ ] Filter persistence (localStorage)
- [ ] Skeleton states everywhere
- [ ] Error boundaries + empty states
- [ ] Excel export buttons wired to existing download endpoints

---

## 11. Replit-Specific Notes

- Use **React + Vite** for the frontend — fast dev server, easy Replit setup
- Use **TanStack Query** (React Query) for all API calls — handles caching, loading, error states
- Use **@hello-pangea/dnd** or **dnd-kit** for drag-drop (lighter than CDK for React)
- Use **Recharts** for all charts (small, tree-shakeable)
- Use **Zustand** for global state (auth token, current org/property)
- Store JWT in `localStorage` with key `bookone_token`
- Proxy API calls to avoid CORS: add `vite.config.js` proxy to `API_URL_LMS`
- All env vars via `.env` file: `VITE_API_BASE_URL`
- The existing Angular app remains untouched — Replit build is a parallel UI prototype

---

## 12. Service Management ↔ Lead Cross-Reference Summary

This table captures every field and navigation that ties the Sales and Ops domains together. Replit must implement all of these connections.

| Direction | Source field | Target | Trigger |
|---|---|---|---|
| Lead → Case | `BusinessLeads.caseId` | `ServiceManagement.id` | Auto-set by `/close-deal` API |
| Case → Lead | `ServiceManagement.leadId` | `BusinessLeads.id` | Auto-set by `/close-deal` API |
| Lead Detail page | `caseId != null` | Show "View Case →" CTA → `/ops/case/:caseId` | Always visible if linked |
| Case Detail page | `leadId != null` | Show "← View Lead" CTA → `/sales/lead/:leadId` | Always visible if linked |
| Kanban case card | `leadId != null` | Show small "From Lead" chip on card | Visual indicator only |
| Onboarding Tracker | `ServiceManagement.leadId != null` | Include case in tracker | Filter for onboarding-originated cases |

**Status coupling on deal close:**
```
lead.status: any → "Onboard"   (set by /close-deal API)
new ServiceManagement.status:  "New"  (auto-created)
new ServiceTask[].status:      "NOT_STARTED"  (auto-created per template)
```

**What ops team sees immediately after deal close:**
- New case in Kanban "New" column with all task cards pre-populated
- `ServiceManagement.name` = lead's property name
- `ServiceManagement.handoffNotes` = notes from deal closure dialog
- `ServiceManagement.goLiveTargetDate` = date from deal closure dialog
- Tasks named and sized per `ProductOnboardingTask` template (per product line)

---

## 13. Critical Rules (Non-Negotiable)

1. **Never change the API** — all endpoints listed in §5 must remain backward-compatible
2. **Status field stays String** — `BusinessLeads.status` and `ServiceManagement.status` are plain strings. Do NOT convert to enums. 10+ repository queries depend on string comparison.
3. **Case status exact string values** — Use `"New"`, `"Inprogress"` (no space), `"On Hold"`, `"Resolved"`, `"Closed"`. Do NOT use `"In_Progress"` or `"InProgress"` — they won't match repository queries.
4. **Task status exact string values** — Use `"NOT_STARTED"`, `"IN_PROGRESS"`, `"DONE"`, `"BLOCKED"` (all uppercase underscore). Different format from case status intentionally.
5. **`organisationId` is multi-tenant key** — every API call that fetches lists must include `organisationId` from the JWT
6. **`assignedTo` is `List<String>` of names** — not a list of user IDs. Store and display as plain strings. Users are selected from a dropdown but their display name (not ID) is stored.
7. **`serviceType` is `List<String>`** — multi-valued, stored as @ElementCollection. Send as JSON array.
8. **File uploads** go through the existing file service endpoint, not directly to the bucket
9. **The `Onboarded` status is terminal** — once a lead is `Onboarded`, the onboard button must not appear
10. **SLA auto-timestamps** — `startedAt` is set server-side when task status → `IN_PROGRESS`; `completedAt` when → `DONE`. UI must refresh task from response (not assume) to show correct timestamps.
11. **Case save is POST /create** — there is no PUT or PATCH for full case update. Send the full DTO with `id` set. Server upserts based on id presence. Do NOT omit the `id` field when updating.
12. **`demoPerfrmed` typo** — the field name in the DB and DTO is `demoPerfrmed` (missing 'o'). Use this exact spelling in any DTO/API calls to avoid silent data loss.
13. **Pagination on list, not on kanban** — `/ops/cases` table is paginated (page/size params). `/ops/kanban` calls with `page=0&size=500` to get all cases at once. Never paginate the kanban board.
