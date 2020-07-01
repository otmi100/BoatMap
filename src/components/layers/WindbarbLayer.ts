import TileWMS from 'ol/source/TileWMS';
import TileLayer from "ol/layer/Tile";
import Projection from 'ol/proj/Projection';

export class WindbarbLayer extends TileLayer {
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
    this.set("layerName", "WindbarbLayer");
  }
}
