/*
So we rendered our first forum.
Since we have a form here, I want to get access to the different form inputs we have here 
so that we can read the values when the form gets submitted, and that we also then set up 
our event listener here to the submission and validate the user inputs.

02 - So we need access to the button or to the form overall to listen for the submission and to 
all the input elements to get the latest values from there.For that here before we attach 
everything.But after I assigned my ID to the element here, I want to get access to the 
different inputs in that element in that form, and I want to store them as properties of 
this class.
*/

class ProjectInput1{
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    /*03 - 
    So add more fields up there and the first field could be a title input element field.
    The type will be a HTML input element like this. And we're not just needed once we need 
    to ever similar fields, we need a description input element field which is of type HTML 
    input element. And we also need a people input element field.
    */
    titleInputElement: HTMLInputElement;
    descriptionInputElement:HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        /*01- 
        When we create our element here or when we get access to it, we can reach out to the 
        element and add an idea here which should be user-input. This will make sure that the 
        rendered element has does ID and hence if this reloads, this looks much nicer.
        */
        this.element.id = 'user-input';

        /* 04 - 
        Now we can populate these fields here in the constructor with this. Title input 
        element, which I said equal to this element. So to our form element always keep in 
        mind that's the form element here. Query selector and then query for the title 
        element.
        */
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        /* 07 - 
        Now we just need to make sure that before we attach, I also call configure and 
        execute this private method.Again, it's private.So from inside the class we can of 
        course reach it.
        */
        this.configure();
        this.attach();
    }
    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }

    /* 05 - 
    Now we just need to add a listener to our element, to our form. For that, I'll add 
    another private method configure.But again, I want to keep that separation where we 
    basically do the selection and rough setup in the constructor and then the insertion or 
    the fine tuning in separate methods.And in the configure method, my idea is to set up an 
    event listener.So here we can reach out to this element which is the form and add an 
    event listener.
    */
   private configure(){
    // here we can point the callback fn to submitHandler
    // 09- bind the function to class
    this.element.addEventListener('submit',this.submitHandler.bind(this));
   }

   /* 06 - 
   Now we just need to bind this to a method and for that I'll add another private method.
   Private, because I'm never going to access this from outside of the class, only from 
   inside which I'll name, submithandler.This should be a method which receives an event 
   object though, because we'll bind it to this event listener.
   */
   private submitHandler(event:Event){
    event.preventDefault();
    console.log(this.titleInputElement.value); // gives error
    
    /* 08 - 
    The problem here is that this here the this keyword in submit handler does not point at 
    the class actually.Why?
    Well, because of the way JavaScript and TypeScript works, we bind the method here to the 
    event listener.And when we bind something to an event, or with the help of an event 
    listener, then that's something.So that method which is going to get executed, will 
    have this bound to something else in this case to the current target of the event.

    So this ends of this method will not point at the class when the method is triggered upon 
    an event with an event listener.Now the workaround or the solution is to actually call 
    bind here on submit handler to pre configure how this function is going to execute when 
    it executes in the future. And the first argument we can pass to bind then is actually 
    what the this keyword will refer to inside of the to be executed function.
    */
   }
}

const prjInput1 = new ProjectInput1();
