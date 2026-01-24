import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { SharedModule } from 'src/app/shared/shared.module';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
  animations: [SharedAnimations],
  standalone:true,
  imports:[SharedModule]
})
export class FaqsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
