/*
*/

//Drag & Drop Interfaces
interface Draggable{
    dragStartHandler(event:DragEvent):void;
    dragEndHandler(event:DragEvent):void;
 }
 
 interface DragTarget{
     dragOverHandler(event:DragEvent):void;
     dropHandler(event:DragEvent):void;
     dragLeaveHandler(event:DragEvent):void;
 }
 
 //Project Type
 enum ProjectStatus7 {
     Active ,
     Finished
 }
 
 class Project8{
     constructor(
         public id:string, 
         public title:string,
         public description:string,
         public people:number, 
         public status:ProjectStatus7 
         ){}
 }
 
 type Listener7<T> = (items:T[]) => void;
 
 class State5<T> {
     protected listeners:Listener7<T>[] = [];
 
     addListener(ListenerFn: Listener7<T>){
         this.listeners.push(ListenerFn);
     }
 }
 
 // Project State Management.
 class ProjectState8 extends State5<Project8>{
     private projects: Project8[] = [];
     
    private static instance1:ProjectState8;
    private constructor(){
    super();
    }
 
    static getInstance(){
     if(this.instance1) return this.instance1;
 
     this.instance1 = new ProjectState8();
     return this.instance1;
    }
     
     addProject(title:string,description:string,numOfPeople:number){
         const newProject = new Project8(
             Math.random().toString(),
             title,
             description,
             numOfPeople,
             ProjectStatus7.Active
         );
 
         this.projects.push(newProject);
         
         for(const  listenerFn of this.listeners){
             listenerFn(this.projects.slice())
         }
     }
     
 }
 
 const projectState8 = ProjectState8.getInstance();
 
 
 interface Validatable {
     value: string | number ;
     required?: boolean;
     minLength?: number;
     maxLength?:number;
     min?: number;
     max?:number;
 }
 
 function validate7g(validatableInput:Validatable){
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
 
 function autobind11j(_:any, _2:string, descriptor:PropertyDescriptor){
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
 abstract class Component5<T extends HTMLElement,U extends HTMLElement> {
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
 class ProjectItem4 extends Component5<HTMLUListElement,HTMLLIElement> implements Draggable {
 private project: Project8;
 
 
 get persons(){
     if(this.project.people === 1) return '1 Person'; 
     else return `${this.project.people} Persons`
 }
 
 constructor(hostId:string,project: Project8){
     super('single-project',hostId,false,project.id);
     this.project = project;
 
     this.configure();
     this.renderContent();
     }
     
     @autobind11j
     dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain',this.project.id);
        event.dataTransfer!.effectAllowed = 'move'
     }
 
     @autobind11j
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
 
 /*
 Now that step number one, let's now go back to the place where we want the drop to happen, 
 which is the project list there.
 */


 //ProjectList Class
 class ProjectList9 extends Component5<HTMLDivElement,HTMLElement> implements DragTarget{
     assignedProjects:Project8[];
 
     constructor(private type: 'active' | 'finished'){
         super('project-list','app',false,`${type}-projects`)
         this.assignedProjects = [];
 
         
         this.configure();
         this.renderContent();
     }
 
     @autobind11j
     dragOverHandler(event: DragEvent){
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain')
        {
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
     }

     @autobind11j
     dropHandler(event: DragEvent){   
        console.log(event.dataTransfer!.getData('text/plain'));
     }
     @autobind11j
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
         
         projectState8.addListener((projects:Project8[])=>{
             const relevantProjects = projects.filter(prj => {
                 if(this.type === 'active')
                     return prj.status === ProjectStatus7.Active;
                 else return prj.status === ProjectStatus7.Finished;
             });
 
             this.assignedProjects = relevantProjects;
             this.renderProjects();
         });
     }
 
    private renderProjects(){
 
     const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
     listEl.innerHTML = '';
     for(const prjItem of this.assignedProjects){
         new ProjectItem4(this.element.querySelector('ul')!.id,prjItem);
     }
    }
 }
 
 
 // ProjectInput Class    
 class ProjectInput14 extends Component5<HTMLDivElement,HTMLFormElement>{
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
 
     @autobind11j
     private submitHandler(event:Event){
     event.preventDefault();
 
     const userInput = this.gatherUserInput();
     if(Array.isArray(userInput)){
         const [title, desc, people] = userInput;
        
         projectState8.addProject(title,desc,people);
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
             !validate7g(titleValidatable) ||
             !validate7g(descriptionValidatable) ||
             !validate7g(peopleValidatable)
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
     
     const prjInput14 = new ProjectInput14();
     
     const activePrjList9 = new ProjectList9('active');
     const finishedPrjList9 = new ProjectList9('finished');