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
import { IBoatInfoAppLayer, ISetBoatCallback } from "src/interfaces/IBoatInfoAppLayer";
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

  static LAYERNAME = "BoatLayer";

  private layer: Layer;
  private boatFeatures: Feature[] = [];
  private boats: IBoat[];
  private selectedBoatId: number;

  constructor(boats: IBoat[], projection: Projection) {
    this.boats = boats;
    boats.forEach((boat, boatIndex) => {
      var boatFeature = new Feature({
        geometry: new Point(fromLonLat([boat.location.lon, boat.location.lat], projection)),
        name: boat.name,
      });
      boatFeature.setStyle(iconStyleFocused);
      boatFeature.setId(boatIndex);
      this.boatFeatures.push(boatFeature);
    });

    this.layer = new VectorLayer({
      source: new VectorSource({
        features: this.boatFeatures,
      }),
      visible: true,
    });
    this.selectedBoatId = -1;
  }
  updateBoatSelection(boat: IBoat): void {
    this.highlightBoat(boat);
  }
  getOlLayer(): Layer<Source> {
    return this.layer;
  }

  getName(): string {
    return BoatLayer.LAYERNAME;
  }
  getMenuHtml(): string {
    return "Zeige Segelboote des SUB";
  }
  getCheckedDefault(): boolean {
    return true;
  }
  handleClick(feature: FeatureLike, setSelectedBoat: ISetBoatCallback): void {
    let boatId = <number>feature.getId();
    if (boatId && this.boats[boatId]) {
      if (boatId == this.selectedBoatId) {
        setSelectedBoat(null);
        this.selectedBoatId = -1;
      } else {
        setSelectedBoat(this.boats[boatId]);
        this.selectedBoatId = boatId;
      }
    }
  }

  private highlightBoat(boat: IBoat): void {
    let boatIndex = this.boats.findIndex(b => b === boat);
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
