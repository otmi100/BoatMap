import { BoatMap } from "./BoatMap";
import { fromLonLat } from "ol/proj";
import { IBoat } from "../interfaces/IBoat";
import { FeatureLike } from "ol/Feature";
import Projection from "ol/proj/Projection";
import { BoatMenu } from "./BoatMenu";
import { IBoatInfoAppLayer, ISetBoatCallback } from "../interfaces/IBoatInfoAppLayer";



export class BoatInfoApp {

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

  updateSelectedBoat(boat: IBoat | null): void {
    this.layers.forEach(layer => layer.updateBoatSelection(boat));
    this.boatMenu.styleBoatMenu(this.boats.findIndex(b => b === boat));
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
      layer.handleClick(feature, (boat : IBoat | null ) => {
        this.updateSelectedBoat(boat);
      });
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