/*
I want to work on these types here that any type I'm using here for my assigned projects, 
for the listeners here and also for the projects in the project state.
Of course, here.I don't really want to work with any.It would make more sense to have a 
dedicated project class or project type which we can use, and indeed I will create a class 
for that. Project Type.

Simply by using class project so that we have a way of building project objects which always 
have the same structure.Right now I'm doing it down there with the literal notation.
The downside of that, of course, is that we have to remember that it's description and not 
desk, that we need an ID, which is a string and so on.So that's where a custom type can help us.

And I'll create a class and not an interface or a custom type with the type keyword 
because I want to be able to instantiate it.
*/

/*
01 - creating a class - Simply by using class project so that we have a way of building 
project objects which always have the same structure.
Now I want to add a status to a project which of course can be changed so that we actually 
can filter for active projects in the first box and finish projects in the second box so 
that we only show the right projects in every box.

And now the question, of course, is which type should this status have?

Now we could use a union type with two literal types active and finished what we used earlier already.

But here I also want to introduce or reintroduce another type we learned about, and that's the enum.

The enum is perfect here because we have exactly two options.
*/

enum ProjectStatus {
    Active ,
    Finished
}

class Project{
    constructor(
        public id:string, 
        public title:string,
        public description:string,
        public people:number, 
        public status:ProjectStatus 
        ){

        }
}

/*
05 - we also have the listener here, and for that I'll add a new custom type listener because 
I want to basically encode a function type with one word.
So what do I mean with that?

Well, of course, a listener here in our application, it's just a function, right?What we 
store in the listeners array is just a bunch of functions. Add listener pushes a new 
function and when something changes, we execute that function.So here a listener is really 
just a function, but it is a function that receives our. Items, certain items, in our case, 
an array of projects.

And that then does something with it.Now, to be precise here, of course, to define a 
function type, we don't have curly braces here,but instead, as you learn the return type 
and that will be wide, which means we don't care about any value that listener function 
might return in the place where we work with listeners.

We don't need any return type.
We just want to ensure that whoever passes us.Such a listener expects to get some items 
when the listener fires. With that here we can say that listeners is an array of listener 
well functions in the end.
*/
type Listener = (items:Project[]) => void;


/*
02 - This is now my project class.
With that here we can say that this is an array of projects using that project class.
*/
// Project State Management.
class ProjectState1{
    // private projects: any[] = [];
    // private listeners:any[] = [];

    private projects: Project[] = [];
    private listeners:Listener[] = [];
    
   private static instance1:ProjectState1;
   private constructor(){
   }

   static getInstance(){
    if(this.instance1) return this.instance1;

    this.instance1 = new ProjectState1();
    return this.instance1;
   }
    /*
    03- when we create a project here, we do that by using new project whoops project, not
    project state.And here to project we forward an ID in this case, as mentioned before, 
    a random number which we convert to a string, then the title, then the description, 
    then the number of people here and then also of course, that status.
    
    And one thing I want to have here in this application and this demo project is that every 
    new project by default is active.
    */

    addProject(title:string,description:string,numOfPeople:number){
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );

        this.projects.push(newProject);
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
    /*
    06 - And here, when I push listener function, I need to make clear that it's not just 
    any function, but that is of type listener.
    */
    addListener(ListenerFn: Listener){
        this.listeners.push(ListenerFn);
    }

}

const projectState1 = ProjectState1.getInstance();


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

/*
04 - now there's one other place where we need the project class and that 
is here in the project list class.

There we have the assigned projects property and of course that should also be an array of
projects. Now with that we're using better typing and one advantage is that here in render 
projects, we now also get all the completion here, for example, and we would also get 
an error, a compilation error if we try to save that because now it types could understands 
with which types we're working here.
*/

//ProjectList Class
class ProjectList2 {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects:Project[];

    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${type}-projects`;
        this.assignedProjects = [];

         /*
        07 - Then everything works now in the place where we use ADD listener, which is down 
        there.We now also of course can enhance our typing and make it clear that here we 
        will actually get a bunch of projects.
        */
        projectState1.addListener((projects:Project[])=>{
            this.assignedProjects = projects;
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

    
   private renderProjects(){

    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    for(const prjItem of this.assignedProjects){
        const listItem = document.createElement('li');
        listItem.textContent = prjItem.title;
        listEl?.appendChild(listItem)
    }
   }
}

// ProjectInput Class    
class ProjectInput7{
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
       
        projectState1.addProject(title,desc,people);
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
    
    const prjInput7 = new ProjectInput7();
    
    const activePrjList2 = new ProjectList2('active');
    const finishedPrjList2 = new ProjectList2('finished');