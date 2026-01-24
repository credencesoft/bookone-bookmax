import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone:true,
  imports:[SharedModule]
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
