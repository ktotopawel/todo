import { isBefore, isThisMonth, isThisWeek } from "date-fns";
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
        populateContent(project).initializeProjectDisplay();
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

      populateContent(addedProject).initializeProjectDisplay();
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

    //i need this in a function so i can call it in index.js
    function initializeProjectDisplay() {
      const projectCards = project.cardArr;

      projectsFn.updateStorage();
      clearContent();
      generateAddCardForm();
      generateTitleSection();
      generateCards(projectCards, main);
    }

    function initializeUpcomingDisplay() {
      clearContent();
      generateUpcoming();
    }

    function clearContent() {
      while (main.firstChild) {
        main.removeChild(main.firstChild);
      }
    }
    //generates the card ToDo display
    function generateCards(cardsArr, appendTo) {
      const cards = document.createElement("div");
      cards.classList.add("cards");

      for (let index = 0; index < cardsArr.length; index++) {
        const element = cardsArr[index];

        const card = document.createElement("div");
        card.classList.add("card");

        const cardHeading = document.createElement("div");
        cardHeading.classList.add("card-heading");

        const title = document.createElement("h3");
        title.textContent = element.getCard().title;

        const buttons = document.createElement("div");
        buttons.classList.add("buttons");

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
            cardHeading.classList.add('mid-important');
            break;
          case "3":
            priority.textContent = "!!!";
            cardHeading.classList.add('hi-important');

            break;
        }

        cardHeading.appendChild(title);

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
            projectsFn.updateStorage();
          });
        }
        cardContent.appendChild(cardDesc);
        if (element.getCard().checklist.length > 0) {
          cardContent.appendChild(checklist);
        }
        card.appendChild(cardContent);

        cards.appendChild(card);

        if (appendTo == main) {
          const cardDelete = document.createElement("div");
          cardDelete.classList.add("card-delete");
          cardDelete.addEventListener("click", () => {
            project.cardArr.splice([index], 1);
            projectsFn.updateStorage();
            populateContent(project).initializeProjectDisplay();
          });

          title.addEventListener("dblclick", () => {
            const newCardTitle = document.createElement("input");
            newCardTitle.classList.add("card-edit");
            newCardTitle.value = element.getCard().title;

            title.appendChild(newCardTitle);

            newCardTitle.addEventListener("keydown", (e) => {
              if (e.code === "Enter") {
                element.changeTitle(newCardTitle.value);
                populateContent(project).initializeProjectDisplay();
              }
            });
          });

          date.addEventListener("dblclick", () => {
            const newCardDate = document.createElement("input");
            newCardDate.type = "date";
            newCardDate.classList.add("card-edit");
            // newCardDate.value = format(element.getCard().date, 'yyyy-MM-dd')

            date.appendChild(newCardDate);

            newCardDate.addEventListener("keydown", (e) => {
              if (e.code === "Enter") {
                element.changeDate(newCardDate.value);
                populateContent(project).initializeProjectDisplay();
              }
            });
          });

          priority.addEventListener("dblclick", () => {
            const newCardPriority = document.createElement("input");
            newCardPriority.type = "tel";
            newCardPriority.classList.add("card-edit");
            newCardPriority.min = 1;
            newCardPriority.max = 3;

            priority.appendChild(newCardPriority);

            newCardPriority.addEventListener("keydown", (e) => {
              if (e.code === "Enter") {
                element.changePriority(newCardPriority.value);
                populateContent(project).initializeProjectDisplay();
              }
            });
          });

          cardDesc.addEventListener("dblclick", () => {
            const newCardDesc = document.createElement("textarea");
            newCardDesc.classList.add("card-edit");

            cardDesc.appendChild(newCardDesc);

            newCardDesc.addEventListener("keydown", (e) => {
              if (e.code === "Enter") {
                element.changeDescription(newCardDesc.value);
                populateContent(project).initializeProjectDisplay();
              }
            });
          });

          buttons.appendChild(cardDelete);
        }
      }
      appendTo.appendChild(cards);
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
        const changeTitle = document.createElement("input");
        changeTitle.type = "text";
        changeTitle.id = "change-title";
        changeTitle.placeholder = "New Title...";

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

    function generateUpcoming() {
      const upcomingDisplay = document.createElement("div");
      upcomingDisplay.classList.add("upcoming-display");
      main.appendChild(upcomingDisplay);

      const thisWeek = document.createElement("div");
      thisWeek.classList.add("this-week");
      upcomingDisplay.appendChild(thisWeek);

      const thisWeekHeading = document.createElement("h2");
      thisWeekHeading.textContent = "This week";
      thisWeek.appendChild(thisWeekHeading);

      const weekDisplay = document.createElement("div");
      weekDisplay.classList.add("week-display");
      thisWeek.appendChild(weekDisplay);

      const thisMonth = document.createElement("div");
      thisMonth.classList.add("this-month");
      upcomingDisplay.appendChild(thisMonth);

      const monthHeading = document.createElement("h2");
      monthHeading.textContent = "This month";
      thisMonth.appendChild(monthHeading);

      const monthDisplay = document.createElement("div");
      monthDisplay.classList.add("month-display");
      thisMonth.appendChild(monthDisplay);

      fillThisWeekDisplay();
      fillThisMonthDisplay();

      function getAllCards() {
        const allCards = [];

        const projectsArr = projectsFn.projectArr;

        projectsArr.map((project) => {
          project.cardArr.map((card) => {
            allCards.push(card);
          });
        });

        return allCards;
      }

      function fillThisWeekDisplay() {
        const allCards = getAllCards();

        const thisWeekCards = allCards.filter((card) => {
          if (isThisWeek(card.date)) {
            return card;
          }
        });

        generateCards(thisWeekCards, weekDisplay);
      }

      function fillThisMonthDisplay() {
        const allCards = getAllCards();

        const thisMonthCards = allCards.filter((card) => {
          if (isThisMonth(card.date)) {
            return card;
          }
        });

        generateCards(thisMonthCards, monthDisplay);
      }
    }

    return {
      initializeProjectDisplay,
      initializeUpcomingDisplay,
    };
  }
  //handles different button presses on the project display
  function handleDOMButtons(currentProject) {
    const projectsList = document.querySelector(".project-list-btn");
    const upcoming = document.querySelector(".upcoming");

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
    projectEdit.addEventListener("click", editProject);

    addCard(currentProject);

    upcoming.addEventListener("click", () => {
      populateContent().initializeUpcomingDisplay();
    });

    projectsList.addEventListener("click", () => {
      const list = document.querySelector(".project-list");
      const dropdownArrow = document.querySelector("#dropdown-icon");

      if (list.style.maxHeight) {
        list.style.maxHeight = null;
      } else {
        list.style.maxHeight = list.scrollHeight + "px";
      }

      if (dropdownArrow.style.transform == "rotateZ(90deg)") {
        dropdownArrow.style.transform = "rotateZ(0deg)";
      } else {
        dropdownArrow.style.transform = "rotateZ(90deg)";
      }
    });

    function cardForm() {
      addCardForm.style.transform = "scaleY(1)";
    }

    function editProject() {
      const changeTitle = document.querySelector("#change-title");

      changeTitle.style.transform = "scaleX(1)";

      changeTitle.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          currentProject.changeTitle(changeTitle.value);
          projectsFn.updateStorage();

          populateProjectList(projectsFn.projectArr);
          populateContent(currentProject).initializeProjectDisplay();
        }
      });
    }

    function deleteProject() {
      const currentProjectIndex = projectsFn.projectArr.findIndex(
        (project) => project.title === currentProject.title
      );

      projectsFn.projectArr.splice(currentProjectIndex, 1);
      projectsFn.updateStorage();
      populateProjectList(projectsFn.projectArr);
      if (projectsFn.projectArr.length > 0) {
        populateContent(
          projectsFn.projectArr[
            currentProjectIndex == 0
              ? currentProjectIndex
              : currentProjectIndex - 1
          ]
        ).initializeProjectDisplay();
      } else {
        //placeholder
        populateContent(projectsFn.newProject()).initializeProjectDisplay();
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
            populateDOM()
              .populateContent(currentProject)
              .initializeProjectDisplay();
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
