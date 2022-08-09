/*
I want to add a base class which basically has template element, host element and element in 
it, which does this job of selecting elements in the DOM, which has the attached method which 
we always need ends on, so which basically manages all these shared functionalities which 
our classes that actually render something to the DOM have in common.

*/

enum ProjectStatus2 {
    Active ,
    Finished
}

class Project2{
    constructor(
        public id:string, 
        public title:string,
        public description:string,
        public people:number, 
        public status:ProjectStatus2 
        ){}
}
/*
16 - Now that also means that we, of course, don't know whether our listener will actually 
return an array of projects. So actually here.For this function type.I always want to have a 
generic type actually, so that we can set us from outside.
We can write a generic type.
*/
type Listener2<T> = (items:T[]) => void;

/*
15 - We will refactor our project state. Technically, there we don't need inheritance 
because we only have this one single state we manage in this entire application.
But imagine a bigger application where you have multiple different states, one for the user 
state, whether the user is logged in and so on, one for the project, one for a shopping cart.
Now you will notice that some features of your state class are always the same.Specifically 
that array of listeners and the add listener method.
So we could all use a base class here.
*/
class State<T> {
    /*
    We can use the same identifier because it's a different construct then our custom type.
    And then here when we say that we want to have a list of listeners, we have to tell 
    TypeScript which generic type the listener is use for this state object we're creating.
    And that simply means we can forward our generic type here and here.So when we now
    extend state, we have to specify the type of data this state will work with and instead
    of state, this then gets forwarded to our listener custom type. That's the idea.
    */
   // 18 - make listeners as protected
    protected listeners:Listener2<T>[] = [];

    addListener(ListenerFn: Listener2<T>){
        this.listeners.push(ListenerFn);
    }
}

// Project State Management.
class ProjectState3 extends State<Project2>{
    private projects: Project2[] = [];
    // private listeners:Listener2[] = [];
    
   private static instance1:ProjectState3;
   private constructor(){
    /*
    16 - Now, the private constructor here has a problem, as you can tell, because we're not 
    calling super.Well, we should definitely do that.Let's call super in here.
    */
   super();
   }

   static getInstance(){
    if(this.instance1) return this.instance1;

    this.instance1 = new ProjectState3();
    return this.instance1;
   }
    
    addProject(title:string,description:string,numOfPeople:number){
        const newProject = new Project2(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus2.Active
        );

        this.projects.push(newProject);
        /*
        17 - we go through the listeners, we see listeners as private and 
        it's private in our base class. Now that means we can only access it from inside the 
        base class. But you'll learn about another access modifier, which is similar to 
        private, but also allows access  from inheriting classes that would be protected.

        Protected means it still can't be accessed from outside the class, but it can be 
        accessed from any class that inherits.
        */
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
    
    // addListener(ListenerFn: Listener2){
    //     this.listeners.push(ListenerFn);
    // }

}

const projectState3 = ProjectState3.getInstance();


interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}

function validate3ih(validatableInput:Validatable){
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

function autobind7if(_:any, _2:string, descriptor:PropertyDescriptor){
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
01 - Basically here I'll add the component base class.
you might know this term from React or Angular if you work with that and even if you didn't 
work with that, you can think of these classes as UI user interface components which we 
render to the screen, and every component is in the end a render able object which has 
some functionalities that allow us to render it. 

And then the concrete instances or the inherited classes add extra functionality which this 
specific component needs.So what goes into the general component class then?
Well, I would say these three elements for sure template element, host element and element.
Now we do have a problem here, however, regarding the types, the template element will always 
be an HTML template element, but the host element doesn't always have to be a death.

For example, when we will add a project item, class will render that in a project list and 
not directly even our root div here.So that's not always a death.And this year, well, it's 
always an HTML element.We can certainly settle on that.But like in the case of the project 
input class, we actually know that it's a more specific form of it.

It's an HTML form element. So we would lose this extra information if we restrict ourselves 
to always having just an HTML element there without storing more specific information.
So how can we work around that? Well, by not just using inheritance, but by creating a 
generic class here, where when we inherit from it, we can set the concrete types.
For that.

We add angle brackets after the class name and then Q identifiers of our choice like T and U, 
which would be common choices.And now we also can add some constraints here and say that t 
will certainly be some kind of HTML element. It can be just an HTML element or a more 
specific version of it. And the same is true for you.And then here we know the host element 
will be of type T and the element will be of type U. And now whenever we inherit from this 
class, we can specify the concrete types so that we can work with different types in 
different places where we inherit.
*/


/*
08 - I also want to mark this class now as an abstract class, because people should never 
directly instantiate it. Instead, it should always be used for inheritance.
So in front of class I add the abstract keyword.
*/

//Component Base Class
abstract class Component<T extends HTMLElement,U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    /*
    In that constructor. We will need a little bit of information. We need to know the ID of 
    our template so that we know how to select it and there should be a string.We need to 
    know the host element ID, which also needs to be a string so that we know where to render
    this component.And I also want to get a new element ID so that we get an ID that has to 
    be assigned to the newly rendered element.
    This, however, is optional, which I signaled by adding a question mark after the 
    parameter.The alternative would be to also accept undefined here as a type, but I'll 
    just use the question mark.
    */

    /*
    02 - And now with that in the constructor, we can basically. Get this code here from 
    ProjectList class. And put it into our constructor of the component class so that we store the template element.
    But of course, now the ID which we're getting here is that template ID, which is why I'm 
    getting this as an argument in the constructor and for the host element.The ID here, of 
    course, is our host element.ID like this.
    Also important, of course, regarding the casting here, we know this will be of type T 
    because T here is this generic type which we store or which we use for our host element.
    */

    /*
    06 - we should move that in front of our optional parameter.Optional parameters should 
    always be lost because people might omit them.Your required parameters therefore can't 
    come after these optional parameters and insert at start is then forwarded to attach 
    their.Insert at the beginning.
    */
    constructor(templateId:string,hostElementId:string,insertAtStart:boolean,newElementId?:string,){
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(this.templateElement.content,true);
        /*
        03 - Now, of course, we might not always have this because it's optional, so we 
        should check if we do have it.So if new element ID is a thing and only if it is a 
        thing, only then I will try to assign it.Otherwise we don't try it because then we 
        have no ID to assign.
        */
        this.element = importedNode.firstElementChild as U;
        if(newElementId)
            this.element.id = newElementId;

        this.attach(insertAtStart);

        /*
        14 - In case you're wondering why I'm not calling, configure and render content here 
        in the abstract class in the constructor.Well, we could do this.
        But we might have a problem.
        
        Then if we call this in the in the component class, then we might call a method in 
        the inheriting class.So in a class that extends component, we are render content or 
        configure relies on something where the constructor of the inheriting class actually 
        maybe set something up only after the base class constructor finished which render 
        content and or configure rely on.
        That's why it's safer to basically make sure that the inheritance class has to call 
        these methods instead of the base class calling these methods for us.
        */
    }

    /*
    04- we have the constructor now.Let's use the attach function here. So let's copy 
    the attached method from one of our other classes and add it here as a private method
    in the component class.
    */
    private attach(insertAtBeggining:boolean){
        /*
        05 -We can then all the call this attach at the end of the constructor of the 
        component class.Now here we want to add an element, but we don't know where it 
        should be added.
        So that's actually some extra information we should fetch here as a fourth argument 
        than a constructor insert.
        */

        /*
        07 - I'm just using a different name here to avoid confusion is received as a boolean 
        and then here we check if insert at beginning is true.If it is, then here.
        We have after begin.Otherwise, we have before end.Now we're flexible regarding how 
        this gets inserted.
        */
        this.hostElement.insertAdjacentElement(
            insertAtBeggining?'afterbegin':'beforeend',
            this.element);
    }

    /*
    09 - I will also add two more methods and that's the Configure method and also then the 
    render content method and I will add it as an abstract method, which means the concrete 
    implementation is missing here.But we now basically force any class inheriting from 
    component to add these two methods and to have them available.
    I'm just adding this here so that if someone else looks at our code, he or she can get a 
    good understanding of what the idea behind the component clause is that it does all the 
    general rendering or the attachment of the component, but that the concrete content and 
    configuration then needs to happen in the place where we inherit.
    Side note you can't have private abstract methods, so private has to be admitted here.
    That's not allowed by TypeScript.
    */
   abstract configure():void;
   abstract renderContent():void; 
}

/*
10 - we can extend component here on the project list and now get rid of these free properties.
We keep the assigned projects because that's specific to the project list.We also now want to 
specify the concrete values that should be plugged in for our generic types.And we know if 
we revert this, we know that we'll have an HTML development and a HTML element.So here I will 
pass in HTML div element and HTML element like this and then get rid of these free properties
in the constructor.
We now don't need that here, but instead we need to call super at the beginning to call the 
constructor of the base class.And to do that we need to pass some information to the Super 
Constructor.We need to pass some information.

The idea of our template element, the host element ID whenever we want to insert this at the 
start of the host element and potentially the ID that should be assigned to the new element.
So here's our template ID with that. We can get rid of this here.
*/

//ProjectList Class
class ProjectList4 extends Component<HTMLDivElement,HTMLElement>{
    // templateElement: HTMLTemplateElement;
    // hostElement: HTMLDivElement;
    // element: HTMLElement;
    assignedProjects:Project2[];

    constructor(private type: 'active' | 'finished'){
        super('project-list','app',false,`${type}-projects`)
        this.assignedProjects = [];

        projectState3.addListener((projects:Project2[])=>{
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active')
                    return prj.status === ProjectStatus2.Active;
                else return prj.status === ProjectStatus2.Finished;
            });

            this.assignedProjects = relevantProjects;
            this.renderProjects();
        })
        //remove attach
        // this.attach();
        this.renderContent();
    }

    /*
    11 - Now, you see, I still get an error here because we have an attached method here in 
    project list and that clashes with the attached method we have in the base class.
    So let's get rid of this attach method here.
    */
    
    // private attach(){
    //     this.hostElement.insertAdjacentElement('beforeend',this.element);
    // }

    /*
    12 - Now we still get an error because you see render content is private here, but we 
    specify it as a public method here.I would love to have it as a private one, but 
    private abstract methods are not supported.So I will remove the private keyword here 
    */
    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = 
            this.type.toUpperCase() + ' PROJECTS';
    }

    /*
    13 - we're left with one issue here that we're not having that configure method, which I 
    promised to have here.Well, let's add it.

    So here, besides render config, we can add configure even though I'm not doing anything 
    here.Alternatively, you could convert this here in Abstract base class to be an optional 
    method by adding a question mark.Then you're not forced to add it.
    */
    configure(): void {
    }

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

/*
Let's do the same for project input now there.
*/

// ProjectInput Class    
class ProjectInput9 extends Component<HTMLDivElement,HTMLFormElement>{
    // templateElement: HTMLTemplateElement;
    // hostElement: HTMLDivElement;
    // element: HTMLFormElement;
    
    titleInputElement: HTMLInputElement;
    descriptionInputElement:HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super('project-input','app',true,'user-input');
        // this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        // this.hostElement = document.getElementById('app')! as HTMLDivElement;
        // const importedNode = document.importNode(this.templateElement.content,true);
        // this.element = importedNode.firstElementChild as HTMLFormElement;
        
        // this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        //Of course, let's get rid of attach because that's now something 
        //the base clause does for us.
        // this.attach();
    }
    // private attach(){
    //     this.hostElement.insertAdjacentElement('afterbegin',this.element);
    // }

    configure(){
    this.element.addEventListener('submit',this.submitHandler);
    }

    renderContent(): void {}

    @autobind7if
    private submitHandler(event:Event){
    event.preventDefault();

    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
       
        projectState3.addProject(title,desc,people);
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
            !validate3ih(titleValidatable) ||
            !validate3ih(descriptionValidatable) ||
            !validate3ih(peopleValidatable)
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
    
    const prjInput9 = new ProjectInput9();
    
    const activePrjList4 = new ProjectList4('active');
    const finishedPrjList4 = new ProjectList4('finished');