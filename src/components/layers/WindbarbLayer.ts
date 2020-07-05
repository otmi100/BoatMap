import TileWMS from 'ol/source/TileWMS';
import TileLayer from "ol/layer/Tile";
import Projection from 'ol/proj/Projection';
import { FeatureLike } from 'ol/Feature';
import { ILayer } from '../../interfaces/ILayer';

export class WindbarbLayer extends TileLayer implements ILayer {
  constructor(projection: Projection) {
    super({
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/dwd/RBSN_FF/ows',
        projection: projection.getCode(),
        crossOrigin: 'anonymous',
        attributions: '© Deutscher Wetterdienst',
        params: {'LAYERS': 'RBSN_FF', 'STYLES': 'RBSN_FF_Pfeile'},
        serverType: 'geoserver',
        
      })
    });
    this.set("layerName", WindbarbLayer.name);
  }
  getName(): string {
    return WindbarbLayer.name;
  }
  getMenuHtml(): string {
    return "Zeige Windfahnen (Quelle: DWD)";
  }
  getCheckedDefault(): boolean {
    return false;
  }
  handleClick(feature: FeatureLike): void {

  }

}
