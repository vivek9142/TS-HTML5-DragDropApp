// 2. Paste the drag drop interfaces and declare namespace here.

namespace App{
    /*
    3. Now It is not compiled to vanilla JavaScript because there is no direct equivalent 
    for it. Instead, TypeScript will basically compile it to to an object. You could say to 
    an object where the things you will put into the namespace then are stored on properties.
    But you won't have to worry about that because all the resolving of access to these 
    properties and that everything works will be taken care of by TypeScript. 
    
    4.So now we can move these interfaces into the namespace and with that we're almost done.
    */


    /*
    6.a Lot of class depend on these interfaces. So there would be a lot we have to add to 
    that namespace. Therefore what you can do is you can add the export keyword in front of 
    an interface to export a feature from a namespace.
    */
    
    //Drag & Drop Interfaces
    export interface Draggable1{
        dragStartHandler(event:DragEvent):void;
        dragEndHandler(event:DragEvent):void;
    }
    
    export interface DragTarget1{
        dragOverHandler(event:DragEvent):void;
        dropHandler(event:DragEvent):void;
        dragLeaveHandler(event:DragEvent):void;
    }

    /*
    5.However, these interfaces are now only available in this namespace. By the way, 
    you cannot just put interfaces into a namespace, you can put anything in there, classes,
    constants, whatever you want, whatever you want can be put in a namespace.
    */
}


/*
7.the question just is how do we import this namespace now back into app.TS and for that 
TypeScript has a special syntax you can use.
Let's go back to the top of app.ts
*/