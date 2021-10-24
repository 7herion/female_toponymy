import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private radioValue!: number;

  public getRadioValue(): number {
    return this.radioValue;
  }

  public setRadioValue(v: number): void {
    this.radioValue = v;
  }

  constructor() { }
}
