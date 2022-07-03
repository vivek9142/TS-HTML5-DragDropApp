/*
So getting projects from A to B is now our goal to be precise, when users create a new project, 
when they enter all the data, we want to create a new project object in the end, which we 
then output in our project list class as part of the unordered list, which is rendered there.
That's the idea.

Now, of course, a trivial way of implementing this could be to simply go to the place where 
the user input is entered and then here use document, get element by ID.To reach out for 
that and or that list we rendered as part of our project list class which has this ID here.
So Active Dash Project's list or finished Dash Project's list and then simply reach out to 
that and add a new item to it. But that's not really the idea of how I want to build this 
application.I want to build it in an object oriented way where we have our different 
classes that work together in a in a reactive way, where we create a new class.
And then something happens in the DOM where we call a method of a class, and then this class 
does something.

Now, of course, we could add a method to the project list class, let's say a add project 
method. That method should then be called when a project should be added and rendered, and 
we would have to find some way of calling it from inside the project input. To do that, we 
could make sure that we actually pass references to our lists here to the Project Input
constructor so that from inside the project input class, we can work with these concrete 
instances and call the methods on these instances because that is what we would have to do.
That would be a viable way, definitely an approach you could take.But I want to take an even 
more abstract approach, even more interesting approach in my opinion.

I will build a class which manages the state of our application, so to say a class which 
manages our projects or whichever stage we might need to manage in the application, which 
also allows us to then set up listeners in the different parts of the app that are interested.
This is a pattern that might sound familiar to you if you worked with frameworks like Angular 
or libraries like React and Redux, that you have a global state management object and you 
just listen to changes.
*/

/*
01 -  I'll add a project state management class and I will simply name it projectState
Now, the idea here is that in this class, we have a property or a field, a private field 
projects,which holds an array of projects.
Now, we also need to define how a project should look like.For now, I'll just say it's an 
array of anything, which of course is not perfect, not final.But I want to focus on that 
state management solution for now.So we have this list of projects here.
Now my goal is that I want to add an item to that list whenever we well click that add 
project button here.To make that work inside of the project state class I'll add an add 
project method, a public one.
*/

// Project State Management.
class ProjectState{
    private projects: any[] = [];
    /*
    Now we just need to push that information that we have a new project to our project list 
    class because that's the class which is responsible for outputting something to the 
    screen. And for that, I want to set up a subscription pattern in the end where inside of 
    our project state we manage a list of listeners. So a list of functions in the end, which 
    should be called whenever something changes. So for that, I'll add another private 
    property here. Listeners and listeners will be an empty array.And for now, again, just 
    an array of anything. We will specify this in greater detail later.
    */
    private listeners:any[] = [];
    
   private static instance:ProjectState;
    /* 03 - 
    We all learn about the private constructor to guarantee that this is a singleton class.
    We can create a private constructor here and then we have another private property here 
    instance which is of type project state.
    */
   private constructor(){

   }

   static getInstance(){
    if(this.instance) return this.instance;

    this.instance = new ProjectState();
    return this.instance;
   }
   /*
    05 - I forward this project and I will call slice on it to only return a copy of that 
    array and not the original so that it can't be edited from the place where the listener 
    function is coming from because it raise an object's r reference values in JavaScript.
   */
    addProject(title:string,description:string,numOfPeople:number){
        const newProject = {
            id:Math.random().toString(),
            title,
            description,
            people:numOfPeople
        };

        this.projects.push(newProject);
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
        /*
        Now, with that, we are able to add a project, but we still, of course, have a couple 
        of unclear questions. How do we call add project from inside our class down there 
        where we gather the user input from inside to submitHandler? How do we call Add 
        project and how do we pass that updated list of projects whenever it changes
        to the project list class? These are the two issues we of course, face at the moment.
        */
    }

    /*
    06 - I also want to have a method here at Listener where I get a listener function.So this 
    should be a function in the end here.The idea is that whenever something changes, like 
    here, when we add a new project, we call all listener functions.
    So we loop through all listeners of this listener, so through all listener functions.
    And then since these are function references, we can execute this as a function.And to 
    that function we pass the thing that's relevant for it based on the state we're managing, 
    which in this case of this class, of course, is our projects list.
    */

    addListener(ListenerFn: Function){
        this.listeners.push(ListenerFn);
    }

}

/* 02 - 
Well, one thing I will do here is I will create an instance of Project State here.A global 
instance which we can use from the entire file, and I'll do it right after we create that
class.So talking to that class is now super simple.You just have to use this global constant 
here.

04 - Now with that, we can call get instance down there.Like this project state get instance 
and we're guaranteed to always work with the exact same object and will always only have one 
object of the type in the entire application.Which is the idea here, because I only want to 
have one state management object for our project, and that is this project state with this 
Singleton constructor now.
*/

// const projectState = new ProjectState();
const projectState = ProjectState.getInstance();


interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}

function validate2(validatableInput:Validatable){
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
class ProjectList1 {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects:any[];

    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${type}-projects`;
        this.assignedProjects = [];

        /* 07 - 
        So now every listener function is getting executed and gets our copy, our brand new 
        copy of projects.Now we just need to go to the places where we want to be informed 
        about changes.In our case, the project list class here and set up such a listener.
        So here in the constructor of the project list class.Before we attach and render the 
        content, I will reach out to Project State and call add listener here to basically 
        register a listener function here.
        */
        projectState.addListener((projects:any[])=>{
            this.assignedProjects = projects;
            this.renderProjects();
        })
        /*
        So now I'm adding the projects, which I get because something changed in my state 
        here to my assigned projects, or I'm not adding it, I'm overriding the assigned 
        project with the new project.
        */

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
    08 - my idea is to render all these projects.so we need to make new method 
    */
   private renderProjects(){
    /*
    I will just call append child here on my list element. By the way here we should add an 
    exclamation mark to make it clear that this will not be null.We can also cast us to an 
    html ul list element to or to an unordered list element because that is what it will be.
    And then we can append a child here and that should be a brand new list item. So here we 
    can create our list item with document create element li.So it will be such an object and 
    therefore it will have a title.Now with that, if we go down there, we have our list item, 
    which now is added here.
    */
    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    for(const prjItem of this.assignedProjects){
        const listItem = document.createElement('li');
        listItem.textContent = prjItem.title;
        listEl?.appendChild(listItem)
    }
   }
}

// ProjectInput Class    
class ProjectInput6{
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
        /* 04 -
        Let's go down to the project input class, therefore, where we gather the user input.
        Here we can now call Project State at project and forward to title the description 
        and the people we get back from.Gather user input in the end.So now this project 
        should get created.
        */

        // console.log(title,desc,people);
        projectState.addProject(title,desc,people);
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
            !validate2(titleValidatable) ||
            !validate2(descriptionValidatable) ||
            !validate2(peopleValidatable)
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
    
    const prjInput6 = new ProjectInput6();
    
    const activePrjList1 = new ProjectList1('active');
    const finishedPrjList1 = new ProjectList1('finished');