import { Boat } from "./Boat";
import { BoatMapController } from "../controllers/BoatMapController";
import { BoatMenuController } from "../controllers/BoatMenuController";

export class BoatMenu {

  private layers = [
    { name: "OpenStreetMapLayer", innerHTML: "Basiskarte OpenStreetMap", inputElement: {} },
    { name: "OpenSeaMapLayer", innerHTML: "OpenSeaMap Layer", inputElement: {} },
    { name: "WeatherwarningLayer", innerHTML: "Zeige Wetterwarnungen des DWD <br>(Anzahl: <span id=\"warndingcount\"></span><div id=\"spinner\"></div>)", inputElement: {} },
    { name: "WindbarbLayer", innerHTML: "Zeige Windfahnen (Quelle: DWD)", inputElement: {} },
  ];

  private boatMenuController: BoatMenuController;

  constructor(boats: Boat[], boatMenuController: BoatMenuController) {
    this.boatMenuController = boatMenuController;
    this.generateLayerCheckboxes(boatMenuController);
    this.generateBoatList(boats, boatMenuController);
  }

  generateBoatList(boats: Boat[], boatMenuController: BoatMenuController) {
    const boatList = document.getElementById("boats");
    if (boatList) {
      boats.forEach((boat, index) => {
        var boatEntry = document.createElement("li");
        boatEntry.appendChild(document.createTextNode(boat.name));
        boatEntry.appendChild(document.createElement("BR"));
        boatEntry.appendChild(document.createTextNode(boat.type));
        boatEntry.onclick = () => boatMenuController.viewBoat(index);
        boatList.appendChild(boatEntry);
      });
    }
  }

  generateLayerCheckboxes(boatMenuController: BoatMenuController) {
    const switcherElements = document.getElementById("layerswitcher");
    this.layers.forEach(layer => {
      var layerLabel = document.createElement("label");
      var layerCheckBox = document.createElement("INPUT");
      layerCheckBox.setAttribute("type", "checkbox");
      layerCheckBox.setAttribute("id", layer.name);
      layerLabel.appendChild(layerCheckBox);
      var caption = document.createElement("SPAN");
      caption.innerHTML = layer.innerHTML;
      layerLabel.appendChild(caption);
      layerCheckBox.onclick = () => boatMenuController.setLayerVisibilty();
      layer.inputElement = layerCheckBox;
      switcherElements?.appendChild(layerLabel);
      switcherElements?.appendChild(document.createElement("BR"));

    });
  }

  /*
<label class="switch">
<input type="checkbox" id="seamaplayer">
Zeige Seekarte<br>
Quelle: OpenSeaMap.org
</label><br />
<label class="switch">
<input type="checkbox" id="dwdwarninglayer">
Zeige Wetterwarnungen <br>
Quelle: Deutscher Wetterdienst
</label><br />
<label class="switch">
<input type="checkbox" id="osmlayer">
Zeige OpenStreetMap
Quelle: OpenStreetMap.org
</label><br />
<label class="switch">
<input type="checkbox" id="windbarblayer">
Zeige Windfahnen
Quelle: Deutscher Wetterdienst
</label><br />*/


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
