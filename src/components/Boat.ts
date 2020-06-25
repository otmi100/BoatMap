export interface Boat {
  name: string;
  type: string;
  sailingareas: string[];
  location: { name: string; lon: number; lat: number };
}
