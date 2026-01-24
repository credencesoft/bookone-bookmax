// import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/shared/animations/shared-animations';
import { RouterLink } from '@angular/router';
import { ScrollToDirective } from '../../helpers/scrollTo.directives';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-demos',
    templateUrl: './demos.component.html',
    styleUrls: ['./demos.component.scss'],
    animations: [SharedAnimations],
    standalone: true,
    imports: [NgbCollapse, ScrollToDirective, RouterLink]
})
export class DemosComponent implements OnInit {
  public isCollapsed = true;
  constructor() { }

  ngOnInit() {
  }

}
