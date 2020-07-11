import { BoatMap } from "./BoatMap";
import { fromLonLat } from "ol/proj";
import { IBoat } from "../interfaces/IBoat";
import { FeatureLike } from "ol/Feature";
import Projection from "ol/proj/Projection";
import { BoatMenu } from "./BoatMenu";
import { IBoatInfoAppLayer, ISetBoatCallback } from "../interfaces/IBoatInfoAppLayer";
import { Layer } from "ol/layer";

export class BoatInfoApp {

  static LAYERNAMEATTRIBUTE = "layerName";

  private boatMap: BoatMap;
  private boats: IBoat[];
  private layers: Map<String, IBoatInfoAppLayer> = new Map();
  private boatMenu: BoatMenu;

  constructor(boats: IBoat[], projection: Projection, layers: Map<String, IBoatInfoAppLayer>) {
    this.boats = boats;
    this.layers = layers;
    this.setLayerNameAttribute();
    this.boatMap = new BoatMap(Array.from(layers.values()), projection, this);
    this.boatMenu = new BoatMenu(boats, Array.from(layers.values()),  this);
    this.updateLayerVisibilty();
  }

  updateSelectedBoat(boat: IBoat | null): void {
    this.layers.forEach(layer => layer.updateBoatSelection(boat));
    this.boatMenu.styleBoatMenu(this.boats.findIndex(b => b === boat));
    this.boatMap.focus(boat?.location.lon, boat?.location.lat);
  }

  featureClick(feature: FeatureLike, olLayer: Layer): void {
    let layer = this.layers.get(olLayer.get(BoatInfoApp.LAYERNAMEATTRIBUTE));
    if (layer) {
      layer.handleClick(feature, (boat : IBoat | null ) => {
        this.updateSelectedBoat(boat);
      });
    }
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

  // write a layer name into olLayer to figure out which layer was clicked
  private setLayerNameAttribute() : void {
    this.layers.forEach(layer => {
      layer.getOlLayer().set(BoatInfoApp.LAYERNAMEATTRIBUTE,layer.getName());
    })
  }
}