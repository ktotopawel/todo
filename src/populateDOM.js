function populateDOM() {
    function populateProjectList (projects) {
        let projectList = document.querySelector('.project-list');
    
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
    
            const element = document.createElement('li');
            element.textContent = project.title;
            element.id = project.title;
            // element.addEventListener('click', createContent() )
    
            projectList.prepend(element);
        }
    }
    
    return {
        populateProjectList
    }
}

let loadPage = populateDOM();

export default loadPage;