import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { InfoDivService } from '../services/info-div.service';
import { ToponymyDataService } from '../services/toponymy-data.service';
import { SlidingDivComponent } from '../sliding-div/sliding-div.component';

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
  @ViewChild(SlidingDivComponent) slidingDiv: SlidingDivComponent = new SlidingDivComponent();

  private streetMaps = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  private corner1 = L.latLng(43.84, 11.145);
  private corner2 = L.latLng(43.718, 11.348);
  private bounds = L.latLngBounds(this.corner1, this.corner2);

  private mapLayerControl = L.control.layers(undefined, undefined, { collapsed: false });

  private sliderData: Array<number> = [50, 0];

  /**
   * Checks if location is found.
   */
  public geolocationActive(): boolean {
    return (this.sliderData[1] === -1) ? false : true;
  };

  /**
   * Updates local variable when changes occur on the slider.
   * 
   * @param e MatSliderChange
   */
  public onSliderChange(e: MatSliderChange): void {
    this.sliderData[0] = e.value ? e.value : 0;
  }

  /**
   * Navigate to settings page. Closes any open dialog or sliding div.
   */
  public openSettings(): void {
    this.router.navigateByUrl('/settings');
    this.info.close();
  }

  /**
   * Closure of onEachFeature.
   * 
   * @param info InfoDivService that manages dialogs and sliding divs
   */
  private onEachFeatureClosure(info: InfoDivService) {
    return function onEachFeature(featureData: any, featureLayer: L.Layer) {
      let toponym: string = "Toponym";
      if (featureData.properties.hasOwnProperty('TOPONIMO')) {
        toponym = featureData.properties.TOPONIMO;
      } else if (featureData.properties.hasOwnProperty('Testo')) {
        toponym = featureData.properties.Testo;
      }
      featureLayer.on('click', () => {
        info.openTab(toponym);
      });
    }
  }

  /**
   * Sets the data of mapLayerControl.
   */
  private setLayerControl(): void {
    this.toponymyData.getFemaleToponyms().subscribe(d => {
      this.mapLayerControl.addOverlay(L.geoJSON(d,
        {
          style: { color: '#3388ff' },
          onEachFeature: this.onEachFeatureClosure(this.info)
        }
      ), '<img src="./assets/icons/mini-blue-rect.png"> Toponimi femminili');

      this.toponymyData.getFemaleToponymsToBeInaugurated().subscribe(d => {
        this.mapLayerControl.addOverlay(L.geoJSON(d, {
          style: { color: '#ff3d61' },
          onEachFeature: this.onEachFeatureClosure(this.info)
        }), '<img src="./assets/icons/mini-red-rect.png"> Toponimi femminili da inaugurare');

        this.toponymyData.getPlacesNamedAfterWomen().subscribe(d => {
          this.mapLayerControl.addOverlay(L.geoJSON(d, {
            onEachFeature: this.onEachFeatureClosure(this.info)
          }), '<img src="./assets/icons/mini-blue-icon.png"> Luoghi intitolati a donne');

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
              onEachFeature: this.onEachFeatureClosure(this.info)
            }), '<img src="./assets/icons/mini-red-icon.png"> Luoghi intitolati a donne da inaugurare');
          });
        });
      });
    });
  }

  /**
   * Leaflet map initialization.
   */
  private initMap(): void {
    var map = L.map('map', {
      layers: [
        L.tileLayer(this.streetMaps, {
          attribution: '&copy; OpenStreetMap contributors'
        })
      ],
      minZoom: 12,
      maxZoom: 18,
    });

    map.setMaxBounds(this.bounds);
    this.mapLayerControl.addTo(map);

    map.locate({
      setView: true,
      watch: true,
      maxZoom: 18,
      enableHighAccuracy: true,
      maximumAge: 200,
    });

    var greenIcon = new L.Icon({
      iconUrl: './assets/icons/green-icon.png',
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    var currentPositionMarker!: L.Marker;
    var currentPositionCircle!: L.Circle;

    /**
     * Opens infoDiv in a range of d meters firing a click event.
     * 
     * @param e Leaflet LocationEvent
     * @param d maximum distance in meters to open infoDiv
     */
    function openNearestDialog(e: L.LocationEvent, d: number): void {
      let markerDistances: Array<number> = [];
      let polygonDistances: Array<number> = [];
      let selectedLayer: boolean = false;
      let nearerPolygons: Array<L.Polygon> = [];
      let nearest: string = "None";

      map.eachLayer((l) => {
        if (l instanceof L.Polygon) {
          let nearerPoints: Array<number> = [];
          l.getLatLngs().forEach((element: any) => {
            if (element instanceof Array) {
              element.forEach((coord: any) => {
                let distance: number = 0;
                if (coord instanceof Array) {
                  coord.forEach((c) => {
                    distance = e.latlng.distanceTo(c);
                    if (distance < d) {
                      nearerPoints.push(distance);
                    }
                  });
                } else {
                  distance = e.latlng.distanceTo(coord);
                  if (distance < d) {
                    nearerPoints.push(distance);
                  }
                }
              });
            }
          });
          if (nearerPoints.length > 0) {
            polygonDistances.push(Math.round(Math.min(...nearerPoints) * 100) / 100);
            nearerPolygons.push(l);
          }
        }

        else if (l instanceof L.Marker) {
          let distanceFromUser: number = e.latlng.distanceTo(l.getLatLng());
          if (distanceFromUser < d && distanceFromUser != 0) {
            markerDistances.push(Math.round(distanceFromUser * 100) / 100);
          }
        }
      });

      if (nearerPolygons.length > 0) {
        if (markerDistances.length > 0) {
          if (Math.min(...polygonDistances) < Math.min(...markerDistances)) {
            nearest = "Polygon";
          } else {
            nearest = "Marker";
          }
        } else {
          nearest = "Polygon";
        }
      } else if (markerDistances.length > 0) {
        nearest = "Marker";
      }

      if (nearest === "Polygon") {
        nearerPolygons[polygonDistances.indexOf(Math.min(...polygonDistances))].fire('click');
        return;
      }

      if (nearest === "Marker") {
        map.eachLayer((l) => {
          if (l.hasEventListeners('click') && selectedLayer) {
            selectedLayer = false;
            if (l instanceof L.Layer) {
              l.fire('click');
              return;
            }
          }
          if (l instanceof L.Marker) {
            if (Math.round(e.latlng.distanceTo(l.getLatLng()) * 100) / 100 === Math.min(...markerDistances)) {
              selectedLayer = true;
            }
          }
        });
      }
    }

    function onLocationFoundClosure(d: Array<number>) {
      return function onLocationFound(e: L.LocationEvent) {
        var radius = e.accuracy / 2;

        if (!currentPositionMarker) {
          currentPositionMarker = L.marker(e.latlng, { icon: greenIcon }).addTo(map).bindPopup('<b>You are here</b>');
        }
        if (!currentPositionCircle) {
          currentPositionCircle = L.circle(e.latlng, radius).addTo(map);
        }
        currentPositionMarker.setLatLng(e.latlng);
        currentPositionCircle.setLatLng(e.latlng);

        if (d[0] > 0) {
          openNearestDialog(e, d[0]);
        }
        d[1] = 0;
      }
    }
    map.on('locationfound', onLocationFoundClosure(this.sliderData));

    function onLocationErrorClosure(d: Array<number>) {
      return function onLocationError(e: L.ErrorEvent) {
        map.setView([43.768, 11.253], 16);
        alert(e.message);
        d[1] = -1;
      }
    }
    map.on('locationerror', onLocationErrorClosure(this.sliderData));

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.info.canBeClosed) {
        this.info.close();
      }
    });
  }

  ngOnInit(): void {
    this.setLayerControl();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.info.setSlidingDiv(this.slidingDiv);
  }

  constructor(
    private readonly toponymyData: ToponymyDataService,
    private readonly router: Router,
    private readonly info: InfoDivService,
  ) { }

}
