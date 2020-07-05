import "ol/ol.css";

import * as boatsJson from "./data/boats.json";
import { BoatMapController } from "./controllers/BoatMapController";
import { BoatMenuController } from "./controllers/BoatMenuController";
import Projection from "ol/proj/Projection";
import { Layer } from "ol/layer";
import { OpenStreetMapLayer } from "./components/layers/OpenStreetMapLayer";
import { SailingAreaLayer } from "./components/layers/SailingAreaLayer";
import { OpenSeaMapLayer } from "./components/layers/OpenSeaMapLayer";
import { WeatherwarningLayer } from "./components/layers/WeatherwarningLayer";
import { WindbarbLayer } from "./components/layers/WindbarbLayer";
import { BoatLayer } from "./components/layers/BoatLayer";

const projection = new Projection({ code: "EPSG:3857" });

let layers: Map<String, Layer> = new Map();
layers.set(OpenStreetMapLayer.name, new OpenStreetMapLayer());
layers.set(SailingAreaLayer.name, new SailingAreaLayer(projection));
layers.set(OpenSeaMapLayer.name, new OpenSeaMapLayer());
layers.set(WeatherwarningLayer.name, new WeatherwarningLayer(projection));
layers.set(WindbarbLayer.name, new WindbarbLayer(projection));
layers.set(BoatLayer.name, new BoatLayer(boatsJson.boats, projection));

var boatMenuController: BoatMenuController;
var boatMapController: BoatMapController;

window.onload = function () {
  boatMapController = new BoatMapController(boatsJson.boats, projection, layers);
  boatMenuController = new BoatMenuController(boatsJson.boats, layers);
  boatMapController.registerBoatMenuController(boatMenuController);
  boatMenuController.registerBoatMapController(boatMapController);
  boatMenuController.updateLayerVisibilty();
};