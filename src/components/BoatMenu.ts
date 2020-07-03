import { IBoat } from "./IBoat";
import { BoatMenuController } from "../controllers/BoatMenuController";
import { OpenSeaMapLayer } from "./layers/OpenSeaMapLayer";
import { WeatherwarningLayer } from "./layers/WeatherwarningLayer";
import { BoatLayer } from "./layers/BoatLayer";
import { SailingAreaLayer } from "./layers/SailingAreaLayer";
import { WindbarbLayer } from "./layers/WindbarbLayer";
import { OpenStreetMapLayer } from "./layers/OpenStreetMapLayer";

export class BoatMenu {

  private layers = [
    { name: OpenStreetMapLayer.name, innerHTML: "Basiskarte OpenStreetMap", inputElement: {}, checkedDefault: true },
    { name: OpenSeaMapLayer.name, innerHTML: "OpenSeaMap Layer (nur im Detail-Zoom m&ouml;glich)", inputElement: {}, checkedDefault: false },
    { name: WeatherwarningLayer.name, innerHTML: "Zeige Wetterwarnungen des DWD <br>(Anzahl: <span id=\"warndingcount\"></span><div id=\"spinner\"></div>)", inputElement: {}, checkedDefault: false },
    { name: WindbarbLayer.name, innerHTML: "Zeige Windfahnen (Quelle: DWD)", inputElement: {}, checkedDefault: false },
    { name: SailingAreaLayer.name, innerHTML: "Zeige Segelgebiete der Boote/des ausgew&auml;hlten Boots", inputElement: {}, checkedDefault: true },
    { name: BoatLayer.name, innerHTML: "Zeige Segelboote des SUB", inputElement: {}, checkedDefault: true },
  ];

  private boatMenuController: BoatMenuController;

  constructor(boats: IBoat[], boatMenuController: BoatMenuController) {
    this.boatMenuController = boatMenuController;
    this.generateBoatList(boats);
    this.generateLayerCheckboxes();
  }

  generateBoatList(boats: IBoat[]) {
    const boatList = document.getElementById("boats");
    if (boatList) {
      boats.forEach((boat, index) => {
        var boatEntry = document.createElement("li");
        boatEntry.appendChild(document.createTextNode(boat.name));
        boatEntry.appendChild(document.createElement("BR"));
        boatEntry.appendChild(document.createTextNode(boat.type));
        boatEntry.onclick = () => this.boatMenuController.viewBoat(index);
        boatList.appendChild(boatEntry);
      });
    }
  }

  generateLayerCheckboxes() {
    const switcherElements = document.getElementById("layerswitcher");
    this.layers.forEach(layer => {
      var layerLabel = document.createElement("label");
      var layerCheckBox = document.createElement("INPUT");
      layerCheckBox.setAttribute("type", "checkbox");
      layerCheckBox.setAttribute("id", layer.name);
      if(layer.checkedDefault) {
        layerCheckBox.setAttribute("checked", "true");
      }
      layerLabel.appendChild(layerCheckBox);
      var caption = document.createElement("SPAN");
      caption.innerHTML = layer.innerHTML;
      layerLabel.appendChild(caption);
      layerCheckBox.onclick = () => this.boatMenuController.updateLayerVisibilty();
      layer.inputElement = layerCheckBox;
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

  getBoatItems() {
    return (<HTMLElement>document.getElementById("boats")).getElementsByTagName(
      "li"
    );
  }

  getLayers() {
    return this.layers;
  }
}
