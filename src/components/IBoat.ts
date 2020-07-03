export interface IBoat {
  name: string;
  type: string;
  sailingareas: string[];
  location: { name: string; lon: number; lat: number };
}
