import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill } from "ol/style";

import sailingareaGeoJson from "../../data/Segelgebiete.geojson";
import { Feature } from "ol";

var vectorSource: VectorSource;
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

export class SailingAreaLayer extends VectorLayer {
  constructor() {
    vectorSource = new VectorSource({
      url: sailingareaGeoJson,
      format: new GeoJSON(),
    });
    super({
      source: vectorSource,
      style: selectedStyle,
      visible: false,
    });

    this.set("layerName", "SailingAreaLayer");
    this.showAreas([]);
  }

  showAreas(sailingAreas: string[]): void {
    this.setVisible(true);
    vectorSource.getFeatures().forEach((feature:Feature) => {
      if (sailingAreas.some((sa) => sa === feature.getProperties()["name"])) {
        feature.setStyle(selectedStyle);
      } else {
        feature.setStyle(unselectedStyle);
      }
    });

  }
}
