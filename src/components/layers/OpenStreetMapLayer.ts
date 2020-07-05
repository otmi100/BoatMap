import TileLayer from "ol/layer/Tile";
import { FeatureLike } from "ol/Feature";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import { IBoatInfoAppLayer } from "src/interfaces/IBoatInfoAppLayer";
import { Layer } from "ol/layer";
import Source from "ol/source/Source";

export class OpenStreetMapLayer implements IBoatInfoAppLayer {
  private layer: TileLayer;
  constructor() {
    this.layer = new TileLayer({
      source: new OSM(),
    })
    this.layer.set("layerName", OpenStreetMapLayer.name);
  }
  getOlLayer(): Layer<Source> {
    return this.layer;
  }

  getName(): string {
    return OpenStreetMapLayer.name;
  }
  getMenuHtml(): string {
    return "Basiskarte OpenStreetMap";
  }
  getCheckedDefault(): boolean {
    return true;
  }
  handleClick(feature: FeatureLike): void {

  }
}
