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
L.Marker.prototype.options.riseOnHover = true;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  //private map!: L.Map;
  private streetMaps = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  private corner1 = L.latLng(43.84, 11.145);
  private corner2 = L.latLng(43.718, 11.348);
  private bounds = L.latLngBounds(this.corner1, this.corner2);

  private mapLayerControl = L.control.layers(undefined, undefined, { collapsed: false });

  private setLayerControl(): void {
    this.toponymyData.getFemaleToponyms().subscribe(d => {
      this.mapLayerControl.addOverlay(L.geoJSON(d,
        {
          style: function () {
            return { color: '#3388ff' };
          },
          onEachFeature: function (featureData, featureLayer) {
            featureLayer.bindPopup('<b>' + featureData.properties.TOPONIMO + '</b>');
            featureLayer.on('mouseover', function (e) {
              featureLayer.openPopup();
            });
            featureLayer.on('mouseout', function (e) {
              featureLayer.closePopup();
            });
          }
        }
      ), 'Toponimi femminili');

      this.toponymyData.getFemaleToponymsToBeInaugurated().subscribe(d => {
        this.mapLayerControl.addOverlay(L.geoJSON(d, {
          style: function () {
            return { color: '#ff3d61' };
          },
          onEachFeature: function (featureData, featureLayer) {
            featureLayer.bindPopup('<b>' + featureData.properties.TOPONIMO + '</b>');
            featureLayer.on('mouseover', function (e) {
              featureLayer.openPopup();
            });
            featureLayer.on('mouseout', function (e) {
              featureLayer.closePopup();
            });
          }
        }), 'Toponimi femminili da inaugurare');

        this.toponymyData.getPlacesNamedAfterWomen().subscribe(d => {
          this.mapLayerControl.addOverlay(L.geoJSON(d, {
            onEachFeature: function (featureData, featureLayer) {
              featureLayer.bindPopup('<b>' + featureData.properties.Testo + '</b>');
              featureLayer.on('mouseover', function (e) {
                featureLayer.openPopup();
              });
              featureLayer.on('mouseout', function (e) {
                featureLayer.closePopup();
              });
            }
          }), 'Luoghi intitolati a donne');

          this.toponymyData.getPlacesNamedAfterWomenToBeInaugurated().subscribe(d => {
            this.mapLayerControl.addOverlay(L.geoJSON(d, {
              pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                  icon: new L.Icon({
                    iconUrl: './assets/icons/red-icon.png',
                    shadowUrl,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                  }),
                });
              },
              onEachFeature: function (featureData, featureLayer) {
                featureLayer.bindPopup('<b>' + featureData.properties.Testo + '</b>');
                featureLayer.on('mouseover', function (e) {
                  featureLayer.openPopup();
                });
                featureLayer.on('mouseout', function (e) {
                  featureLayer.closePopup();
                });
              }
            }), 'Luoghi intitolati a donne da inaugurare');
          });
        });
      });
    });
  }

  private initMap(): void {
    var map = L.map('map', {
      layers: [
        L.tileLayer(this.streetMaps, {
          attribution: '&copy; OpenStreetMap contributors'
        })
      ],
      minZoom: 12,
      maxZoom: 18,
    });;

    //map.setMaxBounds(this.bounds);
    this.mapLayerControl.addTo(map);

    navigator.geolocation.getCurrentPosition(function (location) {
      var currentPosition = new L.LatLng(location.coords.latitude, location.coords.longitude);

      L.marker(currentPosition, {
        icon: new L.Icon({
          iconUrl: './assets/icons/green-icon.png',
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
      }).addTo(map).bindPopup('<b>You are here</b>').openPopup();

      map.setView(currentPosition, 16);
      map.locate({ setView: true, watch: true, maxZoom: 16 });
    });
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
