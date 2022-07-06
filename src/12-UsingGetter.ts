/*
We're adding styling and more metadata. Also adding Getters here
*/

enum ProjectStatus4 {
    Active ,
    Finished
}

class Project5{
    constructor(
        public id:string, 
        public title:string,
        public description:string,
        public people:number, 
        public status:ProjectStatus4 
        ){}
}

type Listener4<T> = (items:T[]) => void;

class State2<T> {
    protected listeners:Listener4<T>[] = [];

    addListener(ListenerFn: Listener4<T>){
        this.listeners.push(ListenerFn);
    }
}

// Project State Management.
class ProjectState5 extends State2<Project5>{
    private projects: Project5[] = [];
    
   private static instance1:ProjectState5;
   private constructor(){
   super();
   }

   static getInstance(){
    if(this.instance1) return this.instance1;

    this.instance1 = new ProjectState5();
    return this.instance1;
   }
    
    addProject(title:string,description:string,numOfPeople:number){
        const newProject = new Project5(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus4.Active
        );

        this.projects.push(newProject);
        
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
    
}

const projectState5 = ProjectState5.getInstance();


interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}

function validate4g(validatableInput:Validatable){
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

function autobind8j(_:any, _2:string, descriptor:PropertyDescriptor){
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


//Component Base Class
abstract class Component2<T extends HTMLElement,U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(templateId:string,hostElementId:string,insertAtStart:boolean,newElementId?:string,){
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(this.templateElement.content,true);
    
        this.element = importedNode.firstElementChild as U;
        if(newElementId)
            this.element.id = newElementId;

        this.attach(insertAtStart);
    }

    private attach(insertAtBeggining:boolean){
        this.hostElement.insertAdjacentElement(
            insertAtBeggining?'afterbegin':'beforeend',
            this.element);
    }

   abstract configure():void;
   abstract renderContent():void; 
}


//ProjectItem Class
class ProjectItem1 extends Component2<HTMLUListElement,HTMLLIElement> {
private project: Project5;

/* 02- 
I want to use a getter instead which returns us a proper term. So the right text basically.
So here I'll add a getter and convention, not a must do, but a convention you often see is 
to add getters and setters right below your upper fields.
So I will add it here, below my fields, above the constructor.
So now this is the text I return in this scenario.
*/

get persons(){
    if(this.project.people === 1) return '1 Person'; 
    else return `${this.project.people} Persons`
}

constructor(hostId:string,project: Project5){
    super('single-project',hostId,false,project.id);
    this.project = project;

    this.configure();
    this.renderContent();
    }

    configure(){}

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title;
        /*01 - adding Persons assigned here as string Well, that's better, but it's still 
        not optimal. What if we only have a project with one person?
        It still says persons, and that doesn't make too much sense.Now a getter can help 
        us there. So instead of saying persons or person here, I just say plus assigned.
        But actually I don't just want to output the number of people here.
        */

        this.element.querySelector('h3')!.textContent = this.persons + ' Assigned';

        /*
        03- So down later, instead of reaching out to this project, people, I will just say 
        this person's assigned and I access this like a normal property.So we're not calling 
        this like a function with parentheses.
        */
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}


//ProjectList Class
class ProjectList6 extends Component2<HTMLDivElement,HTMLElement>{
    assignedProjects:Project5[];

    constructor(private type: 'active' | 'finished'){
        super('project-list','app',false,`${type}-projects`)
        this.assignedProjects = [];

        projectState5.addListener((projects:Project5[])=>{
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active')
                    return prj.status === ProjectStatus4.Active;
                else return prj.status === ProjectStatus4.Finished;
            });

            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })

        this.renderContent();
    }

    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = 
            this.type.toUpperCase() + ' PROJECTS';
    }

    configure(): void {}

   private renderProjects(){

    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    listEl.innerHTML = '';
    for(const prjItem of this.assignedProjects){
        new ProjectItem1(this.element.querySelector('ul')!.id,prjItem);
    }
   }
}


// ProjectInput Class    
class ProjectInput11 extends Component2<HTMLDivElement,HTMLFormElement>{
    titleInputElement: HTMLInputElement;
    descriptionInputElement:HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super('project-input','app',true,'user-input');

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
    }

    configure(){
    this.element.addEventListener('submit',this.submitHandler);
    }

    renderContent(): void {}

    @autobind8j
    private submitHandler(event:Event){
    event.preventDefault();

    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
       
        projectState5.addProject(title,desc,people);
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
            !validate4g(titleValidatable) ||
            !validate4g(descriptionValidatable) ||
            !validate4g(peopleValidatable)
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
    
    const prjInput11 = new ProjectInput11();
    
    const activePrjList6 = new ProjectList6('active');
    const finishedPrjList6 = new ProjectList6('finished');