import TileWMS from 'ol/source/TileWMS';
import TileLayer from "ol/layer/Tile";
import Projection from 'ol/proj/Projection';
import { FeatureLike } from 'ol/Feature';
import { IBoatInfoAppLayer, ISetBoatCallback } from 'src/interfaces/IBoatInfoAppLayer';
import { Layer } from 'ol/layer';
import Source from 'ol/source/Source';
import { IBoat } from 'src/interfaces/IBoat';
import { ATTRIBUTION } from 'ol/source/OSM';

export class WindbarbLayer implements IBoatInfoAppLayer {

  static LAYERNAME = "WindbarbLayer";

  private layer: Layer;

  constructor(projection: Projection) {
    this.layer = new TileLayer({
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/dwd/RBSN_FF/ows',
        projection: projection.getCode(),
        crossOrigin: 'anonymous',
        attributions: ['© DWD', ATTRIBUTION, ],
        params: { 'LAYERS': 'RBSN_FF', 'STYLES': 'RBSN_FF_Pfeile' },
        serverType: 'geoserver',

      })
    });
  }
  updateBoatSelection(boat: IBoat | null): void {
    
  }
  getOlLayer(): Layer<Source> {
    return this.layer;
  }
  getName(): string {
    return WindbarbLayer.LAYERNAME;
  }
  getMenuHtml(): string {
    return "Zeige Windfahnen (Quelle: DWD)";
  }
  getCheckedDefault(): boolean {
    return false;
  }
  handleClick(feature: FeatureLike, setSelectedBoat: ISetBoatCallback): void {

  }

}
