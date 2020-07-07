import { IBoat } from "../interfaces/IBoat";
import { BoatInfoApp } from "./BoatInfoApp";
import { IBoatInfoAppLayer } from "src/interfaces/IBoatInfoAppLayer";

export class BoatMenu {

  private boatInfoApp: BoatInfoApp;
  private layerControlers:Map<string,HTMLInputElement> = new Map();
  private selectedBoat: IBoat | null;

  constructor(boats: IBoat[], layers: IBoatInfoAppLayer[], boatInfoApp: BoatInfoApp) {
    this.boatInfoApp = boatInfoApp;
    this.generateBoatList(boats);
    this.generateLayerCheckboxes(layers);
    this.selectedBoat = null;
  }

  generateBoatList(boats: IBoat[]) {
    const boatList = document.getElementById("boats");
    if (boatList) {
      boats.forEach((boat, index) => {
        var boatEntry = document.createElement("li");
        boatEntry.appendChild(document.createTextNode(boat.name));
        boatEntry.appendChild(document.createElement("BR"));
        boatEntry.appendChild(document.createTextNode(boat.type));
        boatEntry.onclick = () => {
          if(this.selectedBoat === boats[index]) {
            this.selectedBoat = null;
            this.boatInfoApp.updateSelectedBoat(null);
          } else {
            this.selectedBoat = boats[index];
            this.boatInfoApp.updateSelectedBoat(boats[index]);
          }
        }
        boatList.appendChild(boatEntry);
      });
    }
  }

  generateLayerCheckboxes(layers: IBoatInfoAppLayer[]) {
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
      layerCheckBox.onclick = () => this.boatInfoApp.updateLayerVisibilty();
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
