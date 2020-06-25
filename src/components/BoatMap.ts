import { Map, View } from "ol";
import Layer from "ol/layer/Layer";
import { fromLonLat } from "ol/proj";

export class BoatMap extends Map {
  constructor(layers: Layer[]) {
    super({
      target: <HTMLElement>document.getElementById("map"),
      layers: layers,
      view: new View({
        center: [982062.938921, 6997962.81318],
        zoom: 8,
        projection: "EPSG:3857",
      }),
    });
  }

  defaultZoomAndFocus() {
    this.getView().animate({
      // zoom out
      center: [982062.938921, 6997962.81318],
      duration: 2000,
      zoom: 8,
    });
  }

  focus(lon:number, lat:number) {
      this.getView().animate({
        center: fromLonLat([
          lon,
          lat,
        ]),
        duration: 2000,
      });

  }
}
