import { Feature } from "ol";
import WFS from "ol/format/WFS";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Fill } from "ol/style";
import Projection from "ol/proj/Projection";
import { FeatureLike } from "ol/Feature";
import { IBoatInfoAppLayer, ISetBoatCallback } from "src/interfaces/IBoatInfoAppLayer";
import { Layer } from "ol/layer";
import Source from "ol/source/Source";
import { IBoat } from "src/interfaces/IBoat";

export class WeatherwarningLayer implements IBoatInfoAppLayer {

  private layer: Layer;

  constructor(projection: Projection) {
    var featureRequest = new WFS().writeGetFeature({
      srsName: projection.getCode(),
      featureNS: "https://maps.dwd.de/geoserver/dwd/ows",
      featurePrefix: "dwd",
      featureTypes: ["Warnungen_Gemeinden"],
      outputFormat: "application/json",
    });

    var vectorSource = new VectorSource();

    fetch("https://maps.dwd.de/geoserver/dwd/ows", {
      method: "POST",
      body: new XMLSerializer().serializeToString(featureRequest),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        var features = new GeoJSON().readFeatures(json);
        if (features.length > 0) {
          features.forEach((feature) => {
            feature.setStyle(
              new Style({
                fill: new Fill({
                  color: this.getColorCode(feature),
                }),
              })
            );
            feature.set("fromLayer", WeatherwarningLayer.name);
          });
          vectorSource.addFeatures(features);
        } else {
          console.log("keine Wetterwarnungen vorhanden.");
        }

        var warncounterElement = document.getElementById("warndingcount");
        var spinnerElement = document.getElementById("spinner");
        if (warncounterElement && spinnerElement) {
          warncounterElement.appendChild(
            document.createTextNode(features.length.toString())
          );
          spinnerElement.style.display = "none";
        }
      });

    this.layer = new VectorLayer({
      source: vectorSource,
      visible: false,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(0, 0, 255, 1.0)",
          width: 0.5,
        }),
      }),
    });

    this.layer.set("layerName", WeatherwarningLayer.name);
  }
  updateBoatSelection(boat: IBoat | null): void {

  }
  getOlLayer(): Layer<Source> {
    return this.layer;
  }

  getName(): string {
    return WeatherwarningLayer.name;
  }
  getMenuHtml(): string {
    return "Zeige Wetterwarnungen des DWD <br>(Anzahl: <span id=\"warndingcount\"></span><div id=\"spinner\"></div>)";
  }
  getCheckedDefault(): boolean {
    return false;
  }

  handleClick(feature: FeatureLike, setSelectedBoat: ISetBoatCallback): void {
    alert(
      feature.getProperties()["SEVERITY"] +
      ": " +
      feature.getProperties()["DESCRIPTION"]
    );
  }

  private getColorCode(feature: Feature): string {
    var colorcode = "rgba(0, 0, 0, 1)";
    switch (feature.getProperties()["SEVERITY"]) {
      case "Minor":
        colorcode = "rgba(153, 255, 51, 0.5)";
        break;
      case "Moderate":
        colorcode = "rgba(255, 255, 51, 0.5)";
        break;
      case "Severe":
        colorcode = "rgba(255, 153, 51, 0.5)";
        break;
      case "Extreme":
        colorcode = "rgba(255, 51, 51, 0.5)";
        break;
    }
    return colorcode;
  }
}
