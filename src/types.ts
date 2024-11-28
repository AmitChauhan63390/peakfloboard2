
export type Id = string|number
export type Column = {
    id:Id;
    title:string;
}

export type Tasks = {
    id:Id;
    columnId:Id;
    title:string;
    description:string;
    status:string;

}