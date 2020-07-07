import { Layer } from "ol/layer";
import { FeatureLike } from "ol/Feature";
import { IBoat } from "./IBoat";

export interface ISetBoatCallback {
	( boat: IBoat | null ) : void;
}

export interface IBoatInfoAppLayer {
    getOlLayer() : Layer;
    getName() : string;
    getMenuHtml() : string;
    getCheckedDefault() : boolean;
    updateBoatSelection(boat: IBoat | null) : void;
    handleClick(feature: FeatureLike, setSelectedBoat: ISetBoatCallback) : void;
}