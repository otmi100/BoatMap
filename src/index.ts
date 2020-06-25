import "ol/ol.css";
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import * as boatsJson from "./data/boats.json";
import { BoatLayer } from "./components/layers/BoatLayer";
import { SailingAreaLayer } from "./components/layers/SailingAreaLayer";
import { WeatherwarningLayer } from "./components/layers/WeatherwarningLayer";
import { OpenSeaMapLayer } from "./components/layers/OpenSeaMapLayer";
import { BoatMenu } from "./components/BoatMenu";

var selectedBoatIndex = -1; // currently selected boat
var boatMenu: BoatMenu;

var boatLayer = new BoatLayer(boatsJson.boats);
var sailingAreaLayer = new SailingAreaLayer();
var weatherwarningLayer = new WeatherwarningLayer();
var openSeaMapLayer = new OpenSeaMapLayer();

var olView = new View({
  center: [982062.938921, 6997962.81318],
  zoom: 8,
  projection: "EPSG:3857",
});

const map = new Map({
  target: <HTMLElement>document.getElementById("map"),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    openSeaMapLayer,
    weatherwarningLayer,
    sailingAreaLayer,
    boatLayer,
  ],
  view: olView,
});

window.onload = function () {
  boatMenu = new BoatMenu(boatsJson.boats, viewBoat);
};

// display popup on click
map.on("click", function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
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
map.on("pointermove", function (e) {
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  (<HTMLElement>map.getTarget()).style.cursor = hit ? "pointer" : "";
});
/* END clickable icon */

function viewBoat(boatIndex: number) {
  if (boatIndex == selectedBoatIndex) {
    selectedBoatIndex = -1; // Delesect Boat
    sailingAreaLayer.showAreas([]); // Hide sailing areas
    olView.animate({
      // zoom out
      center: [982062.938921, 6997962.81318],
      duration: 2000,
      zoom: 8,
    });
  } else if (boatsJson.boats[boatIndex]) {
    selectedBoatIndex = boatIndex;
    olView.animate({
      center: fromLonLat([
        boatsJson.boats[boatIndex].location.lon,
        boatsJson.boats[boatIndex].location.lat,
      ]),
      duration: 2000,
    });
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
