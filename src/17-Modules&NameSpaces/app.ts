/// <reference path="drag-drop-interfaces.ts" />
/// <reference path="project-model.ts" />
//12. import project model.ts file

/* We'll implement namespaces feature for dividing and managing the codespace.
   This feature is created for TypeScript only.

   1. we'll cut and past the drag and drop interfaces to another file drag-drop-interfaces

   8.Let's go back to the top of apts and now here you add three forward slashes important 
   free not just to you because this is actually not a normal comment what we're creating 
   now. This will actually be syntax picked up by TypeScript.

    A special comment you could say TypeScript understands if it starts with three slashes 
    there, you write a self closing XML tag, so opening angle bracket, then forward slash 
    closing angle bracket and in there reference path equals. And then here the name of 
    the file you want to import. In my case here drag. Drop interfaces dots.

    Now this is understood and picked up by TypeScript because as I mentioned with the 
    free starting slashes is a special syntax. TypeScript understands just as it 
    understands this reference thing.
*/


    /*
    9. However, if you scroll down you'll see my editor still complains and if we try to 
    save this, we also get compilation errors so it doesn't seem to be available. The 
    Dragonball interface doesn't seem to be available here. Well, there is a special 
    thing about namespaces. You can use them to split your code.

    And remember when I said earlier that what you have in the namespace can be used from 
    anywhere in that namespace? Well, it turns out you can split namespaces across multiple 
    files by exporting things in a namespace and then using this special import syntax.

    But you then have to put the things that want to use something from that imported 
    namespace or from that imported file into the same namespace. Hence maybe dead 
    interfaces is not the best name. Maybe we just name this app.

    Now, if we name this app here, we can go to APTs and create a namespace of the same 
    name here namespace app. And now for a moment let's put everything here into that 
    namespace and now you see the error is gone. There are no red dots on the right.

    However, if I save that, I still get errors here.
    The question just is, what's the result of this compilation? Do we have one or two files 
    now? Well, let's have a look at the dist folder and there you see you've got an app JS 
    file and then some code here and a drag and drop interface JS file.

    So we got two files as a result. Now the drag and drop interface file actually is 
    pretty empty because you learned that interfaces are basically not compiled to anything.

    There is no JavaScript equivalent for an interface. It's a pure TypeScript feature, 
    so we can import it with the TypeScript syntax here to use it and get all the type 
    improvements we learned. But in production, it doesn't matter if it's in a 
    separate file or not.
    */

    /*
    13. The question is, does our application now work for that? Let's try adding a project 
    here.And you see, we get an error category property active of undefined. The reason for 
    that simply is that our files are compiled.Stand alone.Namespaces exist in TypeScript 
    world.

    As I said, there is no JavaScript equivalence for it. So the problem we have here is 
    that in TypeScript the world, everything is great because TypeScript is able to find 
    all the things we need.

    For example, when I say project here, when I reference the project, type here on the 
    project state class, this project type, this project class is defined in the project 
    model. Now TypeScript does not complain during compilation because we import that model, 
    but import here really just means we tell TypeScript where to find that type. Once it is 
    compiled to JavaScript, this connection is basically destroyed.
    
    So in JavaScript code, when this executes and when we then try to create a new project 
    by instantiating project, JavaScript doesn't find this project class or constructor 
    function, so we have to make sure we carry over this connection and for that we can go 
    to the config and they are set this out file option, we can comment this in and the idea 
    behind the old file is that you tell TypeScript that it should concatenate namespaces.
    So these references which it has during compilation into one single JavaScript file 
    instead of compiling multiple JavaScript files.

    So here for our file we can say we want to have a file in the dist folder which we name 
    may be bundledjs.And if we do that and save that, we'll actually get an error here.
    That only AMD and system modules are supported alongside outfall.

    There basically are different ways of loading or of bundling different JavaScript files 
    into one for historic reasons and how it is all developed.So basically what we need to 
    do here is we need to set module which is already highlighted as an error here, not 
    to common JS but to AMD for example.If we do that, it compiles without issues, 
    even though it still complains here.But it didn't pick up that I changed it.

    you see only that bundled js file is generated.This file will hold all our code in 
    the compiled and translated version and therefore now in indexed HTML, we just have 
    to import bundle js here instead of app js.
    */
 
 namespace App{
    //10. copy n paste the project enum n class paste in projectmodel.ts
 
 type Listener9<T> = (items:T[]) => void;
 
 class State7<T> {
     protected listeners:Listener9<T>[] = [];
 
     addListener(ListenerFn: Listener9<T>){
         this.listeners.push(ListenerFn);
     }
 }
 
 // Project State Management.
 class ProjectState10 extends State7<Project10>{
     private projects: Project10[] = [];
     
    private static instance1:ProjectState10;
    private constructor(){
    super();
    }
 
    static getInstance(){
     if(this.instance1) return this.instance1;
 
     this.instance1 = new ProjectState10();
     return this.instance1;
    }
     
     addProject(title:string,description:string,numOfPeople:number){
         const newProject = new Project10(
             Math.random().toString(),
             title,
             description,
             numOfPeople,
             ProjectStatus10.Active
         );
 
         this.projects.push(newProject);
         this.updateListeners();
     }

    moveProject(projectId:string,newStatus: ProjectStatus10){
        const project = this.projects.find(prj => prj.id === projectId);
        
        //06 - we can check for state change if not changed then no updating the DOM
        // if(project)
        if(project && project.status !== newStatus)
        {
            project.status = newStatus;
            //04 - here only if we change anything we'll update the listeners.
            this.updateListeners();
        }
     }

    private updateListeners(){
        for(const  listenerFn of this.listeners){
            listenerFn(this.projects.slice())
        }
    }
     
 }
 
 const projectState10 = ProjectState10.getInstance();
 
 
 interface Validatable {
     value: string | number ;
     required?: boolean;
     minLength?: number;
     maxLength?:number;
     min?: number;
     max?:number;
 }
 
 function validate9g(validatableInput:Validatable){
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
 
 function autobind13j(_:any, _2:string, descriptor:PropertyDescriptor){
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
 abstract class Component7<T extends HTMLElement,U extends HTMLElement> {
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
 
 //ProjectItem Class
 class ProjectItem6 extends Component7<HTMLUListElement,HTMLLIElement> implements Draggable1 {
 private project: Project10;
 
 
 get persons(){
     if(this.project.people === 1) return '1 Person'; 
     else return `${this.project.people} Persons`
 }
 
 constructor(hostId:string,project: Project10){
     super('single-project',hostId,false,project.id);
     this.project = project;
 
     this.configure();
     this.renderContent();
     }
     
     @autobind13j
     dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain',this.project.id);
        event.dataTransfer!.effectAllowed = 'move'
     }
 
     @autobind13j
     dragEndHandler(_: DragEvent): void {
         console.log('dragend')
     }
 
     configure(){
         this.element.addEventListener('dragstart',this.dragStartHandler);
         this.element.addEventListener('dragend',this.dragEndHandler);
     }
 
     renderContent(): void {
         this.element.querySelector('h2')!.textContent = this.project.title;
         this.element.querySelector('h3')!.textContent = this.persons + ' Assigned';
         this.element.querySelector('p')!.textContent = this.project.description;
     }
 }



 //ProjectList Class
 class ProjectList11 extends Component7<HTMLDivElement,HTMLElement> implements DragTarget1{
     assignedProjects:Project10[];
 
     constructor(private type: 'active' | 'finished'){
         super('project-list','app',false,`${type}-projects`)
         this.assignedProjects = [];
 
         
         this.configure();
         this.renderContent();
     }
 
     @autobind13j
     dragOverHandler(event: DragEvent){
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain')
        {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
     }
    
     @autobind13j
     dropHandler(event: DragEvent){   
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState10.moveProject(prjId,
            this.type === 'active' ? ProjectStatus10.Active : ProjectStatus10.Finished);
     }
     @autobind13j
     dragLeaveHandler(_: unknown){
         const listEl = this.element.querySelector('ul')!;
         listEl.classList.remove('droppable');
     }
 
     renderContent(){
         const listId = `${this.type}-projects-list`;
         this.element.querySelector('ul')!.id = listId;
         this.element.querySelector('h2')!.textContent = 
             this.type.toUpperCase() + ' PROJECTS';
     }
 
     configure(): void {
         this.element.addEventListener('dragover',this.dragOverHandler);
         this.element.addEventListener('dragleave',this.dragLeaveHandler);
         this.element.addEventListener('drop',this.dropHandler);
         
         projectState10.addListener((projects:Project10[])=>{
             const relevantProjects = projects.filter(prj => {
                 if(this.type === 'active')
                     return prj.status === ProjectStatus10.Active;
                 else return prj.status === ProjectStatus10.Finished;
             });
 
             this.assignedProjects = relevantProjects;
             this.renderProjects();
         });
     }
 
    private renderProjects(){
 
     const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
     listEl.innerHTML = '';
     for(const prjItem of this.assignedProjects){
         new ProjectItem6(this.element.querySelector('ul')!.id,prjItem);
     }
    }
 }
 
 
 // ProjectInput Class    
 class ProjectInput16 extends Component7<HTMLDivElement,HTMLFormElement>{
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
 
     @autobind13j
     private submitHandler(event:Event){
     event.preventDefault();
 
     const userInput = this.gatherUserInput();
     if(Array.isArray(userInput)){
         const [title, desc, people] = userInput;
        
         projectState10.addProject(title,desc,people);
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
             !validate9g(titleValidatable) ||
             !validate9g(descriptionValidatable) ||
             !validate9g(peopleValidatable)
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
     
     new ProjectInput16();
     new ProjectList11('active');
     new ProjectList11('finished');
}