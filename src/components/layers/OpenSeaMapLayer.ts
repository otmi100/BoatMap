import TileLayer from "ol/layer/Tile";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import { ILayer } from "../ILayer";
import { FeatureLike } from "ol/Feature";

export class OpenSeaMapLayer extends TileLayer implements ILayer {
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
    this.set("layerName", OpenSeaMapLayer.name);
  }
  handleClick(number: FeatureLike): void {
    throw new Error("Method not implemented.");
  }
}
