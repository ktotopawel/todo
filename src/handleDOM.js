import projectsFn from "./projects";

function populateDOM() {
  //handles the project list on the sidebar
  function populateProjectList(projects) {
    let projectList = document.querySelector(".project-list");

    const keepElement = document.querySelector("#keep-element");
    while (projectList.firstChild) {
      if (projectList.firstChild !== keepElement) {
        projectList.removeChild(projectList.firstChild);
      } else {
        break;
      }
    }

    const addBtn = document.createElement("li");
    addBtn.id = "add-project";
    addBtn.textContent = "+ Add";

    projectList.prepend(addBtn);

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];

      const element = document.createElement("li");
      element.textContent = project.title;
      element.id = project.title;
      // element.addEventListener('click', createContent() )

      projectList.prepend(element);

      element.addEventListener("click", () => {
        populateContent(project);
      });
    }

    const projectDialog = document.querySelector("#project-dialog");

    addBtn.addEventListener("click", () => {
      if (projectDialog.classList.contains("active")) {
        addNewProject();
        return;
      }

      projectDialog.classList.add("active");

      adjustProjectListHeight();
    });

    function adjustProjectListHeight() {
      const list = document.querySelector(".project-list");
      list.style.maxHeight = list.scrollHeight + "px";
    }

    function addNewProject() {
      if (projectDialog.querySelector("input").value === "") {
        return;
      }

      const input = projectDialog.querySelector("input").value;

      const addedProject = projectsFn.newProject(input);

      populateContent(addedProject);
      populateProjectList(projectsFn.projectArr);

      projectDialog.classList.remove("active");
      projectDialog.querySelector("input").value = "";
    }

    return {
      addNewProject,
      adjustProjectListHeight,
    };
  }

  //has to be handled outside of populateProjectList or the event listener is added multiple times

  const projectInput = document.querySelector("#project-title-input");
  projectInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const projectListMethods = populateProjectList(projectsFn.projectArr);
      projectListMethods.addNewProject();
      projectListMethods.adjustProjectListHeight();
    }
  });

  //generates the actual content of the page
  function populateContent(project) {
    const main = document.querySelector("#content");

    clearContent();
    generateTitleSection();
    generateCards();

    function clearContent() {
      while (main.lastChild.id !== "add-card-from") {
        main.removeChild(main.lastChild);
      }
    }

    function generateCards() {
      const cards = document.createElement("div");
      cards.classList.add("cards");

      for (let index = 0; index < project.cardArr.length; index++) {
        const element = project.cardArr[index];

        const card = document.createElement("div");
        card.classList.add("card");

        const cardHeading = document.createElement("div");
        cardHeading.classList.add("card-heading");

        const title = document.createElement("h3");
        title.textContent = element.getCard().title;

        const buttons = document.createElement("div");
        buttons.classList.add("buttons");

        const cardEdit = document.createElement("div");
        cardEdit.classList.add("card-edit");

        const cardDelete = document.createElement("div");
        cardDelete.classList.add("card-delete");

        const date = document.createElement("div");
        date.classList.add("date");
        date.textContent = element.getCard().date;

        const priority = document.createElement("div");
        priority.classList.add("priority");
        switch (element.getCard().priority) {
          case "1":
            priority.textContent = "!";
            break;
          case "2":
            priority.textContent = "!!";
            break;
          case "3":
            priority.textContent = "!!!";
            break;
        }

        cardHeading.appendChild(title);

        buttons.appendChild(cardEdit);
        buttons.appendChild(cardDelete);

        cardHeading.appendChild(buttons);
        cardHeading.appendChild(date);
        cardHeading.appendChild(priority);

        card.appendChild(cardHeading);

        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");

        const cardDesc = document.createElement("div");
        cardDesc.classList.add("card-desc");
        cardDesc.textContent = element.getCard().description;

        const checklist = document.createElement("div");
        checklist.classList.add("checklist");

        for (let i = 0; i < element.getCard().checklist.length; i++) {
          const checkElement = element.getCard().checklist[i];

          const checkItem = document.createElement("div");
          checkItem.classList.add("check-item");

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = `id${i}`;
          checkbox.name = `id${i}`;

          const label = document.createElement("label");
          label.htmlFor = `id${i}`;
          label.textContent = checkElement.text;

          checkItem.appendChild(checkbox);
          checkItem.appendChild(label);

          checklist.appendChild(checkItem);
        }
        cardContent.appendChild(cardDesc);
        if (element.getCard().checklist.length > 0) {
          cardContent.appendChild(checklist);
        }
        card.appendChild(cardContent);

        cards.appendChild(card);
      }
      main.appendChild(cards);
    }

    function generateTitleSection() {
      const titlebar = document.createElement("div");
      titlebar.classList.add("titlebar");

      const title = document.createElement("h2");
      title.classList.add("current-project-title");
      title.textContent = project.title;

      console.log(title)

      const btns = document.createElement("div");
      btns.classList.add("btns");

      const add = document.createElement("div");
      add.id = "add";

      const edit = document.createElement("div");
      edit.id = "edit";

      const del = document.createElement("div");
      del.id = "delete";

      btns.appendChild(add);
      btns.appendChild(edit);
      btns.appendChild(del);

      titlebar.appendChild(title);
      titlebar.appendChild(btns);

      main.appendChild(titlebar);

      handleDOMButtons(project);
    }
  }

  return {
    populateProjectList,
    populateContent,
  };
}

function handleDOMButtons(currentProject) {
  const projectAdd = document.querySelector("#add");
  const projectEdit = document.querySelector("#edit");
  const projectDel = document.querySelector("#delete");
  const formClose = document.querySelector('.close');

  console.log(projectAdd);

  const addCardForm = document.querySelector(".form");

  projectAdd.addEventListener("click", cardForm);
  formClose.addEventListener("click", closeForm);

  addCard(currentProject);

  function cardForm() {
    addCardForm.style.transform = 'scaleY(1)'
  }

  function editProject() {}

  function deleteProject() {}

  function closeForm() {
    addCardForm.style.transform = 'scaleY(0)';
  }

  function addCard(currentProject) {
    const titleField = document.querySelector("#title-input");
    const dateField = document.querySelector('#date-input');
    const descField = document.querySelector('#description-input');
    const priorityField = document.querySelector('#priority-input');
  
    const buttons = document.querySelector('.btns');
  
    buttons.addEventListener('click', (e) => {
      const target = e.target;

      console.log(target);
  
      switch (target.id) {
        
        case 'submit-btn': 
        console.log('i work');
        currentProject.addCard(titleField.value, dateField.value, descField.value, priorityField.value);
        closeForm();
        populateDOM().populateContent(currentProject);
        break;
        case 'close-btn': closeForm();
        break;
      }
    })
  }
}


let loadPage = populateDOM();

export default loadPage;
