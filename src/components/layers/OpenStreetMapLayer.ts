import TileLayer from "ol/layer/Tile";
import { FeatureLike } from "ol/Feature";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import { ILayer } from "../../interfaces/ILayer";

export class OpenStreetMapLayer extends TileLayer implements ILayer {
  constructor() {
    super({
      source: new OSM(),
    });
    this.set("layerName", OpenStreetMapLayer.name);
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
