import { BoatMap } from "../components/BoatMap";
import { fromLonLat } from "ol/proj";
import Layer from "ol/layer/Layer";
import { SailingAreaLayer } from "../components/layers/SailingAreaLayer";
import { Boat } from "../components/Boat";
import { BoatLayer } from "../components/layers/BoatLayer";
import { BoatMenu } from "../components/BoatMenu";
import { BoatMenuController } from "./BoatMenuController";
import { WeatherwarningLayer } from "../components/layers/WeatherwarningLayer";
import { OpenSeaMapLayer } from "../components/layers/OpenSeaMapLayer";
import { OpenStreetMapLayer } from "../components/layers/OpenStreetMapLayer";
import { WindbarbLayer } from "../components/layers/WindbarbLayer";

export class BoatMapController {

  private selectedBoatIndex = -1; // currently selected boat
  private boatMap: BoatMap;
  private boatMenuController: BoatMenuController | undefined;
  private boats: Boat[];

  constructor(boats: Boat[]) {
    this.boats = boats;

    var boatLayer = new BoatLayer(boats);
    var sailingAreaLayer = new SailingAreaLayer();
    var weatherwarningLayer = new WeatherwarningLayer();
    var openSeaMapLayer = new OpenSeaMapLayer();
    var openStreetMapLayer = new OpenStreetMapLayer();
    var windbarbLayer = new WindbarbLayer();

    this.boatMap = new BoatMap([openStreetMapLayer, openSeaMapLayer, sailingAreaLayer, weatherwarningLayer, windbarbLayer, boatLayer]);

    this.boatMap.on("click", (evt) => {
      var feature = this.boatMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
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
          this.viewBoat(<number>feature.getId());
        } else {
          console.log("Dont know what to do with this...");
          console.log(feature);
        }
      }
    });

    // change mouse cursor when over marker
    this.boatMap.on("pointermove", (e) => {
      var pixel = this.boatMap.getEventPixel(e.originalEvent);
      var hit = this.boatMap.hasFeatureAtPixel(pixel);
      (<HTMLElement>this.boatMap.getTarget()).style.cursor = hit ? "pointer" : "";
    });

    this.boatMap = this.boatMap;
  }

  registerBoatMenuController(boatMenuController: BoatMenuController) {
    this.boatMenuController = boatMenuController;
  }

  viewBoat(boatIndex: number) {
    var sailingAreaLayer = <SailingAreaLayer>this.boatMap.getLayerByName("SailingAreaLayer");
    var boatLayer = <BoatLayer>this.boatMap.getLayerByName("BoatLayer");

    if (boatIndex == this.selectedBoatIndex) {
      this.selectedBoatIndex = -1; // Delesect Boat
      if (sailingAreaLayer) {
        sailingAreaLayer.showAreas([]); // Hide sailing areas
      }
      this.defaultZoomAndFocus();
    } else if (this.boats[boatIndex]) {
      this.selectedBoatIndex = boatIndex;
      this.boatMap.focus(this.boats[boatIndex].location.lon, this.boats[boatIndex].location.lat);
      if (sailingAreaLayer) {
        (<SailingAreaLayer>sailingAreaLayer).showAreas(this.boats[this.selectedBoatIndex].sailingareas);
      }
    } else {
      console.log("Boat with id " + boatIndex + " not found.");
      return;
    }
    boatLayer.highlightBoat(this.selectedBoatIndex);
    if(this.boatMenuController) {
      this.boatMenuController.styleBoatMenu(this.selectedBoatIndex);
    }
  }

  defaultZoomAndFocus() {
    this.boatMap.getView().animate({
      // zoom out
      center: [982062.938921, 6997962.81318],
      duration: 2000,
      zoom: 8,
    });
  }

  focus(lon: number, lat: number) {
    this.boatMap.getView().animate({
      center: fromLonLat([
        lon,
        lat,
      ]),
      duration: 2000,
    });

  }

  setVisibleLayers(layers: string[]) {
    if(!layers.includes("BoatLayer")) {
      layers.push("BoatLayer")
    }
    if(!layers.includes("SailingAreaLayer")) {
      layers.push("SailingAreaLayer");
    }
    this.boatMap.setVisibleLayers(layers);
  }


}