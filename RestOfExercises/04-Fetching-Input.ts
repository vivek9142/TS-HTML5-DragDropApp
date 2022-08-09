/*
So we're able to gather our title input value and print it to the console.But of course, 
that's not ultimately the idea.Instead, the idea is that we gather all our input values, 
quickly validate them, and then do something with them.
*/

function autobind2(_:any, _2:string, descriptor:PropertyDescriptor){
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
    
class ProjectInput3{
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

    @autobind2
    private submitHandler(event:Event){
    event.preventDefault();
    // console.log(this.titleInputElement.value);
    // 04 - take input from gatherUserInput
    /*
    So now we have gathered user input and user input therefore also is either undefined in 
    the end or it is that tuple.So now before we move on and improve validation, 
    let's build up on that user input.When we gather the user input down there, we now 
    have that user input thing and now we can check if it is a tuple.Now the problem is at 
    runtime we have no way of checking whether it is a tuple.There is no instance of we 
    could use, there is no tuple type we could check.

    So during runtime all we need to check here is whether it's an array and for that we can 
    use the array  object in JavaScript and there it isArray method.
    */
    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
        const [title, desc, people] = userInput;
        console.log(title,desc,people);
        //06 - clear inputs
        this.clearInputs();
        }
    }
    /*
    01 - I'll add yet another new method, another private method, because I'm only going to 
    call it from inside the class. And that's the gather User input method name.My idea is 
    that this method gets called here after we prevent the default.

    This should basically reach out to all our inputs here, gather the user input there, 
    validate it,and then return it so that here I got my user input, which could be a tuple 
    with the title, the description and the people as the three tuple values.
    
    The return type is a tuple now.Do you remember how our tuple is defined?
    It's not string square brackets. That means you're returning an array of strings.
    Instead, I want to say that I return an array of exactly x elements of exactly these three 
    types.
    */

    private gatherUserInput():[string,string,number] | void{
        /*03 - 
        Alternatively, we could throw an error.Then we would actually not return 
        anything.But we'll throw an error in that case.Now, I don't want to throw an error 
        here because I don't really want to implement error handling.So what I'll do is I'll 
        just add a return statement, but of course this is not a tuple.So actually the 
        return type up here is a tuple or it's actually undefined 
        Now However, as you learned, you shouldn't use undefined here as a return type on 
        functions instead use VOID.
        
        It's almost the same but exclusive to functions.And this 
        tells TypeScript that this is a function which has at least a branch which does not 
        return any value like this one does.Here we also, of course, use a union type 
        because we have both possibilities.We might return nothing or we actually return 
        a tuple.
        */
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        if(
            enteredTitle.trim().length === 0 ||
            enteredDescription.trim().length === 0 ||
            enteredPeople.trim().length === 0
        ){
            alert('Invalid input, Please try again!');
            return;
        } else {
            /*
            02 - As you can tell, though, TypeScript is not happy because entered people 
            should be a number, not text and actually everything you extract from the value 
            property of a input element will be taxed by default.So to turn this into a 
            number, we can call, parse, float, for example, or simply add a plus in front 
            of it and this will convert it to a number.
            */
            return [enteredTitle,enteredDescription,+enteredPeople]
        }
    }

    /*
    05 - 
    I want to clear all the inputs after we click Add project.So I want to empty all the 
    inputs again.Now for that, we can add a new private method, clear input or a clear 
    inputs, and there we can set this title input element whoops dot value equal to an 
    empty string.And repeat that for the other inputs as well.
    */

    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
}
    
    const prjInput3 = new ProjectInput3();
    