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
    style: new Style({
      fill: new Fill({
        color: "rgba(204, 102, 255,0.5)",
      }),
    }),
    visible: false,
  });
});

// weather experiment
var featureRequest = new WFS().writeGetFeature({
  srsName: "EPSG:3857",
  featureNS: "https://maps.dwd.de/geoserver/dwd/ows",
  featurePrefix: "dwd",
  featureTypes: ["Warnungen_Gemeinden"],
  outputFormat: "application/json",
});

var vectorSource = new VectorSource();
var warningLayer = new VectorLayer({
  source: vectorSource,
  visible: false,
  style: new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 255, 1.0)",
      width: 0.5,
    }),
  }),
});

// then post the request and add the received features to a layer
fetch("https://maps.dwd.de/geoserver/dwd/ows", {
  method: "POST",
  body: new XMLSerializer().serializeToString(featureRequest),
})
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    var features = new GeoJSON().readFeatures(json);
    // TODO:
    console.log(features);
    if (features.length > 0) {
      features.forEach((feature) => {
        var colorcode;
        switch (feature.values_.SEVERITY) {
          case "Minor":
            colorcode = "rgba(153, 255, 51, 0.5)";
            break;
          case "Moderate":
            colorcode = "rgba(255, 255, 51, 0.5)";
            break;
          case "Severe":
            colorcode = "rgba(255, 153, 51, 0.5)";
            break;
          case "Extreme":
            colorcode = "rgba(255, 51, 51, 0.5)";
            break;
        }
        feature.setStyle(
          new Style({
            fill: new Fill({
              color: colorcode,
            }),
          })
        );
        feature.set("featureType", "dwdWarning");
      });
      vectorSource.addFeatures(features);
    } else {
      console.log("keine Wetterwarnungen vorhanden.");
    }

    document
      .getElementById("warndingcount")
      .appendChild(document.createTextNode(features.length));
    document.getElementById("spinner").style.display = "none";
  });

//END WEATHER experiment

var olView = new View({
  center: [982062.938921, 6997962.81318],
  zoom: 8,
  projection: "EPSG:3857",
});

const map = new Map({
  target: document.getElementById("map"),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    openSeaMapLayer,
    warningLayer,
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
  boatFeature.setId(boatIndex);
  boatFeature.set("featureType", "sailingboat");

  var layer = new VectorLayer({
    source: new VectorSource({
      features: [boatFeature],
    }),
    name: boat.name,
    visible: true,
  });

  boatLayers[boatIndex] = layer;
  map.addLayer(layer);
});

/* START clickable icon */

// display popup on click
map.on("click", function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    console.log(feature);
    if (feature.get("featureType") == "dwdWarning") {
      console.log(feature);
      alert(feature.values_.SEVERITY + ": " + feature.values_.DESCRIPTION)
    } else if (feature.get("featureType") == "sailingboat") {
      viewBoat(feature.getId());
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
  map.getTarget().style.cursor = hit ? "pointer" : "";
});
/* END clickable icon */

function viewBoat(boatIndex) {
  if (boatIndex == selectedBoatIndex) {
    selectedBoatIndex = -1;
    olView.animate({
      center: [982062.938921, 6997962.81318],
      duration: 2000,
      zoom: 8,
    });
  } else if (boatsJson.boats[boatIndex]) {
    selectedBoatIndex = boatIndex;
  } else {
    console.log("Boat with id " + boatIndex + " not found.");
    return;
  }

  sailingareas.forEach((sailingarea) => {
    sailingareaLayers[sailingarea.name].setVisible(false);
  });
  if (selectedBoatIndex >= 0) {
    boatsJson.boats[selectedBoatIndex].sailingareas.forEach(
      (boatSailingarea) => {
        if (sailingareaLayers[boatSailingarea]) {
          sailingareaLayers[boatSailingarea].setVisible(true);
        } else {
          console.log(
            "Das Segelrevier '" +
              boatSailingarea +
              "' des Bootes '" +
              boatsJson.boats[selectedBoatIndex].name +
              "' wurde nicht gefunden."
          );
        }
      }
    );
  }

  var boats = document.getElementById("boats").getElementsByTagName("li");
  for (var i = 0; i < boats.length; i++) {
    if (selectedBoatIndex == -1) {
      boatLayers[i].setVisible(true);
      boats[i].classList.remove("active");
    } else if (selectedBoatIndex == i) {
      boatLayers[i].setVisible(true);
      boats[i].classList.add("active");
      olView.animate({
        center: fromLonLat([
          boatsJson.boats[boatIndex].location.lon,
          boatsJson.boats[boatIndex].location.lat,
        ]),
        duration: 2000,
      });
    } else {
      boats[i].classList.remove("active");
      boatLayers[i].setVisible(false);
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

function dwdwarningLayerVisibility() {
  if (document.getElementById("dwdwarninglayer").checked) {
    warningLayer.setVisible(true);
  } else {
    warningLayer.setVisible(false);
  }
}
dwdwarningLayerVisibility();
document
  .getElementById("dwdwarninglayer")
  .addEventListener("click", dwdwarningLayerVisibility);
