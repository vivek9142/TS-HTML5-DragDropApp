

//Drag & Drop Interfaces
interface Draggable1{
    dragStartHandler(event:DragEvent):void;
    dragEndHandler(event:DragEvent):void;
 }
 
 interface DragTarget1{
     dragOverHandler(event:DragEvent):void;
     dropHandler(event:DragEvent):void;
     dragLeaveHandler(event:DragEvent):void;
 }
 
 //Project Type
 enum ProjectStatus10 {
     Active ,
     Finished
 }
 
 class Project10{
     constructor(
         public id:string, 
         public title:string,
         public description:string,
         public people:number, 
         public status:ProjectStatus10 
         ){}
 }
 
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

     /*
    02 - And with that, the goal is to really move the project now or change the project 
    status, to be precise.Now, how can we do that?Well, in our state, I would say in our 
    project state. Where we currently have a at project method.
    We also need a move project method and the goal of this method will be to basically 
    switch the status of a project.

    So instead in MOVE project, we really have to know which project you move and which box 
    the new box is.So which status the new status is.
    So I expect to get the project ID here, which should be a string.And the new status and 
    the new status here, of course, can be of type project status.And then inside of Move 
    Project. I want to find a project with that ID in my array of projects.So here in this 
    array of projects and then flip it's status.
     */

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

     /*
     03 - This will already change the object in the array and we're basically done with it.Of 
     course, however, we're not entirely done.We now need to let everyone know, all our 
     listeners, that something changed about our projects and that they should re render.
    
     So we have to go through all listeners again.And since we would repeat code here, 
     I will outsource this in a new private method.Update Listeners could be a viable name 
     and in there I'll have this for loop where we go through all listeners and do something.
     And then I will call this update listeners both from the ad project and also from the 
     MOVE Project method here.
     */
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
     /*
    02 - So of course, our goal is not to just log that idea. Instead, I want to extract 
    the project ID here in the lock in the drop handler.

    05 - We can now use the project state, call, move, project and pass in the project ID 
    and now the new project status and the new project status depends on the list on which 
    we drop this.So I want to auto bind.My drop handler so that this keyword in the drop 
    handler refers to the surrounding class.And this surrounding class is a project list 
    which, if you remember, will have a type property.Here we're storing it.
    Here we're having a type property and that is active or finished.So now we just have to 
    translate active or finished to our enum values.So here I pass in this dot type and I 
    check if it's equal to active, in which case we pass in project status dot active as 
    the new status of the project because that is the status of the list we moved the
    project to.
    */
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
     
     const prjInput16 = new ProjectInput16();
     
     const activePrjList11 = new ProjectList11('active');
     const finishedPrjList11 = new ProjectList11('finished');