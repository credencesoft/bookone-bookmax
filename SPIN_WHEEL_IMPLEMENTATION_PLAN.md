# Spinning Wheel Coupon Feature - Implementation Plan

## 🎯 Objective
Replace the static coupon banner with an engaging spinning wheel that reveals discount codes. When a discount is won, it auto-populates to the coupon field and applies the discount.

---

## 📊 Current State Analysis

### Current Flow
1. **ListingDetailOne Component** displays coupon promotion banner
   - Shows: "{{ product.name }} Special Offer - Grab up to {{ product.discountPercentage }}% off"
   - Button: "Get Coupon" → calls `applyCoupon(product, couponSection)`

2. **applyCoupon() Method**
   - Sets `this.enteredCoupon = product.couponCode`
   - Validates coupon against offers list
   - Stores in sessionStorage:
     - `selectedPromoData`: Full coupon object (JSON)
     - `selectPromo`: 'true' flag
   - Sets component flags:
     - `this.promoSelected = true`
     - `this.specialDiscountData = matchingOffer`
     - `this.validCouponCode = parsed.couponCode`

3. **Booking Component Integration**
   - Reads sessionStorage on init
   - Auto-selects coupon if present
   - Applies coupon to booking form

### Current Data Structure
```typescript
interface OfferData {
  couponCode: string;        // e.g., "LUCKY10"
  discountPercentage: number; // e.g., 10
  minimumOrderAmount: number;
  startDate: number;          // timestamp
  endDate: number;            // timestamp
  name: string;
}
```

---

## 🏗 Architecture Overview

### Files to Create
```
src/app/components/
  └── spinning-wheel/
      ├── spinning-wheel.component.ts
      ├── spinning-wheel.component.html
      ├── spinning-wheel.component.scss
      └── spinning-wheel.component.spec.ts
```

### Files to Modify
```
src/app/views/landing/ListingDetailOne/
  ├── ListingDetailOne.component.ts     (add wheel trigger logic)
  ├── ListingDetailOne.component.html   (replace promo banner)
  └── ListingDetailOne.component.scss   (if needed)

src/app/app.module.ts or SharedModule    (register component)
```

---

## 🛠 Implementation Steps

### Phase 1: Create Spinning Wheel Component

#### 1.1 Create Component Files
```bash
ng generate component components/spinning-wheel
```

#### 1.2 Component Structure (TypeScript)

**spinning-wheel.component.ts**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface WheelSegment {
  label: string;
  value: number;        // discount percentage
  code: string;         // coupon code
  color: string;        // hex color
}

@Component({
  selector: 'app-spinning-wheel',
  templateUrl: './spinning-wheel.component.html',
  styleUrls: ['./spinning-wheel.component.scss']
})
export class SpinningWheelComponent {
  @Input() segments: WheelSegment[] = [];
  @Input() triggerButtonText: string = 'Spin Now';
  @Output() couponWon = new EventEmitter<{ code: string; discount: number }>();

  isSpinning: boolean = false;
  rotation: number = 0;
  result: { discount: number; code: string } | null = null;
  showModal: boolean = false;

  // Confetti particles for celebration
  confettiActive: boolean = false;

  defaultSegments: WheelSegment[] = [
    { label: '10%', value: 10, code: 'LUCKY10', color: '#f59e0b' },
    { label: '5%', value: 5, code: 'LUCKY5', color: '#ef4444' },
    { label: '15%', value: 15, code: 'LUCKY15', color: '#3b82f6' },
    { label: '20%', value: 20, code: 'LUCKY20', color: '#10b981' },
    { label: 'Try Again', value: 0, code: '', color: '#6b7280' },
    { label: '10%', value: 10, code: 'LUCKY10B', color: '#8b5cf6' },
    { label: '5%', value: 5, code: 'LUCKY5B', color: '#ec4899' },
    { label: '25% 🎉', value: 25, code: 'JACKPOT25', color: '#eab308' },
  ];

  ngOnInit() {
    if (!this.segments || this.segments.length === 0) {
      this.segments = this.defaultSegments;
    }
  }

  openWheel() {
    this.showModal = true;
    this.result = null;
  }

  closeWheel() {
    this.showModal = false;
  }

  startSpin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.result = null;

    // Calculate rotation: 5 full spins + random position
    const spins = 5 * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    
    // Pick a winning segment (randomly or algorithm-based)
    const winningIndex = Math.floor(Math.random() * this.segments.length);
    const segmentAngle = 360 / this.segments.length;
    
    // Target rotation to land on winning segment at top (0 degrees)
    const targetRotation = this.rotation + spins + (360 - (winningIndex * segmentAngle));
    
    this.rotation = targetRotation;

    // Wait for animation to complete (4 seconds)
    setTimeout(() => {
      this.isSpinning = false;
      const won = this.segments[winningIndex];
      this.result = { discount: won.value, code: won.code };
      
      // Trigger confetti
      if (won.value > 0) {
        this.triggerConfetti();
      }
    }, 4000);
  }

  applyWinningCoupon() {
    if (this.result && this.result.code) {
      this.couponWon.emit({
        code: this.result.code,
        discount: this.result.discount
      });
      
      // Close modal after brief delay
      setTimeout(() => {
        this.closeWheel();
      }, 500);
    }
  }

  triggerConfetti() {
    this.confettiActive = true;
    
    // Simulate confetti animation
    // In real implementation, use canvas-confetti or similar
    setTimeout(() => {
      this.confettiActive = false;
    }, 2000);
  }

  getSegmentRotation(index: number): string {
    const angle = (360 / this.segments.length) * index;
    return `rotate(${angle}deg)`;
  }

  getSegmentBackground(color: string): string {
    return `border-top-color: ${color}`;
  }
}
```

#### 1.3 Component Template (HTML)

**spinning-wheel.component.html**
```html
<!-- Trigger Button -->
<div class="spin-wheel-trigger" (click)="openWheel()">
  <div class="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-xl border border-orange-200 cursor-pointer hover:shadow-md transition-all group relative overflow-hidden">
    <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/40 to-transparent rounded-bl-full z-0"></div>
    <div class="flex items-center justify-between relative z-10">
      <div class="flex items-center gap-3">
        <div class="bg-white p-2.5 rounded-full shadow-sm group-hover:rotate-12 transition-transform duration-300 border border-orange-100">
          <span class="text-amber-500">🏆</span>
        </div>
        <div>
          <p class="font-bold text-slate-900 text-sm">Spin & Win Discount</p>
          <p class="text-xs text-slate-600 font-medium">Try your luck today!</p>
        </div>
      </div>
      <button class="bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full h-8 px-4 shadow-sm" type="button">
        {{ triggerButtonText }}
      </button>
    </div>
  </div>
</div>

<!-- Modal Overlay -->
<div class="modal-backdrop" *ngIf="showModal" (click)="closeWheel()"></div>

<!-- Modal Content -->
<div class="spin-wheel-modal" *ngIf="showModal" [@modalAnimation]>
  <div class="modal-content">
    <!-- Close Button -->
    <button class="close-btn" (click)="closeWheel()" type="button">✕</button>

    <!-- Wheel View (Before Result) -->
    <div *ngIf="!result" class="wheel-view" [@fadeIn]>
      <h2 class="text-3xl font-bold text-center mb-2">Spin to <span class="text-amber-500">Win</span></h2>
      <p class="text-gray-600 text-center mb-8">Test your luck for a massive discount!</p>

      <!-- Wheel Container -->
      <div class="wheel-container">
        <!-- Pointer (Top) -->
        <div class="wheel-pointer"></div>

        <!-- Spinning Wheel -->
        <div class="wheel" [style.transform]="'rotate(' + rotation + 'deg')'" [class.spinning]="isSpinning">
          <div *ngFor="let segment of segments; let i = index" 
               class="wheel-segment" 
               [style.transform]="getSegmentRotation(i)">
            <div class="segment-slice" [style]="getSegmentBackground(segment.color)"></div>
            <span class="segment-label">{{ segment.label }}</span>
          </div>
        </div>

        <!-- Center Hub -->
        <div class="wheel-hub"></div>
      </div>

      <!-- Spin Button -->
      <button class="spin-button" 
              (click)="startSpin()" 
              [disabled]="isSpinning"
              type="button">
        {{ isSpinning ? 'SPINNING...' : 'SPIN NOW' }}
      </button>
    </div>

    <!-- Result View (After Spin) -->
    <div *ngIf="result" class="result-view" [@slideUp]>
      <!-- Trophy Icon -->
      <div class="trophy-icon">🏆</div>

      <!-- Result Text -->
      <h3 class="text-4xl font-bold text-center text-yellow-500 mb-2">
        {{ result.discount > 0 ? 'JACKPOT!' : 'Try Again!' }}
      </h3>
      <p class="text-gray-600 text-center mb-8" *ngIf="result.discount > 0">
        You've unlocked a {{ result.discount }}% discount!
      </p>

      <!-- Discount Display Card -->
      <div *ngIf="result.discount > 0" class="discount-card">
        <div class="discount-value">{{ result.discount }}% OFF</div>
        <div class="coupon-code-display">
          <code>{{ result.code }}</code>
          <button class="copy-btn" (click)="applyWinningCoupon()" type="button">
            ✓ Apply
          </button>
        </div>
      </div>

      <!-- Try Again Button -->
      <button *ngIf="result.discount === 0" 
              class="spin-button mt-6" 
              (click)="startSpin()"
              type="button">
        TRY AGAIN
      </button>

      <!-- Apply Button (Only if we won) -->
      <button *ngIf="result.discount > 0" 
              class="apply-button w-full mt-6" 
              (click)="applyWinningCoupon()"
              type="button">
        Apply {{ result.discount }}% Discount
      </button>
    </div>

    <!-- Confetti Animation -->
    <div class="confetti" *ngIf="confettiActive">
      <!-- Confetti particles here -->
    </div>
  </div>
</div>
```

#### 1.4 Component Styles (SCSS)

**spinning-wheel.component.scss**
```scss
.spin-wheel-trigger {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.spin-wheel-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    color: white;
  }
}

.wheel-view,
.result-view {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wheel-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 24px auto;
}

.wheel-pointer {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 20px solid white;
  z-index: 40;
  drop-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #1e293b;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  transition: transform 4s cubic-bezier(0.25, 0.1, 0.25, 1);
  background: white;

  &.spinning {
    // Animation handled by inline style
  }
}

.wheel-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform-origin: center;
}

.segment-slice {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-bottom: 140px solid #10b981;
  transform-origin: 0 0;
}

.segment-label {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 12px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  width: 60px;
  text-align: center;
}

.wheel-hub {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  z-index: 30;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    inset: 8px;
    background: #1e293b;
    border-radius: 50%;
  }
}

.spin-button {
  background: linear-gradient(to right, #f59e0b, #f97316);
  color: white;
  font-weight: bold;
  font-size: 16px;
  padding: 12px 32px;
  border: 2px solid #f59e0b;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.6);
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}

.trophy-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.discount-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.discount-value {
  font-size: 48px;
  font-weight: bold;
  background: linear-gradient(to right, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.coupon-code-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  code {
    font-family: 'Monaco', monospace;
    font-size: 18px;
    font-weight: bold;
    color: #fbbf24;
    letter-spacing: 2px;
  }
}

.copy-btn,
.apply-button {
  background: linear-gradient(to right, #1e40af, #0f172a);
  color: white;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(to right, #1e3a8a, #1e40af);
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
  }
}

.apply-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 16px;

  &:hover {
    transform: translateY(-2px);
  }
}

// Animation triggers
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### Phase 2: Integrate with ListingDetailOne

#### 2.1 Import Component
**ListingDetailOne.component.ts** (at top)
```typescript
import { SpinningWheelComponent } from 'src/app/components/spinning-wheel/spinning-wheel.component';
```

#### 2.2 Add Method to Handle Wheel Win
**ListingDetailOne.component.ts** (add new method)
```typescript
onSpinWheelCouponWon(event: { code: string; discount: number }) {
  // Simulate finding the coupon in offers list
  const offer = this.offersList.find(
    (item) => item.couponCode?.trim().toUpperCase() === event.code?.trim().toUpperCase()
  );

  if (offer) {
    // Set the entered coupon to trigger applyCoupon logic
    this.enteredCoupon = event.code;
    this.onYesClick(); // Reuse existing validation logic
    
    // Show success message
    this.successMessagePrivate = `🎉 Congratulations! ${event.discount}% discount won!`;
    setTimeout(() => {
      this.successMessagePrivate = '';
    }, 4000);
  } else {
    // If exact match not found, try to create a temporary offer object
    const tempOffer = {
      couponCode: event.code,
      discountPercentage: event.discount,
      minimumOrderAmount: 0,
      startDate: Date.now(),
      endDate: Date.now() + (365 * 24 * 60 * 60 * 1000), // Valid for 1 year
      name: `Spin Wheel Discount`
    };

    // Treat it like applyCoupon
    this.privatePromotionData = tempOffer;
    this.enteredCoupon = event.code;
    
    // Manually set flags (bypass onYesClick if offer not in system)
    this.successMessagePrivate = '✅ Applied';
    this.errorMessagePrivate = '';
    this.selectedPromotion = true;
    this.isValidPrivateCoupon = true;
    this.couponApplied = true;
    this.couponSuccessApplied = true;

    sessionStorage.setItem('selectedPromoData', JSON.stringify(tempOffer));
    sessionStorage.setItem('selectPromo', 'true');
    this.promoSelected = true;
    this.specialDiscountData = tempOffer;
    this.validCouponCode = event.code;
    this.specialDiscountPercentage = event.discount;
  }
}
```

#### 2.3 Replace HTML Promo Banner
**ListingDetailOne.component.html** (find and replace the promo-section)

**Before:**
```html
<div class="promo-section">
  <div class="promo-code-container">
    <h4 class="promo-heading">
      {{ product.name }} Special Offer
    </h4>
    <div class="code-coupon">
      <span class="promo-code"
        >Grab up to {{ product.discountPercentage }}% off</span
      >
    </div>
  </div>
  <div class="applycoupon">
    <button
      class="apply-coupon-btn"
      (click)="applyCoupon(product, couponSection)"
    >
      Get Coupon
    </button>
  </div>
</div>
```

**After:**
```html
<app-spinning-wheel
  [segments]="generateWheelSegments(product)"
  triggerButtonText="Spin Now"
  (couponWon)="onSpinWheelCouponWon($event)"
></app-spinning-wheel>
```

#### 2.4 Add Helper Method to Generate Segments
**ListingDetailOne.component.ts** (add new method)
```typescript
generateWheelSegments(product: any): any[] {
  // Generate wheel segments based on product discount
  const baseDiscount = product.discountPercentage || 20;
  
  return [
    { label: '5%', value: 5, code: 'SPUN5_' + Date.now(), color: '#ef4444' },
    { label: '10%', value: 10, code: 'SPUN10_' + Date.now(), color: '#f97316' },
    { label: '15%', value: 15, code: 'SPUN15_' + Date.now(), color: '#f59e0b' },
    { label: `${baseDiscount}%`, value: baseDiscount, code: 'SPUN' + baseDiscount + '_' + Date.now(), color: '#10b981' },
    { label: 'Try Again', value: 0, code: '', color: '#6b7280' },
    { label: '10%', value: 10, code: 'SPUN10B_' + Date.now(), color: '#3b82f6' },
    { label: '20%', value: 20, code: 'SPUN20_' + Date.now(), color: '#8b5cf6' },
    { label: `${Math.min(baseDiscount + 10, 50)}% 🎉`, value: Math.min(baseDiscount + 10, 50), code: 'JACKPOT_' + Date.now(), color: '#eab308' },
  ];
}
```

#### 2.5 Register Component in Module
**app.module.ts or SharedModule**
```typescript
import { SpinningWheelComponent } from './components/spinning-wheel/spinning-wheel.component';

@NgModule({
  declarations: [
    // ... other components
    SpinningWheelComponent
  ],
  imports: [
    // ... other imports
  ]
})
export class AppModule { }
```

---

### Phase 3: Add Animations (Optional but Recommended)

#### 3.1 Install Framer Motion for Angular (if needed)
```bash
npm install @angular/animations
```

#### 3.2 Add to app.module.ts
```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    // ...
  ]
})
```

---

## 📐 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ User clicks "Spin Now" on ListingDetailOne                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ SpinningWheelComponent opens modal                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ User clicks "SPIN NOW" button                                   │
│ Wheel rotates 5+ spins + random landing (4s animation)         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Result revealed: Discount % + Coupon Code                      │
│ Confetti celebration (if discount > 0)                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ User clicks "Apply XX% Discount"                               │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ couponWon emit → onSpinWheelCouponWon($event)                  │
│ Sets this.enteredCoupon = event.code                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ onYesClick() validates & applies coupon                        │
│ Sets sessionStorage['selectedPromoData'] & ['selectPromo']    │
│ Flags: promoSelected=true, couponApplied=true                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Modal closes, wheel component emits success message            │
│ (Optional: auto-scroll to coupon section)                      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Booking Component reads sessionStorage on next nav             │
│ Auto-selects coupon in booking form                            │
│ User proceeds to checkout with discount applied                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] SpinningWheelComponent opens/closes correctly
- [ ] Wheel rotates on spin
- [ ] Result shows correct discount & coupon code
- [ ] `couponWon` event emits with correct data
- [ ] Confetti triggers only for non-zero discounts

### Integration Tests
- [ ] ListingDetailOne receives coupon event
- [ ] `onSpinWheelCouponWon()` sets flags correctly
- [ ] sessionStorage keys are set properly
- [ ] Coupon appears in special discount display area
- [ ] "Coupon {{ code }} Applied" message shows

### E2E Tests
- [ ] Click "Spin Now" → modal opens
- [ ] Click "SPIN NOW" button → wheel rotates
- [ ] After 4s, result displays
- [ ] Click "Apply" → modal closes
- [ ] Coupon code appears in coupon field
- [ ] Success message displays
- [ ] Navigate to Booking → coupon still applied
- [ ] Proceed to checkout with discount

### Edge Cases
- [ ] Spin button states (disabled while spinning)
- [ ] Modal close button works
- [ ] Click on backdrop to close
- [ ] Escape key closes modal (if implemented)
- [ ] Multiple spins on same session
- [ ] Result from "Try Again" segment

---

## 📱 Responsive Design Considerations

- Wheel size adjusts for mobile (280px max, scales down on smaller screens)
- Modal uses 90% width with max-width
- Button text/sizes legible on touch devices
- No horizontal scrolling
- Modal scrolls if content exceeds viewport height

---

## 🚀 Performance Optimizations

1. **Lazy load confetti library** only when needed
2. **CSS animations** (transform/rotate) instead of JS animations
3. **No memory leaks**: Unsubscribe from observables in ngOnDestroy
4. **Debounce spin clicks** to prevent multiple simultaneous spins
5. **Cache wheel segment calculations**

---

## 🔒 Security Notes

- **Coupon code validation**: Always validate on backend before applying
- **Session storage**: Data visible to user (acceptable for coupon codes)
- **No sensitive data**: Never store payment/PII in sessionStorage
- **CSRF protection**: Ensure booking API calls use CSRF tokens

---

## 📝 Implementation Timeline

| Phase | Task | Estimate |
|-------|------|----------|
| 1 | Create SpinningWheelComponent | 3-4 hours |
| 2 | Integrate with ListingDetailOne | 2-3 hours |
| 3 | Add animations & Polish | 2-3 hours |
| 4 | Unit tests | 2-3 hours |
| 5 | Integration tests | 2-3 hours |
| 6 | E2E tests & Bug fixes | 3-4 hours |
| **Total** | | **14-20 hours** |

---

## 🎨 Design Assets Needed

- Trophy/Gift icons (use emoji or SVG)
- Confetti particles (CSS or canvas-based)
- Color palette for wheel segments
- Button hover/active states
- Loading/spinning cursor

---

## 📚 Related Files to Review

- `src/app/views/landing/ListingDetailOne/ListingDetailOne.component.ts`
- `src/app/views/landing/ListingDetailOne/ListingDetailOne.component.html`
- `src/app/views/landing/Booking/Booking.component.ts` (coupon integration)
- `src/app/model/` (data models for offers/coupons)
- `src/app/services/hotel-booking.service.ts` (API calls)

---

## 🎯 Success Criteria

✅ Spinning wheel replaces coupon banner
✅ User can win discount codes via wheel
✅ Winning coupon auto-populates to coupon field
✅ Discount is applied in Booking component
✅ All existing coupon logic still works
✅ Mobile responsive & performant
✅ No console errors or warnings
✅ Unit test coverage > 80%

---

## 📞 Questions & Clarifications

1. **Backend validation**: Should coupon codes be validated against a backend API or local offers list?
2. **Coupon expiry**: How long should spin-wheel coupon codes be valid?
3. **Max spins per user**: Should users be limited to 1 spin per session?
4. **Coupon tracking**: Should spin-wheel wins be tracked/logged?
5. **UI placement**: Should wheel appear on every carousel slide or just certain properties?

