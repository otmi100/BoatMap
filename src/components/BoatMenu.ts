import { Boat } from "./Boat";
import { BoatMapController } from "../controllers/BoatMapController";

export class BoatMenu {

  
  constructor(boats: Boat[], boatMapController: BoatMapController) {

    console.log(boatMapController);
    const boatList = document.getElementById("boats");
    if (boatList) {
      boats.forEach((boat, index) => {
        var boatEntry = document.createElement("li");

        boatEntry.appendChild(document.createTextNode(boat.name));
        boatEntry.appendChild(document.createElement("BR"));
        boatEntry.appendChild(document.createTextNode(boat.type));

        boatEntry.onclick = function () {
          boatMapController.viewBoat(index);
        };
        boatList.appendChild(boatEntry);
      });
    }
  }

  getBoatItems() {
    return (<HTMLElement>document.getElementById("boats")).getElementsByTagName(
      "li"
    );
  }
}
