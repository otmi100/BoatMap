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

var selectedBoatIndex = -1; // currently selected boat
var boatMenu: BoatMenu;

var boatLayer = new BoatLayer(boatsJson.boats);
var sailingAreaLayer = new SailingAreaLayer();
var weatherwarningLayer = new WeatherwarningLayer();
var openSeaMapLayer = new OpenSeaMapLayer();
var openStreetMapLayer = new TileLayer({
  source: new OSM(),
});

const boatMap = new BoatMap([boatLayer, sailingAreaLayer, weatherwarningLayer, openSeaMapLayer, openStreetMapLayer]);

window.onload = function () {
  boatMenu = new BoatMenu(boatsJson.boats, viewBoat);
};

// click on map handler
boatMap.on("click", function (evt) {
  var feature = boatMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    if (feature.get("featureType") == "dwdWarning") {
      alert(
        feature.getProperties()["SEVERITY"] +
          ": " +
          feature.getProperties()["DESCRIPTION"]
      );
    } else if (feature.get("featureType") == "sailingboat") {
      viewBoat(<number>feature.getId());
    } else {
      console.log("Dont know what to do with this...");
      console.log(feature);
    }
  }
});

// change mouse cursor when over marker
boatMap.on("pointermove", function (e) {
  var pixel = boatMap.getEventPixel(e.originalEvent);
  var hit = boatMap.hasFeatureAtPixel(pixel);
  (<HTMLElement>boatMap.getTarget()).style.cursor = hit ? "pointer" : "";
});
/* END clickable icon */

function viewBoat(boatIndex: number) {
  if (boatIndex == selectedBoatIndex) {
    selectedBoatIndex = -1; // Delesect Boat
    sailingAreaLayer.showAreas([]); // Hide sailing areas
    boatMap.defaultZoomAndFocus();
  } else if (boatsJson.boats[boatIndex]) {
    selectedBoatIndex = boatIndex;
    boatMap.focus(boatsJson.boats[boatIndex].location.lon, boatsJson.boats[boatIndex].location.lat);
    sailingAreaLayer.showAreas(boatsJson.boats[selectedBoatIndex].sailingareas);
  } else {
    console.log("Boat with id " + boatIndex + " not found.");
    return;
  }

  boatLayer.highlightBoat(selectedBoatIndex);
  boatMenu.styleBoatMenu(selectedBoatIndex);
}

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
