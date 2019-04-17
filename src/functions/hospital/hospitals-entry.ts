
import { onRequestCorsEnabledHttpsFunction } from '../..';
import { HttpMethodError, PropertyRequiredError, NotFoundError } from '../../errors/MyError';
import { Hospital, Category, HospitalResource, Destination } from '../../models/hospital';
import { HOSPITALS_COLLECTION, SUB_CATEGORIES_COLLECTION, HOSPITALS_RESOURCES_COLLECTION } from '../../models/databaseConstants';
import { SUCCESSFUL_CREATION } from '../../errors/ErrorCodes';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { checkIfOpen, getDistanceFromLatLonInKm, checkMacAddress } from '../../helper-functions/helper-functions';

export const _createHospitalResources =async (hospitalId) =>{

    const promises =[]; 
    const subCategoriesSnapshot = await SUB_CATEGORIES_COLLECTION.get(); 
    subCategoriesSnapshot.forEach( subCategory =>{
        let tempResource = {} as HospitalResource; 
        tempResource.available = Math.ceil(Math.random()*20); 
        tempResource.availabilityTime = Math.ceil(Math.random()*100)+5; 
        tempResource.hospitalId = hospitalId; 
        tempResource.pending = 0; 
        tempResource.subCategoryId = subCategory.id; 
        promises.push(HOSPITALS_RESOURCES_COLLECTION.add(tempResource)); 
    })

    await Promise.all(promises); 
}

export const createHospital = onRequestCorsEnabledHttpsFunction( async (req , resp)=>{
    try{
        if(req.method != "POST")
            throw new HttpMethodError("POST"); 
        
        let hospital : Hospital = req.body.hospital as Hospital; 
        if(!hospital.destination || !hospital.name || !hospital.rating)
            throw new PropertyRequiredError("des / name / rating"); 

        const snapshot = await HOSPITALS_COLLECTION.add(hospital); 
        await _createHospitalResources(snapshot.id); 
        resp.status(SUCCESSFUL_CREATION).send({message : "Success" , data : hospital}); 

    }
    catch(err){
        let errorObject; 
        errorObject = ErrorHandler.handleError(err); 
        resp.status(errorObject.code).send(errorObject); 
    }
})


export const getHospital  = onRequestCorsEnabledHttpsFunction(async (req , resp)=>{
    try{
        if(req.method !="GET")
            throw new HttpMethodError("GET"); 
        
        const hospitalId = req.query.hospitalId ; 
        if(!hospitalId)
            throw new PropertyRequiredError("Hospital Id"); 
        
        const hospitalSnapshot = await HOSPITALS_COLLECTION.doc(hospitalId).get(); 
        if(!hospitalSnapshot.exists)
            throw new NotFoundError(hospitalId , "Hospitals"); 
        resp.status(200).send({data : hospitalSnapshot.data()}); 
    }
    catch(err){
        let errorObject; 
        errorObject = ErrorHandler.handleError(err); 
        resp.status(errorObject.code).send(errorObject); 
    }
})
// Logic 
// any hospital created -> N hospital resources, N is the number of Total Sub Categories in the system.

// create a listener to listen to updates to a hospital and send it through the notifications.


export const filterByDestination = onRequestCorsEnabledHttpsFunction(async (req, resp)=>{
    // long , latidude , sub-category-id
    // post idk why xD 
    try{
        // let temp = await checkMacAddress(req.headers.authorization); 
        // if(temp){
        //     resp.status(200).send({data : temp , redirect : true})
        // }
        
        if(req.method !="POST")
            throw new HttpMethodError("POST"); 
        
        const destination : Destination = req.body.destination as Destination; 
        const subCategoryId = req.body.subCategoryId; 
        
        console.log(destination); 
        if(!subCategoryId || !destination)
            throw new PropertyRequiredError("destination/Sub Category Id");
        
        const hospitalResourcesSnapshot = await HOSPITALS_RESOURCES_COLLECTION.where("subCategoryId" , "==" , subCategoryId)
        .where("available" , ">" , 0).get(); 

        const promises = []; 

        hospitalResourcesSnapshot.forEach(resource =>{
            promises.push(HOSPITALS_COLLECTION.doc(resource.data().hospitalId).get());
        })


        console.log("getting hospital");

        const hospitalsSnapshot = await Promise.all(promises) as DocumentSnapshot[]; 
        let hospitalsArray : Hospital []  = []; 

        hospitalsSnapshot.forEach( hos =>{
            hospitalsArray.push(hos.data() as Hospital )
        })
        console.log(hospitalsArray); 
        console.log("assigning distances from destination"); 
        // hospitalsArray =  hospitalsArray.filter(hospital => 
        //     checkIfOpen(hospital.workingHours)
        // ); 

        try{
        hospitalsArray.forEach(hospital =>{
            console.log
            if(hospital.destination)
            hospital.distance = getDistanceFromLatLonInKm(destination.latitude , destination.longitude ,
                 hospital.destination.latitude , 
                hospital.destination.longitude);
            else if (!hospital.destination || hospital.destination == undefined)
                console.error(hospital); 
        }); 
        console.log("gotton hospital destinations"); 
        console.log(hospitalsArray); 
        hospitalsArray.sort(function (a, b) {
            return a.distance - b.distance;
          });
        }
        catch(err){
            console.error(err);
        }


        resp.status(200).send({data : hospitalsArray}); 
        
    }
    catch(err){
        resp.status(400).send(err); 
    }
})

export const getHospitalResources = onRequestCorsEnabledHttpsFunction(async (req , resp)=>{
    try {
        const hospitalId = req.query.hospitalId; 
        const subCategoryId = req.query.subCategoryId; 
        if(!hospitalId || !subCategoryId)
            throw new PropertyRequiredError("Hospital Id / Sub Category Id"); 
        
        const hospitalResourcesSnapshots = await HOSPITALS_RESOURCES_COLLECTION
        .where("hospitalId" , "==" , hospitalId)
        .where("subCategoryId" , "==" , subCategoryId)
        .get(); 

        const hospitalResourcesArray  : HospitalResource[]= [] as HospitalResource[]; 
        hospitalResourcesSnapshots.forEach(snap =>{
            hospitalResourcesArray.push(snap.data()  as HospitalResource)
        }); 

        resp.status(200).send({data : hospitalResourcesArray}); 
        
    } catch (err) {
        const errorObject = ErrorHandler.handleError(err); 
        resp.status(errorObject.code).send(errorObject);  
    }
})