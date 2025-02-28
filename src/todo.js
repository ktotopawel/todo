import { format,  } from "date-fns";

export default function newCard(title, date, description, priority) {
  return new Todo(title, date, description, priority);
}

class Todo {
  constructor(title, date = new Date(), description = "", priority = "1") {
    this.title = title;
    this.date = new Date(date);
    this.description = description;
    this.priority = priority;
    this.checklist = new Checklist();
  }

  static fromObject(obj) {
    const todo = new Todo(obj.title, obj.date, obj.description, obj.priority);
    todo.checklist = Checklist.fromObject(obj.checklist);
    return todo;
  }


  getCard() {
    return {
      title: this.title,
      date: format(this.date, 'dd/MM/yyyy'),
      description: this.description,
      priority: this.priority,
      checklist: this.checklist.list,
    }
  }

  changeTitle(newTitle) {
    this.title = newTitle;
  }

  changeDate(newDate) {
    this.date = new Date(newDate);
  }

  changeDescription(newDesc) {
    if (typeof newDesc == "string") {
      this.description = newDesc;
    }
  }

  changePriority(newPriority) {
    if (["1", "2", "3"].includes(newPriority)) {
      this.priority = newPriority;
    }
  }

  accessChecklist() {
    return this.checklist;
  }
}

class Checklist {
  constructor() {
    this.list = [];
  }

  addEl(text, done) {
    this.list.push(new ChecklistEl(text, done));
  }

  removeEl(index) {
    this.list.splice(index, 1);
  }

  static fromObject(obj) {
    const checklist = new Checklist();
    checklist.list = obj.list.map(item => ChecklistEl.fromObject(item));
    return checklist;
  }
}

class ChecklistEl {
  constructor(text, done = false) {
    this.text = text;
    this.done = done;
  }

  changeDone() {
    this.done = !this.done;
  }

  static fromObject(obj) {
    return new ChecklistEl(obj.text, obj.done);
  }
}

export { Todo };