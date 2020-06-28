import TileLayer from "ol/layer/Tile";
import OSM, { ATTRIBUTION } from "ol/source/OSM";

export class OpenSeaMapLayer extends TileLayer {
  constructor() {
    super({
      source: new OSM({
        attributions: [
          '© <a href="http://www.openseamap.org/">OpenSeaMap</a>',
          ATTRIBUTION,
        ],
        opaque: false,
        url: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
        crossOrigin: "anonymous",
      }),
      visible: false,
    });
    this.set("layerName", "OpenSeaMapLayer");
  }
}
