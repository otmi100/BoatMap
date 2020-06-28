import { BoatMenu } from "../components/BoatMenu";
import { Boat } from "../components/Boat";

export class BoatMenuController {
  private boatMenu: BoatMenu;

  constructor(boatMenu: BoatMenu) {
    this.boatMenu = boatMenu;
  }
  
  styleBoatMenu(selectedBoatIndex: number): void {
    var boats = this.boatMenu.getBoatItems();

    for (var i = 0; i < boats.length; i++) {
      if (selectedBoatIndex == -1) {
        boats[i].classList.remove("active");
      } else if (selectedBoatIndex == i) {
        boats[i].classList.add("active");
      } else {
        boats[i].classList.remove("active");
      }
    }
  }
}
