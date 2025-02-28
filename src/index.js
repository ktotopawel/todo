import projects from "./projects";
import loadPage from "./handleDOM";
import "./style.css";


projects.checkProjectStorage();

console.log(projects.projectArr);

loadPage.populateProjectList(projects.projectArr);


loadPage.populateContent(projects.projectArr[0]).initializeProjectDisplay();
loadPage.populateContent().initializeUpcomingDisplay();
