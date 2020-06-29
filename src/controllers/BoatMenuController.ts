import { BoatMenu } from "../components/BoatMenu";
import { Boat } from "../components/Boat";
import { BoatMapController } from "./BoatMapController";

export class BoatMenuController {
  private boatMenu: BoatMenu;
  private boatMapController: BoatMapController | undefined;

  x = "test";

  constructor(boats: Boat[]) {
    this.boatMenu = new BoatMenu(boats, this);
  }

  viewBoat(boatIndex: number) {
    this.boatMapController?.viewBoat(boatIndex);
  }

  styleBoatMenu(selectedBoatIndex: number) {
    this.boatMenu.styleBoatMenu(selectedBoatIndex);
  }
  
  setLayerVisibilty() : void {
    let visibleLayers:string[] = [];
    this.boatMenu.getLayers().forEach(layer => {
      if((<HTMLInputElement>layer.inputElement).checked) {
        console.log(layer.name);
        visibleLayers.push(layer.name);
      }
    });
    this.boatMapController?.setVisibleLayers(visibleLayers);
  }

  registerBoatMapController(boatMapController: BoatMapController) {
    this.boatMapController = boatMapController;
  }
}
