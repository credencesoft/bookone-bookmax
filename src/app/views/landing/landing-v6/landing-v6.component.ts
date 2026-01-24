import {Component, OnInit} from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-landing-v6",
  templateUrl: "./landing-v6.component.html",
  styleUrls: ["./landing-v6.component.scss"],
  standalone:true,
    imports:[SharedModule]
})
export class LandingV6Component implements OnInit {
  backgroundColor = "landing-gradient-blue-red";
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
