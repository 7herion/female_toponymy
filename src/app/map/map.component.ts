import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as L from 'leaflet';
import { DescriptionComponent } from '../description/description.component';
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

  private streetMaps = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  private corner1 = L.latLng(43.84, 11.145);
  private corner2 = L.latLng(43.718, 11.348);
  private bounds = L.latLngBounds(this.corner1, this.corner2);

  private mapLayerControl = L.control.layers(undefined, undefined, { collapsed: false });

  private onEachFeatureClosure(matDialog: MatDialog) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.height = "80vh";
    dialogConfig.width = "95vw";
    dialogConfig.maxWidth = "650px";
    // dialogConfig.disableClose = true;
    return function onEachFeature(featureData: any, featureLayer: L.Layer) {
      let toponym: string = "Toponym";
      if (featureData.properties.hasOwnProperty('TOPONIMO')) {
        toponym = featureData.properties.TOPONIMO;
      } else if (featureData.properties.hasOwnProperty('Testo')) {
        toponym = featureData.properties.Testo;
      }
      featureLayer.bindPopup('<b>' + toponym + '</b>');
      featureLayer.on('mouseover', function (e: L.LeafletMouseEvent) {
        featureLayer.openPopup(e.latlng);
      });
      featureLayer.on('mouseout', () => {
        featureLayer.closePopup();
      });
      featureLayer.on('click', function () {
        dialogConfig.data = toponym;
        if (matDialog.openDialogs.length == 0) {
          matDialog.open(DescriptionComponent, dialogConfig);
        }
      });
    }
  }

  setLayerControl(): void {
    this.toponymyData.getFemaleToponyms().subscribe(d => {
      this.mapLayerControl.addOverlay(L.geoJSON(d,
        {
          style: { color: '#3388ff' },
          onEachFeature: this.onEachFeatureClosure(this.matDialog)
        }
      ), 'Toponimi femminili');

      this.toponymyData.getFemaleToponymsToBeInaugurated().subscribe(d => {
        this.mapLayerControl.addOverlay(L.geoJSON(d, {
          style: { color: '#ff3d61' },
          onEachFeature: this.onEachFeatureClosure(this.matDialog)
        }), 'Toponimi femminili da inaugurare');

        this.toponymyData.getPlacesNamedAfterWomen().subscribe(d => {
          this.mapLayerControl.addOverlay(L.geoJSON(d, {
            onEachFeature: this.onEachFeatureClosure(this.matDialog)
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
              onEachFeature: this.onEachFeatureClosure(this.matDialog)
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
    });

    map.setMaxBounds(this.bounds);
    this.mapLayerControl.addTo(map);

    map.locate({
      setView: true,
      watch: true,
      maxZoom: 18,
      enableHighAccuracy: true
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
    var maxDistanceFromUser: number = 2500;

    function openNearestDialog(e: L.LocationEvent) {
      let markerDistances: Array<number> = [];
      let polygonDistances: Array<number> = [];
      let selectedLayer: boolean = false;
      let nearerPolygons: Array<L.Polygon> = [];

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
                    if (distance < maxDistanceFromUser) {
                      nearerPoints.push(distance);
                    }
                  });
                } else {
                  distance = e.latlng.distanceTo(coord);
                  if (distance < maxDistanceFromUser) {
                    nearerPoints.push(distance);
                  }
                }
              });
            }
          });
          nearerPoints = nearerPoints.sort();
          if (nearerPoints.length > 0) {
            polygonDistances.push(Math.round(nearerPoints[0] * 100) / 100);
            nearerPolygons.push(l);
          }
        }

        else if (l instanceof L.Marker) {
          let distanceFromUser: number = e.latlng.distanceTo(l.getLatLng());
          if (distanceFromUser < maxDistanceFromUser && distanceFromUser != 0) {
            markerDistances.push(Math.round(distanceFromUser * 100) / 100);
          }
        }
      });

      if (nearerPolygons.length > 0) {
        nearerPolygons[polygonDistances.indexOf(Math.min(...polygonDistances))].fire('click');
        return;
      }

      markerDistances = markerDistances.sort();

      map.eachLayer((l) => {
        if (l.hasEventListeners('click') && selectedLayer) {
          selectedLayer = false;
          if (l instanceof L.Layer) {
            l.fire('click');
            return;
          }
        }
        if (l instanceof L.Marker) {
          if (Math.round(e.latlng.distanceTo(l.getLatLng()) * 100) / 100 === markerDistances[0]) {
            selectedLayer = true;
          }
        }
      });
    }

    function onLocationFound(e: L.LocationEvent) {
      var radius = e.accuracy / 2;

      if (currentPositionMarker) {
        map.removeLayer(currentPositionMarker);
      }
      if (currentPositionCircle) {
        map.removeLayer(currentPositionCircle);
      }

      currentPositionMarker = L.marker(e.latlng, { icon: greenIcon }).addTo(map).bindPopup('<b>You are here</b>');//.openPopup();
      currentPositionCircle = L.circle(e.latlng, radius).addTo(map);
      openNearestDialog(e);
    }
    map.on('locationfound', onLocationFound);

    function onLocationError(e: L.ErrorEvent) {
      map.setView([43.768, 11.253], 16);
      alert(e.message);
    }
    map.on('locationerror', onLocationError);
  }

  ngOnInit(): void {
    this.setLayerControl();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  constructor(
    private readonly toponymyData: ToponymyDataService,
    private readonly matDialog: MatDialog,
  ) { }

}
