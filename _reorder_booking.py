"""
Restructure Booking.component.html section order for BOTH web and mobile.

Target sequence:
  1. Booking Details (Room Charges)
  2. Coupon Applied (extracted from Guest Details → standalone card)
  3. Advance Payment (extracted from inside Room Charges → standalone card)
  4. Add-On Services
  5. Order Summary  (right sticky col on web; inline on mobile)
  6. Guest Details
  7. Pay Now (Terms + CTA)
"""

with open('src/app/views/landing/Booking/Booking.component.html', 'r') as f:
    content = f.read()

MOBILE_SPLIT = '\n    <div class="booking-checkout-mobile-view">'
split_pos = content.find(MOBILE_SPLIT)
assert split_pos != -1, "Cannot find mobile boundary"

desktop_part = content[:split_pos]
mobile_part  = content[split_pos:]

errors   = []
successes = []

# ─────────────────────────────────────────────────────────────────────────────
# DESKTOP CHANGES
# ─────────────────────────────────────────────────────────────────────────────

# D1 ── Remove advance payment from INSIDE Room Charges card ──────────────────
ADV_DESKTOP = (
    '\n\n                <!-- Advance Payment Plan selector (integrated here) -->\n'
    '                <div *ngIf="showPayNow() && businessServiceDto">\n'
    '                  <hr style="border: 1px solid #e5e7eb; margin: 18px 0" />\n'
    '                  <h6 style="font-weight: 600; color: #031eaa; margin-bottom: 12px">\n'
    '                    <i class="fa-solid fa-wallet" style="margin-right: 6px"></i>\n'
    '                    Select Advance Payment Plan\n'
    '                  </h6>\n'
    '                  <div class="advance-payment-div">\n'
    '                    <div *ngFor="let slab of advanceDiscountSlabs"\n'
    '                      (click)="selectAdvancePaymentPlan(slab)"\n'
    "                      [ngClass]=\"{'advance-card': true, 'selected': isAdvancePaymentPlanSelected(slab)}\">\n"
    '                      <div class="d-flex justify-content-between">\n'
    '                        <div class="advance-text">\n'
    '                          <div class="advance-title">Pay {{ slab.advancePercentage }}% Advance</div>\n'
    '                          <div class="advance-discount">Get {{ slab.discountPercentage }}% Discount</div>\n'
    '                        </div>\n'
    '                      </div>\n'
    '                    </div>\n'
    '                  </div>\n'
    '                  <div *ngIf="isAdvancePaymentPlanRequired()" class="advance-payment-info">\n'
    '                    Select an advance payment plan to continue with Pay Now.\n'
    '                  </div>\n'
    '                </div>'
)

if ADV_DESKTOP in desktop_part:
    desktop_part = desktop_part.replace(ADV_DESKTOP, '', 1)
    successes.append('D1: Removed advance payment from inside Room Charges card')
else:
    errors.append('D1: Could NOT find advance payment block in desktop Room Charges')

# D2 ── After Room Charges close, insert: Coupon card + Advance Payment card ──
ADDON_ANCHOR = (
    '              </div>\n\n'
    '              <!-- ② ADD-ON SERVICES ──────────────────────────────────────── -->'
)

COUPON_AND_ADV_CARDS = (
    '              </div>\n\n'
    '              <!-- COUPON APPLIED ─────────────────────────────────────────── -->\n'
    '              <div *ngIf="showTheSelectedCoupon && !selectedPromotionCheck"\n'
    '                class="rooms-cards-pricing card"\n'
    '                style="padding: 14px 20px; margin-bottom: 20px; border-left: 4px solid #16a34a; background: #f0fdf4">\n'
    '                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px">\n'
    '                  <div style="display: flex; align-items: center; gap: 10px">\n'
    '                    <i class="fa-solid fa-tag" style="color: #16a34a; font-size: 15px"></i>\n'
    '                    <div>\n'
    '                      <div style="font-weight: 700; color: #111827; font-size: 14px">\n'
    '                        Coupon Applied: {{ selectedCouponList.couponCode }}\n'
    '                        <span *ngIf="selectedCouponList.discountPercentage" style="color: #16a34a; margin-left: 4px">({{ selectedCouponList.discountPercentage }}% OFF)</span>\n'
    '                      </div>\n'
    '                      <div style="font-size: 12px; color: #6b7280; margin-top: 2px" *ngIf="selectedCouponList.endDate">\n'
    "                        Valid until: {{ selectedCouponList.endDate | date : 'd MMM y' }}\n"
    '                      </div>\n'
    '                    </div>\n'
    '                  </div>\n'
    '                  <span style="cursor: pointer; color: #dc2626; font-size: 12px; white-space: nowrap; flex-shrink: 0" (click)="clearSelectedCoupons()">\n'
    '                    <i class="bi bi-trash"></i> Remove\n'
    '                  </span>\n'
    '                </div>\n'
    '              </div>\n\n'
    '              <!-- ② ADVANCE PAYMENT PLAN ──────────────────────────────────── -->\n'
    '              <div *ngIf="showPayNow() && businessServiceDto"\n'
    '                class="rooms-cards-pricing card"\n'
    '                style="padding: 24px 30px; margin-bottom: 20px">\n'
    '                <div class="d-flex align-items-center" style="gap: 10px; margin-bottom: 12px">\n'
    '                  <span class="section-number-badge">2</span>\n'
    '                  <h5 class="booking-d-heading" style="margin: 0">\n'
    '                    <i class="fa-solid fa-wallet" style="color: #031eaa; margin-right: 6px"></i>\n'
    '                    Select Advance Payment Plan\n'
    '                  </h5>\n'
    '                </div>\n'
    '                <div class="advance-payment-div">\n'
    '                  <div *ngFor="let slab of advanceDiscountSlabs"\n'
    '                    (click)="selectAdvancePaymentPlan(slab)"\n'
    "                    [ngClass]=\"{'advance-card': true, 'selected': isAdvancePaymentPlanSelected(slab)}\">\n"
    '                    <div class="d-flex justify-content-between">\n'
    '                      <div class="advance-text">\n'
    '                        <div class="advance-title">Pay {{ slab.advancePercentage }}% Advance</div>\n'
    '                        <div class="advance-discount">Get {{ slab.discountPercentage }}% Discount</div>\n'
    '                      </div>\n'
    '                    </div>\n'
    '                  </div>\n'
    '                </div>\n'
    '                <div *ngIf="isAdvancePaymentPlanRequired()" class="advance-payment-info">\n'
    '                  Select an advance payment plan to continue with Pay Now.\n'
    '                </div>\n'
    '              </div>\n\n'
    '              <!-- ③ ADD-ON SERVICES ──────────────────────────────────────── -->'
)

if ADDON_ANCHOR in desktop_part:
    desktop_part = desktop_part.replace(ADDON_ANCHOR, COUPON_AND_ADV_CARDS, 1)
    successes.append('D2: Inserted Coupon card + Advance Payment card before Add-Ons')
else:
    errors.append('D2: Could NOT find Add-On anchor in desktop')

# D3 ── Update Add-Ons badge 2→3 in desktop ───────────────────────────────────
OLD_ADDON_BADGE = (
    '                <div class="d-flex align-items-center" style="gap: 10px; margin-bottom: 8px">\n'
    '                  <span class="section-number-badge">2</span>\n'
    '                  <h5 class="booking-d-heading" style="margin: 0">Add-On Services</h5>'
)
NEW_ADDON_BADGE = (
    '                <div class="d-flex align-items-center" style="gap: 10px; margin-bottom: 8px">\n'
    '                  <span class="section-number-badge">3</span>\n'
    '                  <h5 class="booking-d-heading" style="margin: 0">Add-On Services</h5>'
)
if OLD_ADDON_BADGE in desktop_part:
    desktop_part = desktop_part.replace(OLD_ADDON_BADGE, NEW_ADDON_BADGE, 1)
    successes.append('D3: Add-Ons badge 2→3 on desktop')
else:
    errors.append('D3: Could NOT find Add-Ons badge in desktop')

# D4 ── Update Order Summary badge 3→4 in desktop ────────────────────────────
OLD_ORD_BADGE = (
    '                  <span class="section-number-badge">3</span>\n'
    '                  <h5 class="headimg-color" style="margin: 0">\n'
    '                    <img src="media-be/images/payment-sum.svg"'
)
NEW_ORD_BADGE = (
    '                  <span class="section-number-badge">4</span>\n'
    '                  <h5 class="headimg-color" style="margin: 0">\n'
    '                    <img src="media-be/images/payment-sum.svg"'
)
if OLD_ORD_BADGE in desktop_part:
    desktop_part = desktop_part.replace(OLD_ORD_BADGE, NEW_ORD_BADGE, 1)
    successes.append('D4: Order Summary badge 3→4 on desktop')
else:
    errors.append('D4: Could NOT find Order Summary badge in desktop')

# D5 ── Remove coupon block from desktop Guest Details form ───────────────────
# The block starts after the notes textarea closes, up to (not including) card close + </form>
COUPON_IN_DESKTOP_FORM = (
    '\n\n                  <!-- View Coupon section -->\n'
    '                  <!-- <div\n'
    '                  class="coupons-giftcards"\n'
    '                  (click)="openPromoListData()"\n'
    '                  *ngIf="!selectedPromotionCheck"\n'
    '                >\n'
    '                  <span>\n'
    '                    <i class="fas fa-gift"></i>\n'
    '                    View Coupons & Gift Cards\n'
    '                  </span>\n'
    '                </div> -->'
)
if COUPON_IN_DESKTOP_FORM in desktop_part:
    # Find where this block starts and where the form closes
    blk_start = desktop_part.find(COUPON_IN_DESKTOP_FORM)
    # The block ends at the closing </div> of the coupon outer <div *ngIf=...>
    # followed by '\n                </div>\n              </form>'
    END_ANCHOR = '\n                </div>\n              </form>'
    blk_end = desktop_part.find(END_ANCHOR, blk_start)
    if blk_end != -1:
        # Remove from blk_start to blk_end (keep END_ANCHOR intact)
        desktop_part = desktop_part[:blk_start] + desktop_part[blk_end:]
        successes.append('D5: Removed coupon block from desktop Guest Details form')
    else:
        errors.append('D5b: Found comment anchor but could not find end anchor in desktop')
else:
    errors.append('D5: Could NOT find coupon comment anchor in desktop Guest Details')

# ─────────────────────────────────────────────────────────────────────────────
# MOBILE CHANGES
# ─────────────────────────────────────────────────────────────────────────────

# M1 ── Locate Add-Ons block and Advance Payment block, then swap ─────────────
ADDONS_MOB_START  = '\n\n            <!-- ② ADD-ON SERVICES (mobile) ──────────────────────────── -->'
ADV_MOB_START     = '\n\n              <!-- Advance Payment Plan (mobile, inside Section 1) -->'
ORDER_MOB_START   = '\n\n            <!-- ③ ORDER SUMMARY (mobile)'

pos_addons = mobile_part.find(ADDONS_MOB_START)
pos_adv    = mobile_part.find(ADV_MOB_START)
pos_order  = mobile_part.find(ORDER_MOB_START)

if pos_addons != -1 and pos_adv != -1 and pos_order != -1 and pos_addons < pos_adv < pos_order:
    addons_block = mobile_part[pos_addons:pos_adv]   # Add-Ons HTML
    adv_block    = mobile_part[pos_adv:pos_order]     # Advance Payment HTML

    # Rebuild: before Add-Ons + Advance Payment + Add-Ons + from Order Summary
    mobile_part = (
        mobile_part[:pos_addons] +
        adv_block +
        addons_block +
        mobile_part[pos_order:]
    )
    successes.append('M1: Swapped Add-Ons and Advance Payment on mobile')
else:
    errors.append(f'M1: Block positions invalid — addons={pos_addons}, adv={pos_adv}, order={pos_order}')

# M2 ── Add section-number-badge to mobile Advance Payment card ───────────────
OLD_ADV_MOB_HEADING = (
    '                <h5 class="booking-d-heading" style="margin-bottom: 12px">\n'
    '                  <i class="fa-solid fa-wallet" style="color: #031eaa;"></i>\n'
    '                  Select Advance Payment Plan\n'
    '                </h5>'
)
NEW_ADV_MOB_HEADING = (
    '                <div class="d-flex align-items-center" style="gap: 10px; margin-bottom: 12px">\n'
    '                  <span class="section-number-badge">2</span>\n'
    '                  <h5 class="booking-d-heading" style="margin: 0">\n'
    '                    <i class="fa-solid fa-wallet" style="color: #031eaa; margin-right: 6px"></i>\n'
    '                    Select Advance Payment Plan\n'
    '                  </h5>\n'
    '                </div>'
)
if OLD_ADV_MOB_HEADING in mobile_part:
    mobile_part = mobile_part.replace(OLD_ADV_MOB_HEADING, NEW_ADV_MOB_HEADING, 1)
    successes.append('M2: Added section badge 2 to mobile Advance Payment card')
else:
    errors.append('M2: Could NOT find mobile Advance Payment heading')

# M3 ── Update Add-Ons badge 2→3 on mobile ────────────────────────────────────
OLD_ADDONS_MOB_BADGE = (
    '              <div class="d-flex align-items-center" style="gap: 10px; margin-bottom: 8px">\n'
    '                <span class="section-number-badge">2</span>\n'
    '                <h5 class="booking-d-heading" style="margin: 0">Add-On Services</h5>'
)
NEW_ADDONS_MOB_BADGE = (
    '              <div class="d-flex align-items-center" style="gap: 10px; margin-bottom: 8px">\n'
    '                <span class="section-number-badge">3</span>\n'
    '                <h5 class="booking-d-heading" style="margin: 0">Add-On Services</h5>'
)
if OLD_ADDONS_MOB_BADGE in mobile_part:
    mobile_part = mobile_part.replace(OLD_ADDONS_MOB_BADGE, NEW_ADDONS_MOB_BADGE, 1)
    successes.append('M3: Add-Ons badge 2→3 on mobile')
else:
    errors.append('M3: Could NOT find mobile Add-Ons badge')

# M4 ── Update Order Summary badge 3→4 on mobile ─────────────────────────────
OLD_ORDER_MOB_BADGE = (
    '                  <span class="section-number-badge">3</span>\n'
    '                  <h5 class="headimg-color" style="margin: 0">\n'
    '                    <img src="media-be/images/payment-sum.svg" alt="" width="18"'
)
NEW_ORDER_MOB_BADGE = (
    '                  <span class="section-number-badge">4</span>\n'
    '                  <h5 class="headimg-color" style="margin: 0">\n'
    '                    <img src="media-be/images/payment-sum.svg" alt="" width="18"'
)
if OLD_ORDER_MOB_BADGE in mobile_part:
    mobile_part = mobile_part.replace(OLD_ORDER_MOB_BADGE, NEW_ORDER_MOB_BADGE, 1)
    successes.append('M4: Order Summary badge 3→4 on mobile')
else:
    errors.append('M4: Could NOT find mobile Order Summary badge')

# M5 ── Add Coupon Applied card between Advance Payment and Add-Ons (mobile) ──
# Now that they've been swapped, Advance Payment ends right before Add-Ons.
# Anchor: start of the (now-second) Add-Ons block after swap
COUPON_MOB_CARD = (
    '\n\n            <!-- COUPON APPLIED (mobile) ──────────────────────────── -->\n'
    '            <div *ngIf="showTheSelectedCoupon && !selectedPromotionCheck"\n'
    '              class="rooms-cards-pricing card"\n'
    '              style="padding: 12px 16px; margin-bottom: 16px; border-left: 4px solid #16a34a; background: #f0fdf4">\n'
    '              <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px">\n'
    '                <div style="display: flex; align-items: center; gap: 8px">\n'
    '                  <i class="fa-solid fa-tag" style="color: #16a34a; font-size: 13px"></i>\n'
    '                  <div>\n'
    '                    <div style="font-weight: 700; color: #111827; font-size: 13px">\n'
    '                      Coupon: {{ selectedCouponList.couponCode }}\n'
    '                      <span *ngIf="selectedCouponList.discountPercentage" style="color: #16a34a">&nbsp;({{ selectedCouponList.discountPercentage }}% OFF)</span>\n'
    '                    </div>\n'
    '                    <div style="font-size: 11px; color: #6b7280" *ngIf="selectedCouponList.endDate">\n'
    "                      Valid until: {{ selectedCouponList.endDate | date : 'd MMM y' }}\n"
    '                    </div>\n'
    '                  </div>\n'
    '                </div>\n'
    '                <span style="cursor: pointer; color: #dc2626; font-size: 11px; white-space: nowrap; flex-shrink: 0" (click)="clearSelectedCoupons()">\n'
    '                  <i class="bi bi-trash"></i>\n'
    '                </span>\n'
    '              </div>\n'
    '            </div>'
)

# Insert just before the Add-Ons block (which now follows Advance Payment after swap)
if ADDONS_MOB_START in mobile_part:
    mobile_part = mobile_part.replace(ADDONS_MOB_START, COUPON_MOB_CARD + ADDONS_MOB_START, 1)
    successes.append('M5: Inserted Coupon card before Add-Ons on mobile')
else:
    errors.append('M5: Could NOT find Add-Ons anchor in mobile (post-swap)')

# M6 ── Remove coupon block from mobile Guest Details form ────────────────────
COUPON_IN_MOB_FORM = (
    '\n\n                  <!-- View Coupon section -->\n'
    '                  <!-- <div\n'
    '                  class="coupons-giftcards"\n'
    '                  (click)="openPromoListData()"\n'
    '                  *ngIf="!selectedPromotionCheck"\n'
    '                >\n'
    '                  <span>\n'
    '                    <i class="fas fa-gift"></i>\n'
    '                    View Coupons & Gift Cards\n'
    '                  </span>\n'
    '                </div> -->'
)
if COUPON_IN_MOB_FORM in mobile_part:
    blk_start = mobile_part.find(COUPON_IN_MOB_FORM)
    # End anchor: the outer coupon div closes, then form's card closes, then </form>
    MOB_FORM_END = '\n                </div>\n              </form>'
    blk_end = mobile_part.find(MOB_FORM_END, blk_start)
    if blk_end != -1:
        mobile_part = mobile_part[:blk_start] + mobile_part[blk_end:]
        successes.append('M6: Removed coupon block from mobile Guest Details form')
    else:
        errors.append('M6b: Found comment anchor but could not find end anchor in mobile')
else:
    errors.append('M6: Could NOT find coupon comment anchor in mobile Guest Details')

# ─────────────────────────────────────────────────────────────────────────────
# WRITE OUTPUT
# ─────────────────────────────────────────────────────────────────────────────
new_content = desktop_part + mobile_part

with open('src/app/views/landing/Booking/Booking.component.html', 'w') as f:
    f.write(new_content)

print('\n=== RESULTS ===')
for s in successes:
    print(f'  ✓ {s}')
for e in errors:
    print(f'  ✗ {e}')
print(f'\nTotal: {len(successes)} succeeded, {len(errors)} failed')
if errors:
    print('\nSome operations failed — check the file and build output carefully')
else:
    print('\nAll operations succeeded — run npm run build to verify')
