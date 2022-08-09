/*
e got two issues if we want to call them like that to fix.Now, I want to start with the 
issue that projects show up in both boxes.I want to introduce some filtering and the best 
place to filter is, of course, our listener function.

*/

/*

*/

enum ProjectStatus1 {
    Active ,
    Finished
}

class Project1{
    constructor(
        public id:string, 
        public title:string,
        public description:string,
        public people:number, 
        public status:ProjectStatus1 
        ){}
}

type Listener1 = (items:Project1[]) => void;

// Project State Management.
class ProjectState2{
    private projects: Project1[] = [];
    private listeners:Listener1[] = [];
    
   private static instance1:ProjectState2;
   private constructor(){
   }

   static getInstance(){
    if(this.instance1) return this.instance1;

    this.instance1 = new ProjectState2();
    return this.instance1;
   }
    
    addProject(title:string,description:string,numOfPeople:number){
        const newProject = new Project1(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus1.Active
        );

        this.projects.push(newProject);
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
    
    addListener(ListenerFn: Listener1){
        this.listeners.push(ListenerFn);
    }

}

const projectState2 = ProjectState2.getInstance();


interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}

function validate2q(validatableInput:Validatable){
    let isValid = true;

    if(validatableInput.required)
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string')
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;

    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string')
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    
    if(validatableInput.min != null && typeof validatableInput.value === 'number')
        isValid = isValid && validatableInput.value >= validatableInput.min;

    if(validatableInput.max != null && typeof validatableInput.value === 'number')
        isValid = isValid && validatableInput.value <= validatableInput.max;

    return isValid;
}

function autobind5(_:any, _2:string, descriptor:PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable:true,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }

    return adjDescriptor;
}


//ProjectList Class
class ProjectList3 {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects:Project1[];

    /*
    01 - If we go to the place where we register our listener.Here in the project list class.
    Then here we get a list of projects.Right now that list of projects comprises all projects.
    Now inside of the project list class.However, we're only interested in active or finished 
    projects.Now here, by the way, we could also theoretically use our enum, but actually.

    I need the concrete values stored in the enum down there or in the type down there, and 
    therefore here.
    
    02 - I don't want to use a enum also because I want to show the string literal 
    types.So what we'll do here inside of our listener function is before we store the 
    project and render them we want to filter them.
    */
    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${type}-projects`;
        this.assignedProjects = [];

        projectState2.addListener((projects:Project1[])=>{
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active')
                    return prj.status === ProjectStatus1.Active;
                else return prj.status === ProjectStatus1.Finished;
            });
            //With that, we get our relevant project, which we can now store here in assigned projects.
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })

        this.attach();
        this.renderContent();
    }


    private attach(){
        this.hostElement.insertAdjacentElement('beforeend',this.element);
    }

    private renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = 
            this.type.toUpperCase() + ' PROJECTS';
    }

   /*
   02 - This works and you see it only added to active projects not to finish projects.
    However, if I add a second project here, we still have that duplication going on now 
    that's related to how we render our projects.Instead of render projects, we always go 
    through all our project items and append them to the list.Now the problem with that, 
    of course, is that we already might have a project item rendered out onto the screen.

    Now, the best possible solution here would be to kind of run some comparison where 
    you check what has already been rendered and what you need to render to avoid 
    unnecessary rendering. However, running this comparison by looking at the real 
    dom, all the costs, quite a bit of performance for this application here.

    It's therefore perfectly fine to simply take our list element and clear all its 
    content by setting inner HTML to an empty string, which means we get rid of all 
    list items and then re render.That means that whenever we add a new project, we re 
    render all projects.

    But for the purpose of this project here, for this application here, that is 
    absolutely fine.So now with that, if we save that, let's give it another try.
   */
   private renderProjects(){

    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    listEl.innerHTML = '';
    for(const prjItem of this.assignedProjects){
        const listItem = document.createElement('li');
        listItem.textContent = prjItem.title;
        listEl?.appendChild(listItem)
    }
   }
}

// ProjectInput Class    
class ProjectInput8{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    
    titleInputElement: HTMLInputElement;
    descriptionInputElement:HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }
    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }

    private configure(){
    this.element.addEventListener('submit',this.submitHandler);
    }

    @autobind5
    private submitHandler(event:Event){
    event.preventDefault();

    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
       
        projectState2.addProject(title,desc,people);
        this.clearInputs();
        }
    }

    private gatherUserInput():[string,string,number] | void{
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required:true
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required:true,
            minLength: 5
        }

        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required:true,
            min:1,
            max:5
        }
        
        if(
            !validate2q(titleValidatable) ||
            !validate2q(descriptionValidatable) ||
            !validate2q(peopleValidatable)
        ){
            alert('Invalid input, Please try again!');
            return;
        } else {
            return [enteredTitle,enteredDescription,+enteredPeople]
        }
    }

    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
}
    
    const prjInput8 = new ProjectInput8();
    
    const activePrjList3 = new ProjectList3('active');
    const finishedPrjList3 = new ProjectList3('finished');