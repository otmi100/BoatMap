import { Boat } from "./Boat";

export class BoatMenu {
  constructor(boats: Boat[], clickFunction: Function) {
    const boatList = document.getElementById("boats");
    if (boatList) {
      boats.forEach((boat, index) => {
        var boatEntry = document.createElement("li");

        boatEntry.appendChild(document.createTextNode(boat.name));
        boatEntry.appendChild(document.createElement("BR"));
        boatEntry.appendChild(document.createTextNode(boat.type));

        boatEntry.onclick = function () {
            clickFunction(index);
        };
        boatList.appendChild(boatEntry);
      });
    }
  }

  styleBoatMenu(selectedBoatIndex: number): void {
    const boats = (<HTMLElement>(
      document.getElementById("boats")
    )).getElementsByTagName("li");
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
