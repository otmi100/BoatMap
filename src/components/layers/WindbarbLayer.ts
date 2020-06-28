import TileWMS from 'ol/source/TileWMS';
import TileLayer from "ol/layer/Tile";

export class WindbarbLayer extends TileLayer {
  constructor() {
    super({
      source: new TileWMS({
        url: 'https://maps.dwd.de/geoserver/dwd/RBSN_FF/ows',
        crossOrigin: 'anonymous',
        attributions: '© Deutscher Wetterdienst',
        params: {'LAYERS': 'RBSN_FF', 'STYLES': 'RBSN_FF_Pfeile'},
        serverType: 'geoserver',
        
      })
    });
    this.set("layerName", "WindbarbLayer");
  }
}
