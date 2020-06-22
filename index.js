import "ol/ol.css";
import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Point from "ol/geom/Point";
import { Fill, Stroke, Style, Text, Icon } from "ol/style";
import { fromLonLat } from "ol/proj";
import WFS from "ol/format/WFS";

var selectedBoatIndex = -1;

const unterweserJson = require("./data/Unterweser.geojson");
const mittelweserJson = require("./data/Mittelweser.geojson");
const nordseeJson = require("./data/Nordsee.geojson");
const ostseeJson = require("./data/Ostsee.geojson");
const boatsJson = require("./data/boats.json");

var openSeaMapLayer = new TileLayer({
  source: new OSM({
    attributions: [
      '© <a href="http://www.openseamap.org/">OpenSeaMap</a>',
      ATTRIBUTION,
    ],
    opaque: false,
    url: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
    tileOptions: { crossOriginKeyword: "anonymous" },
    visible: false,
  }),
});

// Add Sailing Areas layers
var sailingareas = [
  { name: "Unterweser", geoJson: unterweserJson },
  { name: "Mittelweser", geoJson: mittelweserJson },
  { name: "Nordsee", geoJson: nordseeJson },
  { name: "Ostsee", geoJson: ostseeJson },
];
var sailingareaLayers = {};
sailingareas.forEach((sailingarea) => {
  sailingareaLayers[sailingarea.name] = new VectorLayer({
    source: new VectorSource({
      url: sailingarea.geoJson,
      format: new GeoJSON(),
    }),
    visible: false,
  });
});


/*
// weather experiment
var featureRequest = new WFS().writeGetFeature({
  srsName: "EPSG:3857",
  featureNS: "https://maps.dwd.de/geoserver/dwd/ows",
  featurePrefix: "dwd",
  featureTypes: ["Warnungen_Gemeinden"],
  outputFormat: "application/json",
});

// then post the request and add the received features to a layer
fetch("https://maps.dwd.de/geoserver/dwd/ows", {
  method: "POST",
  body: new XMLSerializer().serializeToString(featureRequest),
})
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (json) {
    var features = new GeoJSON().readFeatures(json);
    console.log(features);
    vectorSource.addFeatures(features);
    map.getView().fit(vectorSource.getExtent());
  });

var vectorSource = new VectorSource();
var vector = new VectorLayer({
  source: vectorSource,
  style: new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 255, 1.0)",
      width: 2,
    }),
  }),
});*/

//END WEATHER experiment

var olView = new View({
  center: [982062.938921, 6997962.81318],
  zoom: 8,
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    openSeaMapLayer,
  ],
  view: olView,
});

sailingareas.forEach((sailingarea) => {
  map.addLayer(sailingareaLayers[sailingarea.name]);
});

window.onload = function () {
  loadBoats();
};

function loadBoats() {
  const boatList = document.getElementById("boats");
  boatsJson.boats.forEach((boat, index) => {

    var boatEntry = document.createElement("li");

    boatEntry.appendChild(document.createTextNode(boat.name));
    boatEntry.appendChild(document.createElement("BR"));
    boatEntry.appendChild(document.createTextNode(boat.type));

    boatEntry.onclick = function () {
      viewBoat(index);
    };
    boatList.appendChild(boatEntry);

  });
}

// Add a layer for each boat
var boatLayers = [];
import boatlogo from "./data/img/boat.svg";

var iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: "fraction",
    anchorYUnits: "pixels",
    src: boatlogo,
    scale: 0.05,
  }),
});

boatsJson.boats.forEach((boat, boatIndex) => {
  var boatFeature = new Feature({
    geometry: new Point(fromLonLat([boat.location.lon, boat.location.lat])),
    name: boat.name,
  });
  boatFeature.setStyle(iconStyle);

  var layer = new VectorLayer({
    source: new VectorSource({
      features: [boatFeature],
    }),
    name: boat.name,
    visible: true,
  });

  boatLayers[boatIndex] = layer;
  console.log(boat.name + ": boatlayer: " + boatIndex)
  map.addLayer(layer);
});

function viewBoat(boatIndex) {
  if(boatIndex == selectedBoatIndex) {
    selectedBoatIndex = -1;
    olView.animate({
      center: [982062.938921, 6997962.81318],
      duration: 2000,
      zoom: 8,
    });
  } else {
    selectedBoatIndex = boatIndex;
  }

  var boats = document.getElementById("boats").getElementsByTagName("li");
  for(var i = 0;i<boats.length;i++) {
    if(selectedBoatIndex == -1) {

      boatLayers[boatIndex].setVisible(true);
      boats[i].classList.remove("active");
      // todo segelreviere unsichtbar
    } else if(selectedBoatIndex == i) {
      console.log(boats[0].get + ": boatlayer: " + boatIndex + " wird aktiviert.");
      boatLayers[boatIndex].setVisible(false);
      boats[i].classList.add("active");
      /*olView.animate({
        center: fromLonLat([
          boatsJson.boats[boatIndex].location.lon,
          boatsJson.boats[boatIndex].location.lat,
        ]),
        duration: 2000,
        zoom: 13,
      });*/
      /*boatsJson.boats[boatIndex].sailingarea.forEach((sa) => {
        sailingareaLayers[sa].setVisible(true);
      });*/
    } else {
      boats[i].classList.remove("active");
      boatLayers[boatIndex].setVisible(false);
    }
  }
 



}

// OpenSeaMap Switcher
function openSeaMapLayerVisibility() {
  if (document.getElementById("seamaplayer").checked) {
    openSeaMapLayer.setVisible(true);
  } else {
    openSeaMapLayer.setVisible(false);
  }
}
openSeaMapLayerVisibility();
document
  .getElementById("seamaplayer")
  .addEventListener("click", openSeaMapLayerVisibility);
