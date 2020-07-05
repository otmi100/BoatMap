import TileLayer from "ol/layer/Tile";
import { FeatureLike } from "ol/Feature";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import { ILayer } from "../../interfaces/ILayer";

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
  getName(): string {
    return OpenSeaMapLayer.name;
  }
  getMenuHtml(): string {
    return "OpenSeaMap Layer (nur im Detail-Zoom m&ouml;glich)";
  }
  getCheckedDefault(): boolean {
    return false;
  }
  handleClick(feature: FeatureLike): void {

  }
}
