import TileLayer from "ol/layer/Tile";
import { FeatureLike } from "ol/Feature";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import { Layer } from "ol/layer";
import { IBoatInfoAppLayer, ISetBoatCallback } from "src/interfaces/IBoatInfoAppLayer";
import { IBoat } from "src/interfaces/IBoat";

export class OpenSeaMapLayer implements IBoatInfoAppLayer {

  static LAYERNAME = "OpenSeaMapLayer";
  private layer: Layer;

  constructor() {
    this.layer = new TileLayer({
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
  }
  updateBoatSelection(boat: IBoat | null): void {

  }
  getOlLayer(): Layer {
    return this.layer;
  }
  getName(): string {
    return OpenSeaMapLayer.LAYERNAME;
  }
  getMenuHtml(): string {
    return "OpenSeaMap Layer (nur im Detail-Zoom m&ouml;glich)";
  }
  getCheckedDefault(): boolean {
    return false;
  }
  handleClick(feature: FeatureLike, setSelectedBoat: ISetBoatCallback): void {

  }
}
