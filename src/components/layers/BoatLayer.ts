import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon } from "ol/style";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import boatlogo from "../../data/img/boat.svg";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import { ILayer } from "../ILayer";
import Projection from "ol/proj/Projection";
import { IBoat } from "../IBoat";
import { FeatureLike } from "ol/Feature";


var boatFeatures:Feature[] = [];

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



export class BoatLayer extends VectorLayer implements ILayer {

  constructor(boats: IBoat[], projection: Projection) {

    boats.forEach((boat, boatIndex) => {
      var boatFeature = new Feature({
        geometry: new Point(fromLonLat([boat.location.lon, boat.location.lat],projection)),
        name: boat.name,
      });
      boatFeature.setStyle(iconStyleFocused);
      boatFeature.setId(boatIndex);
      boatFeature.set("fromLayer", BoatLayer.name); 
      boatFeature.set("boatname", boat.name);
      boatFeatures.push(boatFeature);
    });


    super({
      source: new VectorSource({
        features: boatFeatures,
      }),
      visible: true,
    });


    this.set("layerName", BoatLayer.name);
  }

  handleClick(feature: FeatureLike): void {

  }

  highlightBoat(boatIndex:number): void {
    
    boatFeatures.forEach((boatFeature, boatFeatureIndex) => {
      if(boatIndex == -1) {
        boatFeature.setStyle(iconStyleFocused);
      }
      else if(boatIndex == boatFeatureIndex) {
        boatFeature.setStyle(iconStyleFocused);
      }
      else {
        boatFeature.setStyle(iconStyleUnfocused);
      }
    });
  }
}
