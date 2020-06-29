import "ol/ol.css";

import * as boatsJson from "./data/boats.json";
import { BoatMenu } from "./components/BoatMenu";
import { BoatMapController } from "./controllers/BoatMapController";
import { BoatMenuController } from "./controllers/BoatMenuController";



var boatMenu: BoatMenu;


var boatMenuController: BoatMenuController;
var boatMapController: BoatMapController;

window.onload = function () {
  boatMapController = new BoatMapController(boatsJson.boats);
  boatMenuController = new BoatMenuController(boatsJson.boats);
  boatMapController.registerBoatMenuController(boatMenuController);
  boatMenuController.registerBoatMapController(boatMapController);
};



// Layer Switcher
/*


function dwdwarningLayerVisibility() {
  if ((<HTMLInputElement>document.getElementById("dwdwarninglayer")).checked) {
    weatherwarningLayer.setVisible(true);
  } else {
    weatherwarningLayer.setVisible(false);
  }
}
dwdwarningLayerVisibility();
(<HTMLElement>document.getElementById("dwdwarninglayer"))

function osmLayerVisibility() {
  if ((<HTMLInputElement>document.getElementById("osmlayer")).checked) {
    openStreetMapLayer.setVisible(true);
  } else {
    openStreetMapLayer.setVisible(false);
  }
}
osmLayerVisibility();
(<HTMLElement>document.getElementById("osmlayer")).addEventListener(
  "click",
  osmLayerVisibility
);

function windbarblayerVisibility() {
  if ((<HTMLInputElement>document.getElementById("windbarblayer")).checked) {
    windbarbLayer.setVisible(true);
  } else {
    windbarbLayer.setVisible(false);
  }
}
windbarblayerVisibility();
(<HTMLElement>document.getElementById("windbarblayer")).addEventListener(
  "click",
  windbarblayerVisibility
);
*/