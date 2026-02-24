import {Component, OnInit} from "@angular/core";

@Component({
    selector: "app-landing-v4",
    templateUrl: "./landing-v4.component.html",
    styleUrls: ["./landing-v4.component.scss"],
    standalone: false
})
export class LandingV4Component implements OnInit {
  backgroundColor = "landing-red-light";
  showCustomizer = false;
  constructor() {}

  ngOnInit() {}

  changeBg(colorName) {
    this.backgroundColor = "landing-" + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;
  }
}
