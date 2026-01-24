// import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { Component, OnInit } from "@angular/core";
import { SharedAnimations } from "src/shared/animations/shared-animations";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-intro1",
    templateUrl: "./intro1.component.html",
    styleUrls: ["./intro1.component.scss"],
    animations: [SharedAnimations],
    standalone: true,
    imports: [RouterLink]
})
export class Intro1Component implements OnInit {
  constructor() {}

  ngOnInit() {}
}
