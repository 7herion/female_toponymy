import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DescriptionComponent } from '../description/description.component';

@Component({
  selector: 'app-sliding-div',
  templateUrl: './sliding-div.component.html',
  styleUrls: ['./sliding-div.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '35vh',
        opacity: 1,
        visibility: 'visible',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.6), white)',
        overflow: 'hidden',
      })),
      state('closed', style({
        height: '0px',
        opacity: 0.2,
        visibility: 'hidden',
      })),
      state('full', style({
        height: '100vh',
        opacity: 1,
        visibility: 'visible',
        backgroundColor: 'white',
        overflow: 'scroll',
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
      transition('open => full', [
        animate('0.3s')
      ]),
      transition('full => closed', [
        animate('0.5s')
      ]),
      transition('* => *', [
        animate('0.3s')
      ]),
    ]),
  ],
})
export class SlidingDivComponent implements OnInit {
  @ViewChild(DescriptionComponent) content!: DescriptionComponent;

  isOpen: boolean = false;
  isOpenFullScreen: boolean = false;
  touchStartYCoord!: number;

  public open(s: string) {
    this.isOpen = true;
    this.content.getData(s);
  }

  public close() {
    this.isOpen = false;
    this.isOpenFullScreen = false;
  }

  public openFullView() {
    if (this.content.dataFound) {
      this.isOpen = false;
      this.isOpenFullScreen = true;
    }
  }

  public touchStart(e: TouchEvent) {
    this.touchStartYCoord = e.changedTouches[0].clientY;
  }

  public swipeEvent(e: TouchEvent) {
    console.log(e);
    if (e.changedTouches[0].clientY < this.touchStartYCoord) {
      this.openFullView();
    } else if (!this.isOpenFullScreen) {
      this.close();
    }
  }

  public checkState() {
    if (this.isOpenFullScreen) {
      return 'full';
    } else if (this.isOpen) {
      return 'open';
    } else {
      return 'closed';
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
