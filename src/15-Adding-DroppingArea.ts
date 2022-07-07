/*
Visually we are able to drag and drop.

But technically in JavaScript, of course, our script has no idea of what's happening to us humans.

Of course it's clear that we're dragging this exact item here, but if we have a look at our code,

how would JavaScript know what's getting dragged?

Where?

How would we update our state?

Based on the information we have right now, it wouldn't really be possible.

So to make that work in JavaScript, we have to go back to the class of our drag item, the project
item there in the drag start handler logging the event to the console isn't everything we should do.
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
 
 /*
 01 - we have to go back to the class of our drag item, the project item there in the drag 
 start handler logging the event to the console isn't everything we should do.Actually, we 
 don't need to do that at all.Instead, let's now use our event object here because that has 
 a data transfer property.This is special for drag events.They do have such a data transfer 
 property and on that property you can attach data to the drag event and you'll later be 
 able to extract that data upon a drop.And the browser and JavaScript behind the scenes will 
 store that data during the drag operation and ensure that the data you get when the drop 
 happens is the same data you attach here.
 
 For that, you can call set data on data transfer, but data transfer could actually be null.
 So we have to add an exclamation mark here.
 */
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
        /*
        02 - The first argument is an identifier of the format of the data, and there you got 
        certain possible formats available attached.it actually suffices to attach the idea of 
        the project because this will later allow us to fetch that project from our state.
        So attaching the IDs, all we need to do, we want to transfer only a small amount of data.
        */
        
        event.dataTransfer!.setData('text/plain',this.project.id);
        
        /* 03 - 
        This basically controls how the cursor will look like and tells the browser a little bit 
        about our intention that we plan to move an element from A to B and alternative 
        could be copy where you then get a different cursor, which indicates to the user 
        that you're copying and not moving.But here I really want to move the element, which 
        means upon a drop we remove it on its original place and add it to the new place.
        */
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
        /*
        04 - in the drag over handler which fires when you enter a drag area with an item 
        attached to the mouse.I want to check if a drag really is allowed here.
        For that, I will check if.Event data transfer is available as well.That simply means 
        is the data attached to our drag event is that.
        Of that format, which it, of course is because it is the format we set up in the 
        drag start handler here.
        */
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain')
        {
            /*
            05 - You have to call event prevent default. Now, why do we have to call that?
            Because in JavaScript, drag and drop it works such that a drop is actually only 
            allowed.So the drop event will only trigger on an element if in the drag over 
            handler on that same element you called prevent default.

            The default for JavaScript drag and drop events is to not allow dropping, so you 
            have to prevent default in the drag over handler.To tell JavaScript and to 
            browser that for this element, in this case, for this section, for this
            project list class, you want to allow a drop.
            */
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
     }

     /*
     06 - So with that the drop handler will then eventually execute of course because now we are 
     allowing this to happen.

     Actually, at the point of time we are dropping this, we will be able to extract data 
     from data transfer.And I can prove this to you. Of course, we can simply access data 
     transfer.And there you have a get data method and now we want to get the data with this 
     text plain format. And that should be the project ID we attached to our data transfer 
     package on the project item.
     */
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