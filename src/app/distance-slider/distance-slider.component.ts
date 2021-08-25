import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-distance-slider',
  templateUrl: './distance-slider.component.html',
  styleUrls: ['./distance-slider.component.scss']
})
export class DistanceSliderComponent implements OnInit {
  @Output() valueEmitter = new EventEmitter<MatSliderChange>(); // MatSliderChange

  public value: number = 50;

  public onInputChange(event: MatSliderChange) {
    this.value = event.value ? event.value : 0;
    this.valueEmitter.emit(event);
  }

  public formatLabel(value: number) {
    return value + 'm';
  }

  public sliderTooltip() {
    if (this.value != 0) {
      return ("Distanza apertura automatica modale: " + this.value + " metri");
    } else {
      return ("Apertura automatica modale disattivata");
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
