/*
So two things we need to implement drag and drop and then also this behind the scenes state 
and data update.

Now let's start with drag and drop.
*/

/*
01 - Well, I want to reuse interfaces here Drag and drop interfaces, but not just to define
the structure of some objects as we previously used interfaces, but instead to really set up 
a contract which certain classes can sign. To force these classes to.To basically implement 
certain methods that help us with drag and drop.To be precise, I'm thinking about two 
interfaces.
And of course, using these interfaces will be optional, but this will allow us to, well, 
basically provide some code that forces a class to implement everything it needs to be 
drag & drop.

My idea here is that we can add the drag interface to any class that renders an element
which can be dragable.In our example, that would be the project item class.The project item 
class is responsible for rendering well these project items and these should be the
dragable pieces and the boxes, active projects and finished projects.
So here our project list class should be drag targets.
*/

//Drag & Drop Interfaces
interface Draggable{
    /*
    We basically need to event listeners and therefore two handlers for these events.
    A drag start handler which will be a method and a drag end handler. Because when 
    implementing drag and drop, the thing which you want to drag will require some listener
    that listens to the start of that drag event, and also potentially a listener that 
    listens to the end of the drag event so that you can do any kind of updates there 
    which you want to do.Now, the drag start event handler will get an event object, 
    which will be a drag event that's a built in type typescript or ships with because 
    of our TS config setup and the libs we're adding there and
    it will not return anything.
    */
   dragStartHandler(event:DragEvent):void;
   dragEndHandler(event:DragEvent):void;
}

interface DragTarget{
    /*
    Now you need to implement a drag over handler when implementing drag and drop in 
    JavaScript to basically signal the browser and JavaScript that the thing you're dragging 
    something over is a valid drag target.
    If you don't do the right thing in the drag over, handler dropping will not be possible.
    You need the drop handler then to react to the actual drop that happens. So if the drag 
    over handler will permit to drop with the drop, handler will handle the drop.And then 
    here we can update our data and UI, for example, and the drag live handler can be useful
    if we're, for example, giving some visual feedback to the user when he or she drag 
    something over the box, for example, we change the background color.

    Well, if no drop happens and instead it's cancelled or the user moves the element away, 
    we can use the drag leaf handler to revert our visual update.Now all three handlers, 
    all the receive a drag event and don't return anything.
    */
   
    dragOverHandler(event:DragEvent):void;
    dropHandler(event:DragEvent):void;
    dragLeaveHandler(event:DragEvent):void;
}

//Project Type
enum ProjectStatus5 {
    Active ,
    Finished
}

class Project6{
    constructor(
        public id:string, 
        public title:string,
        public description:string,
        public people:number, 
        public status:ProjectStatus5 
        ){}
}

type Listener5<T> = (items:T[]) => void;

class State3<T> {
    protected listeners:Listener5<T>[] = [];

    addListener(ListenerFn: Listener5<T>){
        this.listeners.push(ListenerFn);
    }
}

// Project State Management.
class ProjectState6 extends State3<Project6>{
    private projects: Project6[] = [];
    
   private static instance1:ProjectState6;
   private constructor(){
   super();
   }

   static getInstance(){
    if(this.instance1) return this.instance1;

    this.instance1 = new ProjectState6();
    return this.instance1;
   }
    
    addProject(title:string,description:string,numOfPeople:number){
        const newProject = new Project6(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus5.Active
        );

        this.projects.push(newProject);
        
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
    
}

const projectState6 = ProjectState6.getInstance();


interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}

function validate5g(validatableInput:Validatable){
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

function autobind9j(_:any, _2:string, descriptor:PropertyDescriptor){
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
abstract class Component3<T extends HTMLElement,U extends HTMLElement> {
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

/*
02 -  I want to start with the project item, so let's find our project item class for this.
Here's the component, here's the project item. And now you might remember that an interface 
cannot just be used to define a custom object type, but you can use it as a contract on a 
class. You can call implements or add implements here after your class name and after 
potential extensions you're doing, and then implement the interface, in this case, 
the Dragabble interface.
When you do so, you get an error now that the class here incorrectly implements the 
interface, because that Dragabble interface forces us to add two methods, if you remember.
So let's add them here, maybe below the constructor.
*/

//ProjectItem Class
class ProjectItem2 extends Component3<HTMLUListElement,HTMLLIElement> implements Draggable {
private project: Project6;


get persons(){
    if(this.project.people === 1) return '1 Person'; 
    else return `${this.project.people} Persons`
}

constructor(hostId:string,project: Project6){
    super('single-project',hostId,false,project.id);
    this.project = project;

    this.configure();
    this.renderContent();
    }
    /*
    03 - we have these two methods added.Now, that alone does not enable drag and drop.
    It just helps us right drag able components or drag classes in a uniform way.
    So if we add more and more classes, which should be drag able, we always will have these
    methods, which simply makes it easier to reason about our code and to work our code, 
    especially when working in a team because everyone knows where to put in work for 
    the drag start event.

    Now, what this does not do, of course, is listen to a drag start event.That's something 
    we can do in the Configure method, which you already have though. We can reach out to 
    our rendered element and add an event listener to it. And there that would be the drag 
    start event.The Drag Start event is one event, one default browser DOM event you can 
    listen to. And the event handler we want to trigger, of course, is the drag.Start handler
    at which we can point here.
    */

    @autobind9j
    dragStartHandler(event: DragEvent): void {
        console.log(event)
    }
    /*
    05 - I actually have nothing specific I want to do with it and therefore I will also 
    blank this parameter and basically tell TypeScript that I'm not using it here.
    */
    @autobind9j
    dragEndHandler(_: DragEvent): void {
        console.log('dragend')
    }

    /*
    06 - Now, that alone won't do the trick though. If you save everything and you add some 
    project here, you'll see that you can't really drag it right.If you try to drag it, that 
    will not work because you also need to change something in your HTML file on this list 
    item which is getting rendered for every project, which is the thing you want to drag.
    You have to add the drag able. Attribute and set this to true that is important.
    This tells the browser that this will be dragabble 
    */

    /*
    07 - So our listeners are connected and we can drag now. We can work on the drop target.
    So on the box where this should be drag able to to then add the project to that box.
    */

    /*
    08 - One thing I will also do real quick is in the app CSS file on the list item. So on 
    project lI, I will add a background color of white simply so that we can see this a bit 
    better.So here are project L.I added white so that when we do drag around the project 
    here, we do have the white background here.So this makes it a bit easier to see.
    */

    /*04 - add these methods in configure to listen to these events*/
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


//ProjectList Class
class ProjectList7 extends Component3<HTMLDivElement,HTMLElement>{
    assignedProjects:Project6[];

    constructor(private type: 'active' | 'finished'){
        super('project-list','app',false,`${type}-projects`)
        this.assignedProjects = [];

        projectState6.addListener((projects:Project6[])=>{
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active')
                    return prj.status === ProjectStatus5.Active;
                else return prj.status === ProjectStatus5.Finished;
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
        new ProjectItem2(this.element.querySelector('ul')!.id,prjItem);
    }
   }
}


// ProjectInput Class    
class ProjectInput12 extends Component3<HTMLDivElement,HTMLFormElement>{
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

    @autobind9j
    private submitHandler(event:Event){
    event.preventDefault();

    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
       
        projectState6.addProject(title,desc,people);
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
            !validate5g(titleValidatable) ||
            !validate5g(descriptionValidatable) ||
            !validate5g(peopleValidatable)
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
    
    const prjInput12 = new ProjectInput12();
    
    const activePrjList7 = new ProjectList7('active');
    const finishedPrjList7 = new ProjectList7('finished');