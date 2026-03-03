import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-counter',
  templateUrl: './number-counter.component.html',
  styleUrls: ['./number-counter.component.css']
})
export class NumberCounterComponent {
  @Input() numberOfProperties: number = 0;
  @Input() numberOfOTAs: number = 0;
  @Input() numberOfRooms: number = 0;
  @Input() numberOfSubscriptions: number = 0;
  @Input() numberOfSpecialFeatures: number = 0;
}
