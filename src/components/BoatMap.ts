import { Map, View } from "ol";
import Layer from "ol/layer/Layer";
import { fromLonLat } from "ol/proj";
import Projection from "ol/proj/Projection";
import { BoatMapController } from "../controllers/BoatMapController";

export class BoatMap extends Map {

  private boatMapController: BoatMapController;

  constructor(layers: Layer[], projection: Projection, boatMapController: BoatMapController) {
    super({
      target: <HTMLElement>document.getElementById("map"),
      layers: layers,
      view: new View({
        center: [982062.938921, 6997962.81318],
        zoom: 8,
        projection: projection.getCode(),
      }),
    });

    this.boatMapController = boatMapController;
    this.registerMouseInteraction();
  }

  registerMouseInteraction(): void {
    this.on("click", (evt) => {
      var feature = this.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      if (feature) {
        this.boatMapController.featureClick(feature);
      }
    });

    // change mouse cursor when over marker
    this.on("pointermove", (e) => {
      var pixel = this.getEventPixel(e.originalEvent);
      var hit = this.hasFeatureAtPixel(pixel);
      (<HTMLElement>this.getTarget()).style.cursor = hit ? "pointer" : "";
    });
  }

  defaultZoomAndFocus(): void {
    this.getView().animate({
      // zoom out
      center: [982062.938921, 6997962.81318],
      duration: 2000,
      zoom: 8,
    });
  }

  focus(lon: number, lat: number): void {
    this.getView().animate({
      center: fromLonLat([
        lon,
        lat,
      ]),
      duration: 2000,
    });

  }

  setVisibleLayers(layers: string[]): void {
    this.getLayers().forEach(layer => {
      if (layers.includes(layer.getProperties()["layerName"])) {
        layer.setVisible(true);
      } else {
        layer.setVisible(false);
      }
    });
  }
}
