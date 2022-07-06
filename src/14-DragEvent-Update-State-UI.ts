/*
To make it drop able, we have to go to the class or to the component in our application, 
which should in the end act as a drag target.
So here, project list class is the right class, and there we can implement our second 
interface, which we added the drag target interface.
*/

//Drag & Drop Interfaces
interface Draggable{
   dragStartHandler(event:DragEvent):void;
   dragEndHandler(event:DragEvent):void;
}

interface DragTarget{
    dragOverHandler(event:DragEvent):void;
    dropHandler(event:DragEvent):void;
    dragLeaveHandler(event:DragEvent):void;
}

//Project Type
enum ProjectStatus6 {
    Active ,
    Finished
}

class Project7{
    constructor(
        public id:string, 
        public title:string,
        public description:string,
        public people:number, 
        public status:ProjectStatus6 
        ){}
}

type Listener6<T> = (items:T[]) => void;

class State4<T> {
    protected listeners:Listener6<T>[] = [];

    addListener(ListenerFn: Listener6<T>){
        this.listeners.push(ListenerFn);
    }
}

// Project State Management.
class ProjectState7 extends State4<Project7>{
    private projects: Project7[] = [];
    
   private static instance1:ProjectState7;
   private constructor(){
   super();
   }

   static getInstance(){
    if(this.instance1) return this.instance1;

    this.instance1 = new ProjectState7();
    return this.instance1;
   }
    
    addProject(title:string,description:string,numOfPeople:number){
        const newProject = new Project7(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus6.Active
        );

        this.projects.push(newProject);
        
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
    
}

const projectState7 = ProjectState7.getInstance();


interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}

function validate6g(validatableInput:Validatable){
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

function autobind10j(_:any, _2:string, descriptor:PropertyDescriptor){
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
abstract class Component4<T extends HTMLElement,U extends HTMLElement> {
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
class ProjectItem3 extends Component4<HTMLUListElement,HTMLLIElement> implements Draggable {
private project: Project7;


get persons(){
    if(this.project.people === 1) return '1 Person'; 
    else return `${this.project.people} Persons`
}

constructor(hostId:string,project: Project7){
    super('single-project',hostId,false,project.id);
    this.project = project;

    this.configure();
    this.renderContent();
    }
    
    @autobind10j
    dragStartHandler(event: DragEvent): void {
        console.log(event)
    }

    @autobind10j
    dragEndHandler(_: DragEvent): void {
        console.log('dragend')
    }

    configure(){
        this.element.addEventListener('dragstart',this.dragStartHandler);
        this.element.addEventListener('dragend',this.dragEndHandler);
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' Assigned';
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}

/*
02 - we can implement our second interface, which we added the drag target interface.
Now just as the drag able interface, this forces us to, to add certain methods, to be precise 
here, we need to add the drag over handler, the drop handler and the drag leave handler.
So let's do that. Maybe all the right here below the constructor, above configure, but the 
exact place is up to you. The order of methods does not matter.
*/

// 01 - add implements dragTarget

//ProjectList Class
class ProjectList8 extends Component4<HTMLDivElement,HTMLElement> implements DragTarget{
    assignedProjects:Project7[];

    constructor(private type: 'active' | 'finished'){
        super('project-list','app',false,`${type}-projects`)
        this.assignedProjects = [];

        
        this.configure();
        this.renderContent();
    }

    @autobind10j
    dragOverHandler(_: DragEvent){
        /*
        03 - In the drag over handler I want to change the appearance of of my box or off the 
        unordered list in there to visualize that this is a drop area. Because right now when 
        we drag around element, we get no clue of where we can drop it.Right?
        Nothing changes on the UI.So I want to change this.

        To change this, I'll add a certain c US class to the unordered list which you find 
        an app sees as the drop class which will change the background color.
        And therefore in here for a start, we just need to get access to our unordered list 
        element.We can do so by reaching out to this element, query selector UL and add an 
        exclamation mark because there will always be an unordered list there, even if it 
        holds no elements yet. make sure that that this keyword is bound to the surrounding 
        class.

        And then with the list element selected, we can use the class list property of DOM 
        elements. So this is vanilla JavaScript here in the end and call the add method there 
        to add the Undroppable class to it.
        */

        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable');
    }
    @autobind10j
    dropHandler(_: DragEvent){   
    }
    @autobind10j
    dragLeaveHandler(_: unknown){
        /*
        05 - So when we basically drag it over here and then go away, make sure that the 
        blue background goes away.In that case, that's what I want to do next.

        For that, we can use the drag leaf handler here because dad will fire whenever we 
        well leave this element with our drag element.And now there are of course also want 
        to get access to my onward list.So I'll copy that code.But then there I want to 
        remove the dropable class 
        */
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    /*
    06 - So now the background really is updated.You see some flickering here because the 
    drag live event, all the fires, if you go from having the mouse cursor over the 
    background to having it over a rendered element, but that should be fine here.
    */

    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = 
            this.type.toUpperCase() + ' PROJECTS';
    }

    configure(): void {
        /*
        04 - Now with that, we, of course, have to make sure that the drag over handler 
        actually is fired when we drag something over this element here, over this rendered 
        section.And to do that in the configure method where we already have one listener 
        here listening to our state changes.

        I will also register listeners on the element itself.
        */
        this.element.addEventListener('dragover',this.dragOverHandler);
        this.element.addEventListener('dragleave',this.dragLeaveHandler);
        this.element.addEventListener('drop',this.dropHandler);
        
        projectState7.addListener((projects:Project7[])=>{
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active')
                    return prj.status === ProjectStatus6.Active;
                else return prj.status === ProjectStatus6.Finished;
            });

            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

   private renderProjects(){

    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    listEl.innerHTML = '';
    for(const prjItem of this.assignedProjects){
        new ProjectItem3(this.element.querySelector('ul')!.id,prjItem);
    }
   }
}


// ProjectInput Class    
class ProjectInput13 extends Component4<HTMLDivElement,HTMLFormElement>{
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

    @autobind10j
    private submitHandler(event:Event){
    event.preventDefault();

    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
       
        projectState7.addProject(title,desc,people);
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
            !validate6g(titleValidatable) ||
            !validate6g(descriptionValidatable) ||
            !validate6g(peopleValidatable)
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
    
    const prjInput13 = new ProjectInput13();
    
    const activePrjList8 = new ProjectList8('active');
    const finishedPrjList8 = new ProjectList8('finished');