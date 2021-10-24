import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent implements OnInit {

  public radioValue!: number;

  saveData() {
    this.sharedData.setRadioValue(this.radioValue);
  }

  constructor(
    private readonly sharedData: DataService,
  ) { }

  ngOnInit(): void {
    this.radioValue = this.sharedData.getRadioValue();
  }

}
