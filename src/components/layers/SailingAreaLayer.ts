import { Style, Fill } from "ol/style";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import Projection from "ol/proj/Projection";

const selectedStyle = new Style({
  fill: new Fill({
    color: "rgba(204, 102, 255,0.5)",
  }),
});

const unselectedStyle = new Style({
  fill: new Fill({
    color: "rgba(0, 0, 0,0)",
  }),
});

export class SailingAreaLayer extends TileLayer {

  constructor(projection: Projection) {

    super({
      source: new TileWMS({
        url: 'http://v39192.php-friends.de:8600/geoserver/wms',
        crossOrigin: 'anonymous',
        attributions: '© Michel Otto',
        params: {'LAYERS': 'boatinfo:segelgebiete', 'STYLES': 'polygon'},
        serverType: 'geoserver',
        projection: projection.getCode(),
      })
    });
    this.set("layerName", "SailingAreaLayer");
  }

  showAreas(sailingAreas: string[]): void {
    console.log(sailingAreas);
    (<TileWMS>this.getSource()).updateParams({
      'LAYERS': 'boatinfo:segelgebiete', 'STYLES': 'polygon',
      'cql_filter': 'name IN (\'' + sailingAreas.join('\', \'') + '\')'
    });

    console.log(this);
  }
}
