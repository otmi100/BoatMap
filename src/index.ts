import "ol/ol.css";

import * as boatsJson from "./data/boats.json";
import Projection from "ol/proj/Projection";
import { OpenStreetMapLayer } from "./components/layers/OpenStreetMapLayer";
import { SailingAreaLayer } from "./components/layers/SailingAreaLayer";
import { OpenSeaMapLayer } from "./components/layers/OpenSeaMapLayer";
import { WeatherwarningLayer } from "./components/layers/WeatherwarningLayer";
import { WindbarbLayer } from "./components/layers/WindbarbLayer";
import { BoatLayer } from "./components/layers/BoatLayer";
import { IBoatInfoAppLayer } from "./interfaces/IBoatInfoAppLayer";
import { BoatInfoApp } from "./components/BoatInfoApp";

const projection = new Projection({ code: "EPSG:3857" });

let layers: Map<String, IBoatInfoAppLayer> = new Map();
layers.set(OpenStreetMapLayer.LAYERNAME, new OpenStreetMapLayer());
layers.set(SailingAreaLayer.LAYERNAME, new SailingAreaLayer(projection));
layers.set(OpenSeaMapLayer.LAYERNAME, new OpenSeaMapLayer());
layers.set(WeatherwarningLayer.LAYERNAME, new WeatherwarningLayer(projection));
layers.set(WindbarbLayer.LAYERNAME, new WindbarbLayer(projection));
layers.set(BoatLayer.LAYERNAME, new BoatLayer(boatsJson.boats, projection));

window.onload = function () {
  new BoatInfoApp(boatsJson.boats, projection, layers);
};