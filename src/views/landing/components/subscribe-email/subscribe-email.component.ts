import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-subscribe-email',
    templateUrl: './subscribe-email.component.html',
    styleUrls: ['./subscribe-email.component.scss'],
    standalone: true,
    imports: [FormsModule]
})
export class SubscribeEmailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
