import { BoatMap } from "../components/BoatMap";
import { fromLonLat } from "ol/proj";
import { IBoat } from "../components/IBoat";
import { BoatLayer } from "../components/layers/BoatLayer";
import { BoatMenuController } from "./BoatMenuController";
import { SailingAreaLayer } from "../components/layers/SailingAreaLayer";
import { WeatherwarningLayer } from "../components/layers/WeatherwarningLayer";
import { OpenSeaMapLayer } from "../components/layers/OpenSeaMapLayer";
import { OpenStreetMapLayer } from "../components/layers/OpenStreetMapLayer";
import { WindbarbLayer } from "../components/layers/WindbarbLayer";
import Projection from "ol/proj/Projection";
import { Feature } from "ol";
import { Layer } from "ol/layer";
import { FeatureLike } from "ol/Feature";
import { ILayer } from "src/components/ILayer";

const projection = new Projection({ code: "EPSG:3857" });

export class BoatMapController {

  private selectedBoatIndex = -1; // currently selected boat
  private boatMap: BoatMap;
  private boatMenuController: BoatMenuController | undefined;
  private boats: IBoat[];
  private layers: Map<String, Layer> = new Map();

  constructor(boats: IBoat[]) {
    this.boats = boats;

    this.layers.set(OpenStreetMapLayer.name, new OpenStreetMapLayer());
    this.layers.set(SailingAreaLayer.name, new SailingAreaLayer(projection));
    this.layers.set(OpenSeaMapLayer.name, new OpenSeaMapLayer());
    this.layers.set(WeatherwarningLayer.name, new WeatherwarningLayer(projection));
    this.layers.set(WindbarbLayer.name, new WindbarbLayer(projection));
    this.layers.set(BoatLayer.name, new BoatLayer(boats, projection));

    this.boatMap = new BoatMap(Array.from(this.layers.values()), projection, this);
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
    if (this.boatMenuController) {
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
    this.boatMap.setVisibleLayers(layers);
  }

  featureClick(feature: FeatureLike) {
    let layer = this.layers.get(feature.get("fromLayer"));
    console.log(layer);
    if (layer) {
      (layer as unknown as ILayer).handleClick(feature);
    } 
    
    if (feature.get("fromLayer") == BoatLayer.name) {
      this.viewBoat(<number>feature.getId());
    }
  }
}