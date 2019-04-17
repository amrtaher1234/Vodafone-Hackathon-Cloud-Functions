import { HOSPITALS_COLLECTION, CATEGORIES_COLLECTION, SUB_CATEGORIES_COLLECTION, HOSPITALS_RESOURCES_COLLECTION, BOOKINGS_COLLECTION } from "../models/databaseConstants";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";


export const readHospital  =async (id)=>{
    
    const hospitalSnapshot = await HOSPITALS_COLLECTION.doc(id).get(); 

    return hospitalSnapshot.data(); 
}

export const readDoc = async(id , name)=>{
    let snapshot : DocumentSnapshot = null ; 
    if(name == "Hospital" || name == "Hospitals"){
        snapshot = await HOSPITALS_COLLECTION.doc(id).get(); 
    }
    if(name == "Category" || name == "Categories"){
        snapshot = await CATEGORIES_COLLECTION.doc(id).get(); 
    }
    
    if(name == "subCategories" || name == "SubCategories" || name  == "subCategory" || name == "SubCategory"){
        snapshot = await SUB_CATEGORIES_COLLECTION.doc(id).get(); 
    }
    
    if(name == "HospitalResources" || name == "hospitalResources"){
        snapshot = await HOSPITALS_RESOURCES_COLLECTION.doc(id).get(); 
    }
    if(name == "Booking" || name == "Bookings"){
        snapshot = await BOOKINGS_COLLECTION.doc(id).get(); 
    }

    return snapshot.data(); 

}