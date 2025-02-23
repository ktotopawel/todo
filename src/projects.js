import newCard from "./todo";

function projects() {
  const projectArr = [];
  
  function newProject(title) {
    const project = new Project(title);
    
    projectArr.push(project);
    return project;
  }
  
  return {
    newProject,
    projectArr
  };
}

class Project {
  constructor(title) {
    this.title = title;
    this.cardArr = [];
  }
  
  addCard(title, date, desc, priority) {
    const thisCard = newCard(title, date, desc, priority);
    this.cardArr.push(thisCard);
    return thisCard;
  }
  
  sortByDate() {
    this.cardArr.sort((a, b) => a.date - b.date);
  }
  
  sortByPriority() {
    this.cardArr.sort((a,b) => a.priority - b.priority);
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

export default projects();