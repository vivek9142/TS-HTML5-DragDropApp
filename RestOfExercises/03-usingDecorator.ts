/*
I'm talking about a decorator, which you can add, which automatically binds the this keyword 
so that we don't have to call bind here.Now, obviously, calling bind here is not a big thing 
and there's nothing wrong with it. But we also want to practice what we learned.
And if we have to do this in many, many places across our app, having a decorator which we 
just can add, might actually be easier.
*/


/*
04 - It still shows me some errors here if I expand this. As the method name is declared, but its 
value is never read in Apt's line four as referring to this year I got this argument which I 
received here which actually never use. Same is true for a target.I never use that.

Now there are two ways to solve this.

The one way is to go to the TSConfig and loosen our strictness rules here.
No unused parameters. If we set this to false, we're actually allowing unused parameters.
So this would be one thing.

Or you use special names underscore. An underscore 2 (_ , _2).This actually is a hint for 
TypeScript and JavaScript that you're aware that you're not going to use these values, 
but you need to accept them because you need argument thereafter.If you now say if this
compiles without errors and if we go back and enter hello here and submit this, it still 
works now.
*/
//02 - create autobind decorator
// function autobind(target:any, methodName:string, descriptor:PropertyDescriptor){
function autobind(_:any, _2:string, descriptor:PropertyDescriptor){
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

class ProjectInput2{
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
    //01 - remove bind FUNCTION
    this.element.addEventListener('submit',this.submitHandler);
   }
   /* 03 - use decorator
    Now we got an error with that on the submit handler.That experimental support for 
    decorators is a feature which basically needs to be enabled.So we should go to the 
    TSConfig file and in there if you scroll down, you should find that experimental
    decorators option.
    */
   @autobind
   private submitHandler(event:Event){
    event.preventDefault();
    console.log(this.titleInputElement.value);
   }
}

const prjInput2 = new ProjectInput2();
