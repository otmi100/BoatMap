import TileLayer from "ol/layer/Tile";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import { ILayer } from "../ILayer";

export class OpenStreetMapLayer extends TileLayer implements ILayer {
  constructor() {
    super({
      source: new OSM(),
    });
    this.set("layerName", OpenStreetMapLayer.name);
  }
  handleClick(number: import("ol/Feature").FeatureLike): void {
    throw new Error("Method not implemented.");
  }
}
