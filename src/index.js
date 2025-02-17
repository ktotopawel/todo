import createProject from "./projects";
import loadPage from "./populateDOM";
import "./style.css";


let myProject = createProject("myTitle");

myProject.addCard("PTitle1", "2025-03-22", "myDesc", "1");
myProject.addCard("PTitle2", "2026-03-22", "myDesc", "1");
myProject.addCard("PTitle3", "2025-07-22", "myDesc", "2");
myProject.addCard("PTitle4", "2025-03-23", "myDesc", "1");
myProject.addCard("PTitle5", "2025-04-22", "myDesc", "3");
myProject.addCard("PTitle6", "2025-01-22", "myDesc", "1");

let myProject2 = createProject("myTitle2");

myProject2.addCard("PTitle1", "2025-03-22", "myDesc", "1");
myProject2.addCard("PTitle2", "2026-03-22", "myDesc", "1");
myProject2.addCard("PTitle3", "2025-07-22", "myDesc", "2");
myProject2.addCard("PTitle4", "2025-03-23", "myDesc", "1");
myProject2.addCard("PTitle5", "2025-04-22", "myDesc", "3");
myProject2.addCard("PTitle6", "2025-01-22", "myDesc", "1");



const projectsList = document.querySelector(".project-list-btn");

projectsList.addEventListener("click", () => {
  let list = document.querySelector(".project-list");
  let dropdownArrow = document.querySelector('#dropdown-icon');

  if (list.style.maxHeight) {
    list.style.maxHeight = null;
  } else {
    list.style.maxHeight = list.scrollHeight + "px";
  }

  if (dropdownArrow.style.transform == 'rotateZ(90deg)') {
    dropdownArrow.style.transform = 'rotateZ(0deg)'
  } else {
    dropdownArrow.style.transform = 'rotateZ(90deg)'
  }

});



loadPage.populateProjectList([myProject, myProject2]);

loadPage.populateContent(myProject);