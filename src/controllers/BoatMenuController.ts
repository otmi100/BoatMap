import { BoatMenu } from "../components/BoatMenu";
import { Boat } from "../components/Boat";
import { BoatMapController } from "./BoatMapController";

export class BoatMenuController {
  private boatMenu: BoatMenu;
  private boatMapController: BoatMapController | undefined;

  constructor(boats: Boat[]) {
    this.boatMenu = new BoatMenu(boats, this);
    this.updateLayerVisibilty();
  }

  viewBoat(boatIndex: number) {
    this.boatMapController?.viewBoat(boatIndex);
  }

  styleBoatMenu(selectedBoatIndex: number) {
    this.boatMenu.styleBoatMenu(selectedBoatIndex);
  }
  
  updateLayerVisibilty() : void {
    let visibleLayers:string[] = [];
    this.boatMenu.getLayers().forEach(layer => {
      if((<HTMLInputElement>layer.inputElement).checked) {
        visibleLayers.push(layer.name);
      }
    });
    this.boatMapController?.setVisibleLayers(visibleLayers);
  }

  registerBoatMapController(boatMapController: BoatMapController) {
    this.boatMapController = boatMapController;
  }
}
