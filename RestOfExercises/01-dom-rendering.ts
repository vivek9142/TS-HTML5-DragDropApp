/*
now there are many ways I will actually write this application in an object oriented 
approach, which is 100% optional.But since we learned about classes and so on, 
I want to actually show how this works.

Goal - 
So in the app I'll add a new class and I'll name it project input though.
The class name of course, is entirely up to you.Now in this class, our goal has to be 
to get access to this template and to the form in it and to get access to this diff here 
and then render our template in that div in the end.So the content of the template, the form 
in that div, that has to be our goal.
*/

class ProjectInput{
    /*
    02- here I also want to be clear about the type which all will be stored in there and 
    that will be an HTML template element.This type is globally available because in the 
    conflict JS file, I added the DOM as a lib and that adds all these DOM types, all these 
    HTML element types as typescript types to the entire project.
    */
    templateElement: HTMLTemplateElement;
    /*
    05 - We know that the host element where we actually want to render our project input 
    will in the end be this Dave here.That's where I want to render my form.So here we can 
    say HTML div element.That's the type of element we're going to add this to.
    
    We could also be a bit less specific and just say HTML element because here I really 
    don't care whether it's a DIV or not, but since we know it with certainty, why not add 
    it? Now I want to get access to that div of course, where this should be added.
    */
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    constructor(){
    /*
    01 - Now a couple of important things here we get an error. That template element is a 
    property which does not exist on project input.Now to get rid of this, we actually 
    should add it as a new field here directly in the class and then
    we can safely assign to it.

    03 - Now this introduces a new error here, however.You see that in the end this could be 
    null.When we get the element by ID.Of course we know that it won't fail.But TypeScript 
    has no chance of knowing this because it's not going to analyze our HTML file. So maybe 
    no element with this ID exists and therefore this would yield null.Now here we say we 
    don't store null in there we just store a HTML template element.So to eliminate this 
    danger, we have to tell TypeScript that this will never be null.

    04 - we still have another error though. Property content is missing in type html element.
    The problem here is that we're telling TypeScript that we're going to store a template 
    element which is of type  HTML template element and indeed that will be the case.
    Now of course, get element by ID doesn't know which element it will return eventually.
    It just knows it will be some HTML element, but not which specialized version of it.
    If it's a div, a paragraph, a button, or like in this case a template element, get 
    element by ID as no chance of knowing that.
    So in order to tell TypeScript about the type which we of course also know with 
    certainty, we can use type casting, you'll learn about this as well.
    
    There are two syntax.
    You can use the angle brackets at the beginning and then the type you want to cast this 
    to with that.You were telling TypeScript, hey, the thing, the expression coming after 
    this here, this will be of that type.
    
    Or alternatively 
    you add as a HTML template element, which is the approach I will use.And with that you 
    guarantee to typescript that what you fetch here will not be null and will be of this
    type.
    */
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
 
        /*
        06 - We have access to these elements, but we're not rendering anything there.
        So let's continue with that.For that, we need to import the content of this 
        template element.So basically import what's inside the template tags and render 
        this to the DOM.We can do this right here in the constructor, because my idea and 
        of course, that's just my idea,my idea is that when we create a new instance of 
        this class, I immediately want to render a form that belongs to this instance.
        So I will do it right in the constructor.    

        07 - document.importNode is a method provided on the global document object.
        And to import node, you pass a pointer at your template element.So this template 
        element in the end, or to be precise not the element but dot content, there content 
        is a property that exists on HTML template elements and it simply gives a reference 
        to the content of a template.

        So to the HTML code between the template tags import node also takes a second 
        argument which defines whether it should import this with a deep clone or not.
        So all levels of nesting inside of the template and I definitely want to do that.
        So I will provide true here.Now we have the imported node and as you see this is 
        of type document fragment which TypeScript assumed or inferred automatically.
        */
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.attach();
    }

    /*
    08 - we can use that imported node and of course I want to use it to render some content.
    For that I will add a new method, a private method, which I'll name attach.
    */
    private attach(){
        /*
        I will reach out to the host element. So the place where I do want to render my 
        content and call insert adjacent element, which is a default method provided by the 
        browser. In the end in JavaScript to insert the HTML element and insert adjacent 
        element, first of all, takes a description of where to insert it.
        So there you can insert it after the beginning of the element,after the opening tag 
        of host element before the beginning,before the opening tag, 
        before the end tag or after the tag.
        And here I will go for after begin to insert it right at the beginning of the 
        opening tag.And then the thing I want to insert is my important note, however.
        First of all, that's a constant only available in a constructor.And second, that's a 
        document fragment. We couldn't insert it like this.

        Instead, we need to get access to the concrete HTML element in there, which we can 
        store in another property element, which we also have to add as a field up there, 
        which can be of type a HTML element or in our case, actually, we know it will be 
        inside of the template here.So it will be a form that's the first element in that 
        template.
        */
        this.hostElement.insertAdjacentElement('afterbegin',this.element);
    }
}

/*
So that now is the project input class.And theoretically when we instantiate it, it should 
render the form.Now let's give it a try below the class.
*/
const prjInput = new ProjectInput();
/*
And if we now save that, it should recompile and reload.And if you go back to the browser, 
indeed you should see that form here.This form is coming from the index HTML file and 
it's rendered with the help of our object oriented typescript code up there.
*/