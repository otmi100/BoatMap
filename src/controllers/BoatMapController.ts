import { BoatMap } from "../components/BoatMap";
import { fromLonLat } from "ol/proj";
import { IBoat } from "../interfaces/IBoat";
import { BoatLayer } from "../components/layers/BoatLayer";
import { BoatMenuController } from "./BoatMenuController";
import { SailingAreaLayer } from "../components/layers/SailingAreaLayer";
import { Layer } from "ol/layer";
import { FeatureLike } from "ol/Feature";
import { ILayer } from "../interfaces/ILayer";
import Projection from "ol/proj/Projection";



export class BoatMapController {

  private selectedBoatIndex = -1; // currently selected boat
  private boatMap: BoatMap;
  private boatMenuController: BoatMenuController | undefined;
  private boats: IBoat[];
  private layers: Map<String, Layer> = new Map();

  constructor(boats: IBoat[], projection: Projection, layers: Map<String, Layer>) {
    this.boats = boats;
    this.layers = layers;
    this.boatMap = new BoatMap(Array.from(this.layers.values()), projection, this);
  }

  registerBoatMenuController(boatMenuController: BoatMenuController): void {
    this.boatMenuController = boatMenuController;
  }


  viewBoat(boatIndex: number): void {
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
    if (this.boatMenuController) {
      this.boatMenuController.styleBoatMenu(this.selectedBoatIndex);
    }
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

  setVisibleLayers(layers: string[]): void {
    this.boatMap.setVisibleLayers(layers);
  }

  featureClick(feature: FeatureLike): void {
    let layer = this.layers.get(feature.get("fromLayer"));
    console.log(layer);
    if (layer) {
      (layer as unknown as ILayer).handleClick(feature);
    }

    if (feature.get("fromLayer") == BoatLayer.name) {
      this.viewBoat(<number>feature.getId());
    }
  }

}