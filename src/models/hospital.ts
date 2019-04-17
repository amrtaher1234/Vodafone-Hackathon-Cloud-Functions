export interface Hospital{
    id? : string, 
    name : string, 
    phone : string, 
    workingHours : string, 
    destination :  Destination, 
    rating : number,
    image? : string,
    address : string,

    distance? : number
} 

export interface Destination{
    longitude : number, 
    latitude : number, 
}

export interface Category{
    id? : string, 
    name : string, 
    icon? : string, 
}
export interface SubCategory{
    categoryId? : string
    id? : string, 
    icon? : string, 
    name : string, 
}

export interface HospitalResource {
    id? : string, // remove it for now. 
    hospitalId : string, 
    subCategoryId : string, 
    available : number , 
    pending : number, 
    availabilityTime? : number,
}

