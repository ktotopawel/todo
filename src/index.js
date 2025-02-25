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
myProject.addCard("acabv", "2025-02-22", "myDesc", "3");
myProject.addCard("PTitle6", "2025-02-25", "myDesc", "1");

const myProject2 = projects.newProject("myTitle2");

myProject2.addCard("PTitle1", "2025-03-22", "myDesc", "1");
myProject2.addCard("PTitle2", "2026-03-22", "myDesc", "1");
myProject2.addCard("PTitle3", "2025-07-22", "myDesc", "2");
myProject2.addCard("lolek", "2025-03-23", "myDesc", "1");
myProject2.addCard("PTitle5", "2025-04-22", "myDesc", "3");
myProject2.addCard("PTitle6", "2025-01-22", "myDesc", "1");



loadPage.populateProjectList(projects.projectArr);

loadPage.populateContent(myProject).initializeProjectDisplay();
loadPage.populateContent().initializeUpcomingDisplay();
