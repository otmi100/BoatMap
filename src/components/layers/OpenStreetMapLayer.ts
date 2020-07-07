import TileLayer from "ol/layer/Tile";
import { FeatureLike } from "ol/Feature";
import OSM, { ATTRIBUTION } from "ol/source/OSM";
import { IBoatInfoAppLayer, ISetBoatCallback } from "src/interfaces/IBoatInfoAppLayer";
import { Layer } from "ol/layer";
import Source from "ol/source/Source";
import { IBoat } from "src/interfaces/IBoat";

export class OpenStreetMapLayer implements IBoatInfoAppLayer {
  private layer: TileLayer;
  constructor() {
    this.layer = new TileLayer({
      source: new OSM(),
    })
  }
  updateBoatSelection(boat: IBoat | null): void {

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
  handleClick(feature: FeatureLike, setSelectedBoat: ISetBoatCallback): void {

  }
}
