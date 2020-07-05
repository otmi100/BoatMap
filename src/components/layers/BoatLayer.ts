import { Feature } from "ol";
import { FeatureLike } from "ol/Feature";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon } from "ol/style";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import Projection from "ol/proj/Projection";
import boatlogo from "../../data/img/boat.svg";
import { IBoat } from "../../interfaces/IBoat";
import { IBoatInfoAppLayer } from "src/interfaces/IBoatInfoAppLayer";
import { Layer } from "ol/layer";
import Source from "ol/source/Source";


const iconStyleUnfocused = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: IconAnchorUnits.FRACTION,
    anchorYUnits: IconAnchorUnits.PIXELS,
    src: boatlogo,
    scale: 0.05,
    opacity: 0.3,
  }),
});

const iconStyleFocused = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: IconAnchorUnits.FRACTION,
    anchorYUnits: IconAnchorUnits.PIXELS,
    src: boatlogo,
    scale: 0.05,
    opacity: 1,
  }),
});




export class BoatLayer implements IBoatInfoAppLayer {

  private layer: Layer;
  private currentBoatId: number;
  private boatFeatures: Feature[] = [];

  constructor(boats: IBoat[], projection: Projection) {
    boats.forEach((boat, boatIndex) => {
      var boatFeature = new Feature({
        geometry: new Point(fromLonLat([boat.location.lon, boat.location.lat], projection)),
        name: boat.name,
      });
      boatFeature.setStyle(iconStyleFocused);
      boatFeature.setId(boatIndex);
      boatFeature.set("fromLayer", BoatLayer.name);
      boatFeature.set("boatname", boat.name);
      this.boatFeatures.push(boatFeature);
    });

    this.layer = new VectorLayer({
      source: new VectorSource({
        features: this.boatFeatures,
      }),
      visible: true,
    });
    this.layer.set("layerName", BoatLayer.name);

    this.currentBoatId = -1;
  }
  getOlLayer(): Layer<Source> {
    return this.layer;
  }

  getName(): string {
    return BoatLayer.name;
  }
  getMenuHtml(): string {
    return "Zeige Segelboote des SUB";
  }
  getCheckedDefault(): boolean {
    return true;
  }
  handleClick(feature: FeatureLike): void {
    let boatId = <number>feature.getId();
    console.log(boatId);
    console.log(this.currentBoatId);
    if(this.currentBoatId == boatId) {
      boatId = -1;
    }
    this.highlightBoat(boatId);
    this.currentBoatId = boatId;
  }

  highlightBoat(boatIndex: number): void {
    this.boatFeatures.forEach((boatFeature, boatFeatureIndex) => {
      if (boatIndex == -1) {
        boatFeature.setStyle(iconStyleFocused);
      }
      else if (boatIndex == boatFeatureIndex) {
        boatFeature.setStyle(iconStyleFocused);
      }
      else {
        boatFeature.setStyle(iconStyleUnfocused);
      }
    });
  }
}
