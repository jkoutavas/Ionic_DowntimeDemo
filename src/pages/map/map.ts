import { Component, ViewChild, ElementRef } from '@angular/core';

import { DowntimeData } from '../../providers/downtime-data';

import { Platform } from 'ionic-angular';


declare var google: any;


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  private markers:any[] = [];
  private infoWindows:any[] = [];

  @ViewChild('mapCanvas') mapElement: ElementRef;
  constructor(public data: DowntimeData, public platform: Platform) {
  }

  ionViewDidLoad() {

      let mapData: any = this.data.getMap();
      let mapEle = this.mapElement.nativeElement;

      let map = new google.maps.Map(mapEle, {
        center: mapData.find((d: any) => d.center),
        zoom: 5
      });

      mapData.forEach((markerData: any) => {
        const factory = this.data.getFactories().find((f: any) => f.id == markerData.factoryId);

        let infoWindow = new google.maps.InfoWindow({
          content: `<h5>${factory.name}</h5>`
        });

        const marker = new google.maps.Marker({
          position: markerData,
          map: map,
          title: factory.name,
          icon: this.getIcon(this.getHealthColor(factory),"000000","000000")
        });
        marker.factory = factory;
        this.markers.push(marker);

        marker.addListener('click', () => {
          this.closeAllInfoWindows();
          infoWindow.open(map, marker);
        });
        this.infoWindows.push(infoWindow);
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });

      this.data.overallHealth.subscribe((_: number) => {
        this.markers.forEach((marker: any) => {
          marker.setIcon(this.getIcon(this.getHealthColor(marker.factory),"000000","000000"));
        });    
      });
  }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }

  getHealthColor(factory:any) : string {
    const health = factory.upMachines / factory.machines.length;
    let color = "FF0000"; // red
    if( health == 1.0 ) {
      color = "55BF3B"; // green
    } else if( health > 0.3 ) {
      color = "DDDF0D"; // yellow
    }
    return color;
  }

  getIcon(fillColor:string, textColor:string, outlineColor:string) {
    var iconUrl = "http://chart.googleapis.com/chart?cht=d&chdp=mapsapi&chl=pin%27i\\%27[o%27-2%27f\\hv%27a\\]h\\]o\\" + fillColor + "%27fC\\" + textColor + "%27tC\\" + outlineColor + "%27eC\\Lauto%27f\\&ext=.png";
    return iconUrl;
  }

}
