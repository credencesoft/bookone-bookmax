import {Component, OnInit} from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-landing-v10",
  templateUrl: "./landing-v10.component.html",
  styleUrls: ["./landing-v10.component.scss"],
  standalone:true,
  imports:[SharedModule]
})
export class LandingV10Component implements OnInit {
  backgroundColor = "landing-purple";
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
