export interface Reservation{
    macAddress : string , 
    phone : string, 
    hospitalResourceId : string, 
    createdAt : Date, 
    availabilityTime? : number, 
    id? : string,
    hospitalId? : string,
    subCategoryId? : string, 
    categoryId? : string,
}