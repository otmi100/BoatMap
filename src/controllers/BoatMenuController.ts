import { BoatMenu } from "../components/BoatMenu";
import { IBoat } from "../interfaces/IBoat";
import { BoatMapController } from "./BoatMapController";
import { Layer } from "ol/layer";
import { ILayer } from "../interfaces/ILayer";

export class BoatMenuController {
  private boatMenu: BoatMenu;
  private boatMapController: BoatMapController | undefined;
  private layers: Map<String, Layer>;

  constructor(boats: IBoat[], layers: Map<String, Layer>) {
    this.layers = layers;
    let interfaceLayers: ILayer[] = []; 
    layers.forEach ( layer => {
      interfaceLayers.push(<ILayer><unknown>layer);
    })
    this.boatMenu = new BoatMenu(boats, interfaceLayers, this);
    this.updateLayerVisibilty();
  }

  viewBoatOnMap(boatIndex: number) {
    this.boatMapController?.viewBoat(boatIndex);
  }

  styleBoatMenu(selectedBoatIndex: number) {
    this.boatMenu.styleBoatMenu(selectedBoatIndex);
  }
  
  updateLayerVisibilty() : void {
    let visibleLayers:string[] = [];
    this.layers.forEach(layer => {
      if(this.boatMenu.isLayerChecked(layer.getProperties()["layerName"])) {
        visibleLayers.push(layer.getProperties()["layerName"]);
      }
    });
    this.boatMapController?.setVisibleLayers(visibleLayers);
  }

  registerBoatMapController(boatMapController: BoatMapController) {
    this.boatMapController = boatMapController;
  }
}
