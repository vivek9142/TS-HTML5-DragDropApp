/*
11.Now just as before, we can add a namespace here. The name has to be app, so it has to be 
the namespace where we then also want to use it. And we have to export these features 
in there so that we can use them in other files in the same namespace, but in other 
files as well.
*/
namespace App{
    //Project Type
export enum ProjectStatus10 {
    Active ,
    Finished
}

export class Project10{
    constructor(
        public id:string, 
        public title:string,
        public description:string,
        public people:number, 
        public status:ProjectStatus10 
        ){}
    }
}