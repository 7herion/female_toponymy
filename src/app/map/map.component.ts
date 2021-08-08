import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ToponymyDataService } from '../services/toponymy-data.service';

const iconRetinaUrl = './leaflet/marker-icon-2x.png';
const iconUrl = './leaflet/marker-icon.png';
const shadowUrl = './leaflet/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  private map!: L.Map;
  private streetMaps = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  private corner1 = L.latLng(43.84, 11.145);
  private corner2 = L.latLng(43.718, 11.348);
  private bounds = L.latLngBounds(this.corner1, this.corner2);

  private mapLayerControl = L.control.layers();

  private setLayerControl(): void {
    this.toponymyData.getFemaleToponyms().subscribe(d => {
      this.mapLayerControl.addOverlay(L.geoJSON(d), 'Toponimi femminili');

      this.toponymyData.getFemaleToponymsToBeInaugurated().subscribe(d => {
        this.mapLayerControl.addOverlay(L.geoJSON(d), 'Toponimi femminili da inaugurare');

        this.toponymyData.getPlacesNamedAfterWomen().subscribe(d => {
          this.mapLayerControl.addOverlay(L.geoJSON(d), 'Luoghi intitolati a donne');

          this.toponymyData.getPlacesNamedAfterWomenToBeInaugurated().subscribe(d => {
            this.mapLayerControl.addOverlay(L.geoJSON(d), 'Luoghi intitolati a donne da inaugurare');
          });
        });
      });
    });
  }

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
    this.mapLayerControl.addTo(this.map);
  }

  ngOnInit(): void {
    this.setLayerControl();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  constructor(
    private readonly toponymyData: ToponymyDataService
  ) { }

}
