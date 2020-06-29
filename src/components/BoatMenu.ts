import { Boat } from "./Boat";
import { BoatMenuController } from "../controllers/BoatMenuController";

export class BoatMenu {

  private layers = [
    { name: "OpenStreetMapLayer", innerHTML: "Basiskarte OpenStreetMap", inputElement: {}, checkedDefault: true },
    { name: "OpenSeaMapLayer", innerHTML: "OpenSeaMap Layer (nur im Detail-Zoom m&ouml;glich", inputElement: {}, checkedDefault: false },
    { name: "WeatherwarningLayer", innerHTML: "Zeige Wetterwarnungen des DWD <br>(Anzahl: <span id=\"warndingcount\"></span><div id=\"spinner\"></div>)", inputElement: {}, checkedDefault: false },
    { name: "WindbarbLayer", innerHTML: "Zeige Windfahnen (Quelle: DWD)", inputElement: {}, checkedDefault: false },
    { name: "SailingAreaLayer", innerHTML: "Zeige Segelgebiete der Boote/des ausgew&auml;hlten Boots", inputElement: {}, checkedDefault: true },
    { name: "BoatLayer", innerHTML: "Zeige Segelboote des SUB", inputElement: {}, checkedDefault: true },
  ];

  private boatMenuController: BoatMenuController;

  constructor(boats: Boat[], boatMenuController: BoatMenuController) {
    this.boatMenuController = boatMenuController;
    this.generateBoatList(boats);
    this.generateLayerCheckboxes();
  }

  generateBoatList(boats: Boat[]) {
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
