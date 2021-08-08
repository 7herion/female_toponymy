import { AfterViewInit, Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;
  private streetMaps = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  private corner1 = L.latLng(43.84, 11.145);
  private corner2 = L.latLng(43.718, 11.348);
  private bounds = L.latLngBounds(this.corner1, this.corner2);

  // private getDataInfo(m: L.Map) {
  //   this.http.get('assets/toponimi-femminili.json').subscribe((json: any) => {
  //     L.geoJSON(json).addTo(m);
  //   });
  // }

  private initMap(): void {
    this.map = L.map('map', {
      layers: [
        L.tileLayer(this.streetMaps, {
          attribution: '&copy; OpenStreetMap contributors'
        })
      ],
      center: [43.768, 11.253],
      zoom: 15,
      minZoom: 12,
      maxZoom: 18,
    });
    this.map.setMaxBounds(this.bounds);
  }

  ngAfterViewInit(): void {
    this.initMap();
    // this.getDataInfo(this.map);
  }

  constructor(
    // private http: HttpClient
  ) { }

}
