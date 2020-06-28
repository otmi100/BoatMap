import { BoatMap } from "../components/BoatMap";
import { fromLonLat } from "ol/proj";
import Layer from "ol/layer/Layer";
import { SailingAreaLayer } from "../components/layers/SailingAreaLayer";
import { Boat } from "../components/Boat";
import { BoatLayer } from "../components/layers/BoatLayer";
import { BoatMenu } from "../components/BoatMenu";
import { BoatMenuController } from "./BoatMenuController";

export class BoatMapController {

  private selectedBoatIndex = -1; // currently selected boat
  private boatMap: BoatMap;
  private boatMenuController: BoatMenuController | undefined;
  private boats: Boat[];

  constructor(boats: Boat[], boatMap: BoatMap) {
    this.boats = boats;

    boatMap.on("click", (evt) => {
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
          this.viewBoat(<number>feature.getId());
        } else {
          console.log("Dont know what to do with this...");
          console.log(feature);
        }
      }
    });

    // change mouse cursor when over marker
    boatMap.on("pointermove", (e) => {
      var pixel = boatMap.getEventPixel(e.originalEvent);
      var hit = boatMap.hasFeatureAtPixel(pixel);
      (<HTMLElement>boatMap.getTarget()).style.cursor = hit ? "pointer" : "";
    });

    this.boatMap = boatMap;
  }

  registerBoatMenuController(boatMenuController: BoatMenuController) {
    this.boatMenuController = boatMenuController;
  }

  viewBoat(boatIndex: number) {
    console.log(this.boatMap.getLayers());
    var sailingAreaLayer = <SailingAreaLayer>this.boatMap.getLayer("SailingAreaLayer");
    var boatLayer = <BoatLayer>this.boatMap.getLayer("BoatLayer");

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

    console.log(this.boatMap);
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
}