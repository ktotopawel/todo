import projects from "./projects";
import loadPage from "./handleDOM";
import "./style.css";

const myProject = projects.newProject("myTitle");

myProject.addCard("PTitle1", "2025-03-22", "myDesc", "1");
myProject.cardArr[0].accessChecklist().addEl("jebać", false);
myProject.cardArr[0].accessChecklist().addEl("srać", true);

myProject.addCard("baca", "2026-03-22", "myDesc", "1");
myProject.addCard("PTitle3", "2025-07-22", "myDesc", "2");
myProject.addCard("PTitle4", "2025-03-23", "myDesc", "1");
myProject.addCard("acabv", "2025-04-22", "myDesc", "3");
myProject.addCard("PTitle6", "2025-02-25", "myDesc", "1");

const myProject2 = projects.newProject("myTitle2");

myProject2.addCard("PTitle1", "2025-03-22", "myDesc", "1");
myProject2.addCard("PTitle2", "2026-03-22", "myDesc", "1");
myProject2.addCard("PTitle3", "2025-07-22", "myDesc", "2");
myProject2.addCard("lolek", "2025-03-23", "myDesc", "1");
myProject2.addCard("PTitle5", "2025-04-22", "myDesc", "3");
myProject2.addCard("PTitle6", "2025-01-22", "myDesc", "1");

const projectsList = document.querySelector(".project-list-btn");

projectsList.addEventListener("click", () => {
  const list = document.querySelector(".project-list");
  const dropdownArrow = document.querySelector("#dropdown-icon");

  if (list.style.maxHeight) {
    list.style.maxHeight = null;
  } else {
    list.style.maxHeight = list.scrollHeight + "px";
  }

  if (dropdownArrow.style.transform == "rotateZ(90deg)") {
    dropdownArrow.style.transform = "rotateZ(0deg)";
  } else {
    dropdownArrow.style.transform = "rotateZ(90deg)";
  }
});

loadPage.populateProjectList(projects.projectArr);

loadPage.populateContent(myProject).initializeProjectDisplay();
loadPage.populateContent(myProject).initializeUpcomingDisplay();
