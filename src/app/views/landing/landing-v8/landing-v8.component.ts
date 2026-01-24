import {Component, OnInit} from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-landing-v8",
  templateUrl: "./landing-v8.component.html",
  styleUrls: ["./landing-v8.component.scss"],
  standalone:true,
    imports:[SharedModule]
})
export class LandingV8Component implements OnInit {
  backgroundColor = "landing-indigo-deep";
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
