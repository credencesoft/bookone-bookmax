import {Component, OnInit} from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-landing-v2",
  templateUrl: "./landing-v2.component.html",
  styleUrls: ["./landing-v2.component.scss"],
  standalone:true,
    imports:[SharedModule]
})
export class LandingV2Component implements OnInit {
  backgroundColor = "landing-indigo-light";
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
