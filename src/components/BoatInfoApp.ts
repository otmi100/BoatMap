import { BoatMap } from "./BoatMap";
import { fromLonLat } from "ol/proj";
import { IBoat } from "../interfaces/IBoat";
import { FeatureLike } from "ol/Feature";
import Projection from "ol/proj/Projection";
import { BoatMenu } from "./BoatMenu";
import { IBoatInfoAppLayer } from "../interfaces/IBoatInfoAppLayer";
import { SailingAreaLayer } from "./layers/SailingAreaLayer";
import { BoatLayer } from "./layers/BoatLayer";



export class BoatInfoApp {

  private selectedBoatIndex = -1; // currently selected boat
  private boatMap: BoatMap;
  private boats: IBoat[];
  private layers: Map<String, IBoatInfoAppLayer> = new Map();
  private boatMenu: BoatMenu;

  constructor(boats: IBoat[], projection: Projection, layers: Map<String, IBoatInfoAppLayer>) {
    this.boats = boats;
    this.layers = layers;
    this.boatMap = new BoatMap(Array.from(this.layers.values()), projection, this);
    this.boatMenu = new BoatMenu(boats, Array.from(layers.values()),  this);
    this.updateLayerVisibilty();
  }

  viewBoatOnMap(boatIndex: number): void {
    
    var sailingAreaLayer = <SailingAreaLayer>this.layers.get(SailingAreaLayer.name);
    var boatLayer = <BoatLayer>this.layers.get(BoatLayer.name);

    if (boatIndex == this.selectedBoatIndex) { // Delesect Boat & hide areas
      this.selectedBoatIndex = -1;
      sailingAreaLayer.showAreas([]);
      this.defaultZoomAndFocus();
    } else if (this.boats[boatIndex]) { // select boat, area and focus
      this.selectedBoatIndex = boatIndex;
      this.boatMap.focus(this.boats[boatIndex].location.lon, this.boats[boatIndex].location.lat);
      sailingAreaLayer.showAreas(this.boats[this.selectedBoatIndex].sailingareas);
    } else {
      console.log("Boat with id " + boatIndex + " not found.");
      return;
    }
    boatLayer.highlightBoat(this.selectedBoatIndex);
      this.styleBoatMenu(this.selectedBoatIndex);
  }

  defaultZoomAndFocus(): void {
    this.boatMap.getView().animate({
      // zoom out
      center: [982062.938921, 6997962.81318],
      duration: 2000,
      zoom: 8,
    });
  }

  focus(lon: number, lat: number): void {
    this.boatMap.getView().animate({
      center: fromLonLat([
        lon,
        lat,
      ]),
      duration: 2000,
    });

  }

  featureClick(feature: FeatureLike): void {
    let layer = this.layers.get(feature.get("fromLayer"));
    if (layer) {
      layer.handleClick(feature);
    }
  }

  styleBoatMenu(selectedBoatIndex: number): void {
    this.boatMenu.styleBoatMenu(selectedBoatIndex);
  }

  updateLayerVisibilty(): void {
    let visibleLayers: string[] = [];
    this.layers.forEach(layer => {
      if (this.boatMenu.isLayerChecked(layer.getName())) {
        visibleLayers.push(layer.getName());
      }
    });
    this.boatMap.setVisibleLayers(visibleLayers);
  }
}