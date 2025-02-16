import newCard from "./todo";

export default function createProject(title) {
  return new Project(title);
}

class Project {
  constructor(title) {
    this.title = title;
    this.cardArr = [];
  }

  addCard(title, date, desc, priority) {
    this.cardArr.push(newCard(title, date, desc, priority));
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
