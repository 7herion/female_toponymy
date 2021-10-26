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

  /**
   * Emits an event when changes occur on the slider.
   * 
   * @param event MatSliderChange
   */
  public onInputChange(event: MatSliderChange): void {
    this.value = event.value ? event.value : 0;
    this.valueEmitter.emit(event);
  }

  /**
   * Formats the value adding an 'm' at the end.
   * 
   * @param value value to format
   * @returns formatted string
   */
  public formatLabel(value: number): string {
    return value + 'm';
  }

  /**
   * Attaches a tooltip to the slider.
   * 
   * @returns tooltip string
   */
  public sliderTooltip(): string {
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
