import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent implements OnInit {

  public radioValue!: number;

  /**
   * Saves the value of the radio buttons in sharedData DataService.
   */
  saveData(): void {
    this.sharedData.setRadioValue(this.radioValue);
  }

  constructor(
    private readonly sharedData: DataService,
  ) { }

  ngOnInit(): void {
    this.radioValue = this.sharedData.getRadioValue();
  }

}
