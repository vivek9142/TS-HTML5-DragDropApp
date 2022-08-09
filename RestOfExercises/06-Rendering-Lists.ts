/*
let's make sure we do more with that gathered user input then just output it in the console.
Instead, the goal should be that we also render this list of projects here based on this 
template where every project item is based on this template here, and we output the 
information we gathered here.

Besides having our project input class here, which is responsible for rendering the form and 
gathering the user input, I want to have another class which is responsible for rendering a 
list of projects and actually I will split that into two classes, one class for the list 
and one class per project item in the list.And then we need to find some way of passing 
that gathered input here basically to our project list and add a new item to it.
*/

 

interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}

function validate1(validatableInput:Validatable){
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

function autobind4(_:any, _2:string, descriptor:PropertyDescriptor){
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
01 - let's start by adding a project list class.Still, I will add it here above the project 
input class because I kind of rely on the project list class, which I'm about to build inside 
of the project input class. But again, it doesn't really matter.

And the idea of this class here is a bit related to what we did in Project Input.I want to 
reach out to my template here and then render it in a certain place of the application.
And therefore what we can do here is we can again add a constructor, we can add the fields we 
need,and there we'll need the template element and the host element in the end so we can add 
both here to our project list will also need the element itself, I'd say.

So the concrete element which is getting rendered and the types will differ though the host 
element will still be added because I want to render that list in that diff here as well.
But the concrete element which we do render of course is not a form element.But if we have a 
look at our list template here, we see there's a section inside of it.So we have a section 
element.Now turns out there is no element, no section element.
So we'll just have a regular HTML element because every element has this type here for some 
text, there are more specialized types.If they aren't, we can just use HTML type.
*/

//ProjectList Class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    /*
     02 - we need to get access to these elements so we can copy this code here Actually 
     from the constructor of the project input, add it to the constructor of project list and 
     now it just adjusts some things.
    */
    constructor(private type: 'active' | 'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLElement;
        
        /*
        The host element still is death with the ID app, so this does not change. Then I 
        import my content and then I will store the the first element of the imported 
        template.So basically the first element in the template which is the section 
        I store that in the element property here.However, this is not a HTML form element, 
        it's just an HTML element here.

         03 - 
        Now we also can assign an ID here and actually did should be dynamic, not hardcoded because we'll 
        have more than one list of projects. I want to have two lists in the final app, one 
        for the active projects and one for the inactive projects.
        And therefore, I want to get some additional information in the constructor, the 
        type of the project and I'll use that TypeScript shortcut you learn about where you 
        can add an assessor in front of the parameter, private or public, to automatically 
        create a property of the same name and store the value that's passed in on this 
        argument in that equally named property.
        So now this class will have a property named type as well.
        */
        this.element.id = `${type}-projects`;

        //05 - call attach func
        this.attach();

        //07- We can call this render content after we attached it to the DOM
        this.renderContent();
    }


    /*
    04 - Now, of course, we want to we want to render it right. That's the idea.
    For this, I'll again add a private method attach. Just as we had it in the project 
    input and in there it's now the goal to well attach this to the DOM
    to now render that list to the DOM.I will actually do the same as I did in 
    attach for the class projectInput.
    */
    private attach(){
        this.hostElement.insertAdjacentElement('beforeend',this.element);
    }

    /*
    06 -  It's not done with just adding the list to the DOM.The input was finished, right?
    The form here was finished. We had all the inputs there. All we needed to do was set up 
    an event listener. Now for the list here we actually have a header with an empty H two 
    tag for example, and I want to add some text there. So I will add another new method 
    here.

    A private method render content could be a fitting name. And my idea here is to fill the 
    the blank spaces in that template with some life here. For that, let's go to that 
    render content method.

    we're generally done. We have no items in that list yet.We'll work on this later
    */
    private renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = 
            this.type.toUpperCase() + ' PROJECTS';
    }
}

// ProjectInput Class    
class ProjectInput5{
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

    @autobind4
    private submitHandler(event:Event){
    event.preventDefault();

    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
        console.log(title,desc,people);
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
            !validate1(titleValidatable) ||
            !validate1(descriptionValidatable) ||
            !validate1(peopleValidatable)
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
    
    const prjInput5 = new ProjectInput5();
    
    /*
    08 - we can now all instantiate our lists.We have the active 
    project list, which we instantiate by calling new project list.
    */
    const activePrjList = new ProjectList('active');
    const finishedPrjList = new ProjectList('finished');