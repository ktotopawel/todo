import newCard, { Todo } from "./todo";

class Project {
  constructor(title) {
    this.title = title;
    this.cardArr = [];
  }

  static fromObject(obj) {
    const project = new Project(obj.title);
    project.cardArr = obj.cardArr.map((card) => Todo.fromObject(card));
    return project;
  }

  changeTitle(newTitle) {
    this.title = newTitle;
  }

  addCard(title, date, desc, priority) {
    const thisCard = newCard(title, date, desc, priority);
    this.cardArr.push(thisCard);
    projectModule.updateStorage();
    return thisCard;
  }

  sortByDate() {
    this.cardArr.sort((a, b) => a.date - b.date);
  }

  sortByPriority() {
    this.cardArr.sort((a, b) => a.priority - b.priority);
  }

  getProject() {
    return {
      title: this.title,
      cards: this.cardArr.map((card) => {
        return card.getCard();
      }),
    };
  }
}

function projects() {
  let projectArr = [];

  function checkProjectStorage() {
    //first run of the page
    if (localStorage.getItem("projectsArr") === null) {
      const myProject = newProject("myTitle");

      myProject.addCard("PTitle1", "2025-03-22", "myDesc", "1");
      myProject.cardArr[0].accessChecklist().addEl("jebać", false);
      myProject.cardArr[0].accessChecklist().addEl("srać", true);

      myProject.addCard("baca", "2026-03-22", "myDesc", "1");
      myProject.addCard("PTitle3", "2025-07-22", "myDesc", "2");
      myProject.addCard("PTitle4", "2025-03-23", "myDesc", "1");
      myProject.addCard("acabv", "2025-02-22", "myDesc", "3");
      myProject.addCard("PTitle6", "2025-02-25", "myDesc", "1");

      const myProject2 = newProject("myTitle2");

      myProject2.addCard("PTitle1", "2025-03-22", "myDesc", "1");
      myProject2.addCard("PTitle2", "2026-03-22", "myDesc", "1");
      myProject2.addCard("PTitle3", "2025-07-22", "myDesc", "2");
      myProject2.addCard("lolek", "2025-03-23", "myDesc", "1");
      myProject2.addCard("PTitle5", "2025-02-22", "myDesc", "3");
      myProject2.addCard("PTitle6", "2025-01-22", "myDesc", "1");

      updateStorage();
    } else {
      const storedArray = JSON.parse(localStorage.getItem("projectsArr"));

      projectArr.length = 0;
      storedArray.forEach((project) => {
        projectArr.push(Project.fromObject(project));
      });
      console.log("stored array", storedArray);
      console.log("parsed array", projectArr);
    }
  }

  function newProject(title) {
    const project = new Project(title);

    projectArr.push(project);
    updateStorage();

    return project;
  }
  function updateStorage() {
    const newProjectArray = projectArr;

    console.log("newProjectArr", newProjectArray);
    localStorage.setItem("projectsArr", JSON.stringify(projectArr));
  }

  return {
    checkProjectStorage,
    newProject,
    projectArr,
    updateStorage,
  };
}

const projectModule = projects();
export default projectModule;
