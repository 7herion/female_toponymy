import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToponymyDataService {

  constructor(private readonly http: HttpClient) { }

  public getFemaleToponyms() {
    return this.http.get<any>('assets/toponimi-femminili.json');
  }

  public getFemaleToponymsToBeInaugurated() {
    return this.http.get<any>('assets/toponimi-femminili-da-inaugurare.json');
  }

  public getPlacesNamedAfterWomen() {
    return this.http.get<any>('assets/luoghi-intitolati-a-donne.json');
  }

  public getPlacesNamedAfterWomenToBeInaugurated() {
    return this.http.get<any>('assets/luoghi-intitolati-a-donne-da-inaugurare.json');
  }
}
