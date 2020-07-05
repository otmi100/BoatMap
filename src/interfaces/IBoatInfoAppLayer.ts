import { getDefaultStyleArray } from "ol/format/KML"
import { Layer } from "ol/layer";
import { FeatureLike } from "ol/Feature";

export interface IBoatInfoAppLayer {
    getOlLayer() : Layer;
    getName() : string;
    getMenuHtml() : string;
    getCheckedDefault() : boolean;
    handleClick(feature: FeatureLike) : void;
}