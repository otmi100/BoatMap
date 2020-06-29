import TileLayer from "ol/layer/Tile";
import OSM, { ATTRIBUTION } from "ol/source/OSM";

export class OpenStreetMapLayer extends TileLayer {
  constructor() {
    super({
      source: new OSM(),
    });
    this.set("layerName", "OpenStreetMapLayer");
  }
}
