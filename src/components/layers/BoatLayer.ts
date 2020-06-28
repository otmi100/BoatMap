import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style, Text, Icon } from "ol/style";
import { Map, View, Feature } from "ol";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import boatlogo from "../../data/img/boat.svg";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import { Boat } from "../Boat";

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



export class BoatLayer extends VectorLayer {
  constructor(boats: Boat[]) {


    boats.forEach((boat, boatIndex) => {
      var boatFeature = new Feature({
        geometry: new Point(fromLonLat([boat.location.lon, boat.location.lat])),
        name: boat.name,
      });
      boatFeature.setStyle(iconStyleFocused);
      boatFeature.setId(boatIndex);
      boatFeature.set("featureType", "sailingboat");
      boatFeature.set("boatname", boat.name);
      boatFeatures.push(boatFeature);
    });


    super({
      source: new VectorSource({
        features: boatFeatures,
      }),
      visible: true,
    });


    this.set("layerName", "BoatLayer");
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
