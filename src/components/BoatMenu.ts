import { IBoat } from "../interfaces/IBoat";
import { BoatMenuController } from "../controllers/BoatMenuController";
import { ILayer } from "../interfaces/ILayer";

export class BoatMenu {

  private boatMenuController: BoatMenuController;
  private layerControlers:Map<string,HTMLInputElement> = new Map();

  constructor(boats: IBoat[], layers: ILayer[], boatMenuController: BoatMenuController) {
    this.boatMenuController = boatMenuController;
    this.generateBoatList(boats);
    this.generateLayerCheckboxes(layers);
  }

  generateBoatList(boats: IBoat[]) {
    const boatList = document.getElementById("boats");
    if (boatList) {
      boats.forEach((boat, index) => {
        var boatEntry = document.createElement("li");
        boatEntry.appendChild(document.createTextNode(boat.name));
        boatEntry.appendChild(document.createElement("BR"));
        boatEntry.appendChild(document.createTextNode(boat.type));
        boatEntry.onclick = () => this.boatMenuController.viewBoatOnMap(index);
        boatList.appendChild(boatEntry);
      });
    }
  }

  generateLayerCheckboxes(layers: ILayer[]) {
    const switcherElements = document.getElementById("layerswitcher");
    layers.forEach(layer => {
      var layerLabel = document.createElement("label");
      var layerCheckBox = document.createElement("INPUT");
      layerCheckBox.setAttribute("type", "checkbox");
      layerCheckBox.setAttribute("id", layer.getName());
      if(layer.getCheckedDefault()) {
        layerCheckBox.setAttribute("checked", "true");
      }
      layerLabel.appendChild(layerCheckBox);
      var caption = document.createElement("SPAN");
      caption.innerHTML = layer.getMenuHtml();
      layerLabel.appendChild(caption);
      layerCheckBox.onclick = () => this.boatMenuController.updateLayerVisibilty();
      this.layerControlers.set(layer.getName(), <HTMLInputElement>layerCheckBox);
      switcherElements?.appendChild(layerLabel);
      switcherElements?.appendChild(document.createElement("BR"));

    });
  }

  styleBoatMenu(selectedBoatIndex: number): void {
    var boats = this.getBoatItems();

    for (var i = 0; i < boats.length; i++) {
      if (selectedBoatIndex == -1) {
        boats[i].classList.remove("active");
      } else if (selectedBoatIndex == i) {
        boats[i].classList.add("active");
      } else {
        boats[i].classList.remove("active");
      }
    }
  }

  getBoatItems() : HTMLCollectionOf<HTMLLIElement> {
    return (<HTMLElement>document.getElementById("boats")).getElementsByTagName(
      "li"
    );
  }

  isLayerChecked(layername: string) : boolean {
    let checkBox = this.layerControlers.get(layername);
    if(checkBox) {
      return (<HTMLInputElement>this.layerControlers.get(layername)).checked;
    } else {
      return false;
    }
  }
}
