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
      const myProject = newProject("My Project");

      myProject.addCard("Checklist Todo", "2025-03-22", "", "3");
      myProject.cardArr[0].accessChecklist().addEl("Not Done", false);
      myProject.cardArr[0].accessChecklist().addEl("Done", true);

      myProject.addCard(
        "Not Important ToDo",
        "2026-03-22",
        "Some made up description",
        "1"
      );
      myProject.addCard(
        "Important ToDo",
        "2025-07-22",
        "This one is not as important as the next one",
        "2"
      );
      myProject.addCard(
        "Very Important ToDo",
        "2025-03-23",
        "This one is the most important!",
        "3"
      );
      myProject.addCard(
        "Edit this!",
        "2025-02-22",
        "You can edit everything by double clicking it",
        "3"
      );

      const myProject2 = newProject("My Other Project");

      myProject2.addCard("Coming features", "2025-03-22", "Coming soon", "1");
      myProject2.addCard(
        "Sorting",
        "2026-03-22",
        "By date and importance",
        "3"
      );
      myProject2.addCard("And others", "2025-07-22", "", "2");
      myProject2.addCard("lolek", "2025-03-23", "myDesc", "1");

      updateStorage();
    } else {
      const storedArray = JSON.parse(localStorage.getItem("projectsArr"));

      projectArr.length = 0;
      storedArray.forEach((project) => {
        projectArr.push(Project.fromObject(project));
      });
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
