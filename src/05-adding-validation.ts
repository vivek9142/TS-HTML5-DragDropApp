/*
we need have some validated function which doesn't exist yet, but that we later have
it to which I pass the to enter title or actually a configuration object.
I'd say where the value is to enter title so the thing to be validated, but where I then also 
have additional properties that tell the validate function how to validate it.So for example 
that we have required set to true here min length set to five to enforce five characters
and so on.It returns true if it's valid and false if it's not valid.
*/

/*
01 - I will first of all, start by defining the structure of such a validatable object.
So of this object we pass to the validate function.Because of course this always needs to have a 
similar structure with a certain amount of properties which can be there and certain types of 
properties so that the validate function actually knows what it's working with and can 
correctly extract properties and so on.So I will start by defining an interface.

Now, besides the value, they should all be optional though, which we can enforce by adding a 
question mark after the names.By the way, the alternative to using a question mark is to 
allow for undefined values.The question mark basically does the same.It says that required 
is either a boolean or undefined.
*/

interface Validatable {
    value: string | number ;
    required?: boolean;
    minLength?: number;
    maxLength?:number;
    min?: number;
    max?:number;
}


/*
02 - Well now with that interface created.We can create that function, that validate function 
I'm looking for that should get such a validatable object.So validate able input is of type 
validate.That's my idea here.So it gets an object which has this structure and now in there 
we can check for all these properties to exist and then do the appropriate validation.

I want to create a variable is valid which initially is true.So the default assumption is 
what we get is true, but we'll set it to false as soon as at least one of our checks fails.
*/

function validate(validatableInput:Validatable){
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

function autobind3(_:any, _2:string, descriptor:PropertyDescriptor){
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
    
class ProjectInput4{
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

    @autobind3
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

        /* 03 - 
        Now we just need to create objects that adhere to this interface to then send them 
        to the validate function.For that, let's go down to project input and there in 
        gathering user input, I want to construct my validator objects side node besides 
        an interface, of course we could have also created a class here.Then we could 
        instantiated with the new keyword, but also for practice and demo purposes.
        Here I want to show how this works with an interface.
        */

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
        
        /* 04 - 
        So now I want to check if at least one of them fails by checking if these are all 
        false, by adding an exclamation mark in front of it to check if this is false or 
        this is false or this is false, and if at least one of them is false.
        So if at least one of the validated function calls returns false will make it in 
        there and show the alert.
        */
        if(
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
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
    
    const prjInput4 = new ProjectInput4();
    