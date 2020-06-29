import "ol/ol.css";

import * as boatsJson from "./data/boats.json";
import { BoatMapController } from "./controllers/BoatMapController";
import { BoatMenuController } from "./controllers/BoatMenuController";


var boatMenuController: BoatMenuController;
var boatMapController: BoatMapController;

window.onload = function () {
  boatMapController = new BoatMapController(boatsJson.boats);
  boatMenuController = new BoatMenuController(boatsJson.boats);
  boatMapController.registerBoatMenuController(boatMenuController);
  boatMenuController.registerBoatMapController(boatMapController);
};