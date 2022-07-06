/*
With all our inheritance work out of the way. Let's come back to rendering list items.
Let's render more details there. And as I mentioned, let's also make sure we render them 
differently. Thus far, we followed an object oriented approach.And for example, for our project list, we have a class.

And when we instantiate that class, such a box gets rendered here.

And the same for the input.

We have a project input class and when we instantiate that this project input area here at the top gets
Instead of creating a list item like this, we would just instantiate our project item class.

And in the constructor of that project item class, we would then do all the initialization and so on.
That is my idea.
*/

enum ProjectStatus3 {
    Active ,
    Finished
}

class Project4{
    constructor(
        public id:string, 
        public title:string,
        public description:string,
        public people:number, 
        public status:ProjectStatus3 
        ){}
}

type Listener3<T> = (items:T[]) => void;

class State1<T> {
    protected listeners:Listener3<T>[] = [];

    addListener(ListenerFn: Listener3<T>){
        this.listeners.push(ListenerFn);
    }
}

// Project State Management.
class ProjectState4 extends State1<Project4>{
    private projects: Project4[] = [];
    
   private static instance1:ProjectState4;
   private constructor(){
   super();
   }

   static getInstance(){
    if(this.instance1) return this.instance1;

    this.instance1 = new ProjectState4();
    return this.instance1;
   }
    
    addProject(title:string,description:string,numOfPeople:number){
        const newProject = new Project4(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus3.Active
        );

        this.projects.push(newProject);
        
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
    
}

const projectState4 = ProjectState4.getInstance();


interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}

function validate3g(validatableInput:Validatable){
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

function autobind7j(_:any, _2:string, descriptor:PropertyDescriptor){
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
abstract class Component1<T extends HTMLElement,U extends HTMLElement> {
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
0-1 - I will add the project item class and this will be the class responsible for rendering a 
single project item.Now the project item class should also extend the component because it 
will be a class that is responsible for rendering something on the screen.

And that is what we have our component class for, right?
That is what we build it for so that we pass a template, a host element, and so on.
*/

//ProjectItem Class
class ProjectItem extends Component1<HTMLUListElement,HTMLLIElement> {
private project: Project4;

constructor(hostId:string,project: Project4){
    /*
    02 - now to super.We need to provide the ID of the element where the project item should 
    be rendered in. And of course that ID is not fixed because we have two lists where the 
    item could be a render too.So I expect to get that ID here in the constructor there.

    I want to get the host ID, let's say, which should be a string and we can forward that 
    to super.However, the first thing we forward to super is the template ID for a single 
    list item and that is this template here. So we can just grab that from index.html.
    
    Now of course, that's a very simple template. You could argue whether you really need 
    that.It's just a list item we could create that encode with document create element as 
    well.
    But in order to be able to reuse our component base class, which relies on templates, 
    we will use this approach.
    */
    super('single-project',hostId,false,project.id);
    this.project = project;

    this.configure();
    this.renderContent();
    }

    /*
    03 - And it will also call, configure and render content here at the end of the 
    constructor.Now regarding the configuration, there is nothing we need to do right now 
    for the content we want to render.

    There definitely is work to do. 
    
    Now we have a very simple template here and we could actually change this here in the 
    index HTML file to be a bit more complex so that every project has ah2 tag, has ah3 tag 
    below that, let's say, and  also has a paragraph so that we can output the title of the 
    project, the number of persons assigned maybe, and then the description.

    And then here in apts and render content, we just need to reach out to these different 
    elements in our element.
    */
    configure(){}

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.project.people.toString();
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}


//ProjectList Class
class ProjectList5 extends Component1<HTMLDivElement,HTMLElement>{
    assignedProjects:Project4[];

    constructor(private type: 'active' | 'finished'){
        super('project-list','app',false,`${type}-projects`)
        this.assignedProjects = [];

        projectState4.addListener((projects:Project4[])=>{
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active')
                    return prj.status === ProjectStatus3.Active;
                else return prj.status === ProjectStatus3.Finished;
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

/*
04 - we need to use the project item and the place to use it as the project list because 
that renders the list of projects and they are specifically in render projects. This is 
where we need to make sure that we render our project items here. We do go through all the 
project items in assigned projects and assigned projects.

Is this property here which has a list of or an array of projects?So now here in this loop, 
instead of creating a list item manually and so on, I will get rid of all of that and simply 
say New project. Item here.And now to project item, we need to pass the idea of the host.
Now, that, of course, is the ID that was set on our list item here. So basically this dot 
element, dot ID, that's the ID of the host element because this element, which is the 
unordered list, should be the host.

Then second argument here is the project and let's purge item here basically.So this concept 
which we get inside of the loop and now the attachment will happen inside of project item or 
inside of the base class of the component class, which project item extends and instantiating
project item should be all we need to do.
*/
   private renderProjects(){

    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    listEl.innerHTML = '';
    for(const prjItem of this.assignedProjects){
        // const listItem = document.createElement('li');
        // listItem.textContent = prjItem.title;
        // listEl?.appendChild(listItem)

        /*
        05 - To fix the bullet point, let's inspect our content. And what we see there is 
        that the list item actually is rendered outside of the unordered list, so it's not 
        inside of it.
        
        If it were inside, then it would work properly, but I can't drag it there, so we 
        need to make sure it gets rendered inside of the unordered list.So let's find out 
        why that's not the case. It's probably not the case because in project item I pass 
        falls here to the base class constructor and passing falls here means it's not 
        getting inserted at the start.
        
        And that in turn means that in attach we have before end as a value here where it's 
        getting inserted.This is however, what we want to have happen. So that's probably 
        not the problem.This element here is not the unordered list we have in that box.
        It's the box itself.It's our section.If we inspect the template, we see the section 
        here is what actually gets rendered for our project list class.

        It's not just the list, it's the section which always includes a header. So we 
        actually need to get access to the list inside of our element here and then get 
        access to the ID of that list.Because here we do actually set an ID on that list.
        So there will be an ID, we just have to grab the right one.So getting the ID of the 
        element itself is simply not correct.Instead, here we should get the ID of the 
        unordered list in our element, and we know with certainty that there will be an 
        unordered list. So we can't skip the null check by adding the exclamation mark.
        */
        // new ProjectItem(this.element.id,prjItem);

        new ProjectItem(this.element.querySelector('ul')!.id,prjItem);
    }
    /**/
   }
}


// ProjectInput Class    
class ProjectInput10 extends Component1<HTMLDivElement,HTMLFormElement>{
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

    @autobind7j
    private submitHandler(event:Event){
    event.preventDefault();

    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
       
        projectState4.addProject(title,desc,people);
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
            !validate3g(titleValidatable) ||
            !validate3g(descriptionValidatable) ||
            !validate3g(peopleValidatable)
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
    
    const prjInput10 = new ProjectInput10();
    
    const activePrjList5 = new ProjectList5('active');
    const finishedPrjList5 = new ProjectList5('finished');