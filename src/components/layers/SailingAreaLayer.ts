import { Style, Fill } from "ol/style";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import Projection from "ol/proj/Projection";
import { FeatureLike } from "ol/Feature";
import { Layer } from "ol/layer";
import { IBoatInfoAppLayer } from "src/interfaces/IBoatInfoAppLayer";

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

export class SailingAreaLayer implements IBoatInfoAppLayer {

  private layer: Layer;

  constructor(projection: Projection) {

    this.layer = new TileLayer(
      {
        source: new TileWMS({
          url: 'http://v39192.php-friends.de:8600/geoserver/wms',
          crossOrigin: 'anonymous',
          attributions: '© Michel Otto',
          params: { 'LAYERS': 'boatinfo:segelgebiete', 'STYLES': 'polygon' },
          serverType: 'geoserver',
          projection: projection.getCode(),
        })
      }
    );
    this.layer.set("layerName", SailingAreaLayer.name);
  }
  getOlLayer(): Layer {
    return this.layer;
  }
  getName(): string {
    return SailingAreaLayer.name;
  }
  getMenuHtml(): string {
    return "Zeige Segelgebiete der Boote/des ausgew&auml;hlten Boots";
  }
  getCheckedDefault(): boolean {
    return true;
  }
  handleClick(feature: FeatureLike): void {

  }

  showAreas(sailingAreas: string[]): void {
    (<TileWMS>this.layer.getSource()).updateParams({
      'LAYERS': 'boatinfo:segelgebiete', 'STYLES': 'polygon',
      'cql_filter': 'name IN (\'' + sailingAreas.join('\', \'') + '\')'
    });
  }
}
