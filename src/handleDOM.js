import { format, isBefore } from "date-fns";
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
    generateAddCardForm();
    generateTitleSection();
    generateCards();

    function clearContent() {
      while (main.firstChild) {
        main.removeChild(main.firstChild);
      }
    }
    //generates the card ToDo display
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
        cardEdit.addEventListener('click', () => {
          const cardForm = document.querySelector('#add-card-form');
          cardForm.style.transform = 'scaleY(1)'

          document.querySelector('#title-input').value = element.title;
          console.log(new Date(element.date))
          document.querySelector('#date-input').value = format(new Date(element.date), 'yyyy-MM-dd' );
          document.querySelector('#description-input').value = element.description;
          document.querySelector('#priority-input').value = element.priority;

          project.cardArr.splice(index, 1);
        })

        const cardDelete = document.createElement("div");
        cardDelete.classList.add("card-delete");
        cardDelete.addEventListener('click', () => {
          project.cardArr.splice([index], 1);
          populateContent(project);
        })

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
          checkbox.checked = checkElement.done;

          const label = document.createElement("label");
          label.htmlFor = `id${i}`;
          label.textContent = checkElement.text;

          checkItem.appendChild(checkbox);
          checkItem.appendChild(label);

          checklist.appendChild(checkItem);

          checkbox.addEventListener("click", () => {
            checkElement.done = checkbox.checked;
          });
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
    //generates the title section of the project display
    function generateTitleSection() {
      const titlebar = document.createElement("div");
      titlebar.classList.add("titlebar");

      const title = document.createElement("h2");
      title.classList.add("current-project-title");
      title.textContent = project.title;

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
      generateEditTitle();

      function generateEditTitle() {
        const changeTitle = document.createElement('input');
        changeTitle.type = 'text';
        changeTitle.id = 'change-title';
        changeTitle.placeholder = 'New Title...'

        title.appendChild(changeTitle);
      }
    }

    function generateAddCardForm() {
      const formBg = document.createElement("div");
      formBg.id = "add-card-form";
      formBg.classList.add("form");

      const form = document.createElement("form");
      form.method = "dialog";

      const titleInputField = document.createElement("div");
      titleInputField.classList.add("input-field");

      const titleInputLabel = document.createElement("label");
      titleInputLabel.htmlFor = "title-input";
      titleInputLabel.textContent = "Title";

      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.name = "title-input";
      titleInput.id = "title-input";

      titleInputField.appendChild(titleInputLabel);
      titleInputField.appendChild(titleInput);
      form.appendChild(titleInputField);

      const dateInputField = document.createElement("div");
      dateInputField.classList.add("input-field");

      const dateInputLabel = document.createElement("label");
      dateInputLabel.htmlFor = "date-input";
      dateInputLabel.textContent = "Due date";

      const dateInput = document.createElement("input");
      dateInput.type = "date";
      dateInput.name = "date-input";
      dateInput.id = "date-input";

      dateInputField.appendChild(dateInputLabel);
      dateInputField.appendChild(dateInput);
      form.appendChild(dateInputField);

      const descriptionInputField = document.createElement("div");
      descriptionInputField.classList.add("input-field");

      const descriptionInputLabel = document.createElement("label");
      descriptionInputLabel.htmlFor = "description-input";
      descriptionInputLabel.textContent = "Description";

      const descriptionInput = document.createElement("textarea");
      descriptionInput.name = "description-input";
      descriptionInput.id = "description-input";

      descriptionInputField.appendChild(descriptionInputLabel);
      descriptionInputField.appendChild(descriptionInput);
      form.appendChild(descriptionInputField);

      const priorityInputField = document.createElement("div");
      priorityInputField.classList.add("input-field");

      const priorityInputLabel = document.createElement("label");
      priorityInputLabel.htmlFor = "priority-input";
      priorityInputLabel.textContent = "Priority";

      const priorityInput = document.createElement("input");
      priorityInput.type = "number";
      priorityInput.name = "priority-input";
      priorityInput.id = "priority-input";
      priorityInput.min = "1";
      priorityInput.max = "3";
      priorityInput.value = "1";

      priorityInputField.appendChild(priorityInputLabel);
      priorityInputField.appendChild(priorityInput);
      form.appendChild(priorityInputField);

      const checkboxSection = document.createElement("section");

      const checkboxSectionLabel = document.createElement("h3");
      checkboxSectionLabel.textContent = "Checklist:";

      checkboxSection.appendChild(checkboxSectionLabel);

      const checkboxes = document.createElement("div");
      checkboxes.classList.add("checkboxes");

      checkboxSection.appendChild(checkboxes);

      const addCheckbox = document.createElement("div");
      addCheckbox.classList.add("add-checklist-item");

      const checkboxSubmitBtn = document.createElement("div");
      checkboxSubmitBtn.classList.add("checkbox-title-submit-btn");
      checkboxSubmitBtn.textContent = "+";

      addCheckbox.appendChild(checkboxSubmitBtn);

      const checkboxTitle = document.createElement("input");
      checkboxTitle.type = "text";
      checkboxTitle.name = "checkbox-title";
      checkboxTitle.id = "checkbox-title";
      checkboxTitle.placeholder = "Add item...";

      addCheckbox.appendChild(checkboxTitle);

      checkboxSection.appendChild(addCheckbox);
      form.appendChild(checkboxSection);

      const btns = document.createElement("div");
      btns.classList.add("btns");

      const submitBtn = document.createElement("div");
      submitBtn.classList.add("card-submit", "btn");
      submitBtn.id = "submit-btn";
      submitBtn.textContent = "Add";
      btns.appendChild(submitBtn);

      const closeBtn = document.createElement("div");
      closeBtn.classList.add("close", "btn");
      closeBtn.id = "close-btn";
      closeBtn.textContent = "Close";
      btns.appendChild(closeBtn);

      form.appendChild(btns);

      formBg.appendChild(form);

      main.appendChild(formBg);
    }
  }
  //handles different button presses on the project display
  function handleDOMButtons(currentProject) {
    const projectAdd = document.querySelector("#add");
    const projectEdit = document.querySelector("#edit");
    const projectDel = document.querySelector("#delete");
    const formClose = document.querySelector(".close");

    const addCardForm = document.querySelector(".form");

    const titleField = document.querySelector("#title-input");
    const dateField = document.querySelector("#date-input");
    const descField = document.querySelector("#description-input");
    const priorityField = document.querySelector("#priority-input");
    const checkBoxList = document.querySelector(".checkboxes");

    projectAdd.addEventListener("click", cardForm);
    formClose.addEventListener("click", closeForm);
    projectDel.addEventListener("click", deleteProject);
    projectEdit.addEventListener('click', editProject)
    

    addCard(currentProject);

    function cardForm() {
      addCardForm.style.transform = "scaleY(1)";
    }

    function editProject() {
      const changeTitle = document.querySelector('#change-title')

      changeTitle.style.transform = 'scaleX(1)';

      changeTitle.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
          currentProject.changeTitle(changeTitle.value);

          populateProjectList(projectsFn.projectArr);
          populateContent(currentProject);
        }
      })
    }

    function deleteProject() {
      const currentProjectIndex = projectsFn.projectArr.indexOf(currentProject);
      console.log(currentProjectIndex);
      projectsFn.projectArr.splice(currentProjectIndex, 1);
      populateProjectList(projectsFn.projectArr);
      if (projectsFn.projectArr.length > 0) {
        populateContent(projectsFn.projectArr[currentProjectIndex]);
      } else {
        //placeholder
        populateContent(projectsFn.newProject());
      }
    }

    function closeForm() {
      addCardForm.style.transform = "scaleY(0)";
      titleField.value = "";
      dateField.value = "";
      descField.value = "";
      priorityField.value = "";

      while (checkBoxList.firstChild) {
        checkBoxList.removeChild(checkBoxList.firstChild);
      }
    }

    function addCard(currentProject) {
      const buttons = document.querySelector(".btns");

      const checkboxSubmitBtn = document.querySelector(
        ".checkbox-title-submit-btn"
      );

      const checkboxArr = [];

      buttons.addEventListener("click", (e) => {
        const target = e.target;

        switch (target.id) {
          case "submit-btn":
            if (
              isBefore(new Date(dateField.value), new Date()) ||
              titleField.value === ""
            ) {
              alert("Please fill with correct date (in the future) and title.");
              return;
            }

            const newCard = currentProject.addCard(
              titleField.value,
              dateField.value,
              descField.value,
              priorityField.value
            );

            for (let i = 0; i < checkboxArr.length; i++) {
              const currentCheckbox = checkboxArr[i];
              newCard.checklist.addEl(currentCheckbox);
            }

            closeForm();
            populateDOM().populateContent(currentProject);
            break;
          case "close-btn":
            closeForm();
            break;
        }
      });

      checkboxSubmitBtn.addEventListener("click", addCheckbox);
      const checkboxTitleInput = document.querySelector("#checkbox-title");
      checkboxTitleInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          addCheckbox();
        }
      });

      function addCheckbox() {
        const checkboxTitle = document.querySelector("#checkbox-title").value;

        if (checkboxTitle === "" || isAdded()) {
          return;
        }

        function isAdded() {
          const listChildren = Array.from(checkBoxList.childNodes);

          for (const child of listChildren) {
            if (child.id === checkboxTitle) {
              return true;
            }
          }
        }

        const checkboxField = document.createElement("div");
        checkboxField.classList.add("checkbox-field");
        checkboxField.id = checkboxTitle;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = checkboxTitle;
        checkbox.id = checkboxTitle;

        const label = document.createElement("label");
        label.htmlFor = checkboxTitle;
        label.textContent = checkboxTitle;

        checkboxField.appendChild(checkbox);
        checkboxField.appendChild(label);

        checkBoxList.appendChild(checkboxField);

        document.querySelector("#checkbox-title").value = "";

        checkboxArr.push(checkboxTitle);
      }
    }
  }

  return {
    populateProjectList,
    populateContent,
  };
}

let loadPage = populateDOM();

export default loadPage;