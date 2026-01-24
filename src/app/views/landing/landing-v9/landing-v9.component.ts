import {Component, OnInit} from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-landing-v9",
  templateUrl: "./landing-v9.component.html",
  styleUrls: ["./landing-v9.component.scss"],
  standalone:true,
    imports:[SharedModule]
})
export class LandingV9Component implements OnInit {
  backgroundColor = "landing-sky-blue";
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
