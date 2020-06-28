import "ol/ol.css";

import OSM from "ol/source/OSM";
import * as boatsJson from "./data/boats.json";
import { BoatLayer } from "./components/layers/BoatLayer";
import { SailingAreaLayer } from "./components/layers/SailingAreaLayer";
import { WeatherwarningLayer } from "./components/layers/WeatherwarningLayer";
import { OpenSeaMapLayer } from "./components/layers/OpenSeaMapLayer";
import TileLayer from "ol/layer/Tile";
import { BoatMenu } from "./components/BoatMenu";
import { BoatMap } from "./components/BoatMap";
import { WindbarbLayer } from "./components/layers/WindbarbLayer";
import { BoatMapController } from "./controllers/BoatMapController";
import { BoatMenuController } from "./controllers/BoatMenuController";


var boatMenu: BoatMenu;

var boatLayer = new BoatLayer(boatsJson.boats);
var sailingAreaLayer = new SailingAreaLayer();
var weatherwarningLayer = new WeatherwarningLayer();
var openSeaMapLayer = new OpenSeaMapLayer();
var openStreetMapLayer = new TileLayer({
  source: new OSM(),
});
var windbarbLayer = new WindbarbLayer();

const boatMap = new BoatMap([openSeaMapLayer, openStreetMapLayer, sailingAreaLayer, weatherwarningLayer, windbarbLayer, boatLayer]);
var boatMenuController: BoatMenuController;
var boatMapController: BoatMapController;

window.onload = function () {
  boatMapController = new BoatMapController(boatsJson.boats, boatMap);
  boatMenu = new BoatMenu(boatsJson.boats, boatMapController);
  boatMenuController = new BoatMenuController(boatMenu);
  boatMapController.registerBoatMenuController(boatMenuController);
  

};



// Layer Switcher
function openSeaMapLayerVisibility() {
  if ((<HTMLInputElement>document.getElementById("seamaplayer")).checked) {
    openSeaMapLayer.setVisible(true);
  } else {
    openSeaMapLayer.setVisible(false);
  }
}
openSeaMapLayerVisibility();
(<HTMLElement>document.getElementById("seamaplayer")).addEventListener(
  "click",
  openSeaMapLayerVisibility
);

function dwdwarningLayerVisibility() {
  if ((<HTMLInputElement>document.getElementById("dwdwarninglayer")).checked) {
    weatherwarningLayer.setVisible(true);
  } else {
    weatherwarningLayer.setVisible(false);
  }
}
dwdwarningLayerVisibility();
(<HTMLElement>document.getElementById("dwdwarninglayer")).addEventListener(
  "click",
  dwdwarningLayerVisibility
);

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
