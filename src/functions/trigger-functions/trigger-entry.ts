// trigger for creating hospital 


import * as functions from 'firebase-functions'; 
import { HOSPITALS_COLLECTION, CATEGORIES_COLLECTION, SUB_CATEGORIES_COLLECTION, HOSPITALS_RESOURCES_COLLECTION, BOOKINGS_COLLECTION } from '../../models/databaseConstants';


export const Hospitals = functions.region("europe-west1").firestore.document("Hospitals/{id}").onCreate((snap , context)=>{
    return HOSPITALS_COLLECTION.doc(snap.id).update({
        id : snap.id
    })
})
export const Categories = functions.region("europe-west1").firestore.document("Categories/{id}").onCreate((snap , context)=>{
    return CATEGORIES_COLLECTION.doc(snap.id).update({
        id : snap.id
    })
})
export const SubCategories = functions.region("europe-west1").firestore.document("SubCategories/{id}").onCreate((snap , context)=>{
    return SUB_CATEGORIES_COLLECTION.doc(snap.id).update({
        id : snap.id
    })
})
export const HospitalResources = functions.region("europe-west1").firestore.document("HospitalResources/{id}").onCreate((snap , context)=>{
    return HOSPITALS_RESOURCES_COLLECTION.doc(snap.id).update({
        id : snap.id
    })
})

export const Bookings = functions.region("europe-west1").firestore.document("Bookings/{id}").onCreate((snap , context)=>{
    return BOOKINGS_COLLECTION.doc(snap.id).update({
        id : snap.id
    })
})
