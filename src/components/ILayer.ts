import { FeatureLike } from "ol/Feature";

export interface ILayer {
    handleClick(feature: FeatureLike): void; 
}