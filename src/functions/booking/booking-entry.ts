
import { onRequestCorsEnabledHttpsFunction } from '../..';
import { PropertyRequiredError, HttpMethodError } from '../../errors/MyError';
import { HOSPITALS_RESOURCES_COLLECTION, BOOKINGS_COLLECTION, HOSPITALS_COLLECTION, SUB_CATEGORIES_COLLECTION, CATEGORIES_COLLECTION } from '../../models/databaseConstants';
import { HospitalResource, Hospital } from '../../models/hospital';
import { Reservation } from '../../models/booking';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { SUCCESSFUL_DELETION } from '../../errors/ErrorCodes';
import { sendPushNotification, sendPushNotificationCancel } from '../fcm/fcm';


export const bookResource = onRequestCorsEnabledHttpsFunction(async (req, resp)=>{
    try{
        // post Mac Address - Sub Category Id - Hospital Id , will get the resource from sub category and hospital ids and decrease 
        // available by 1 after checking first, then increase pending

        const subCategoryId= req.body.subCategoryId; 
        const hospitalId= req.body.hospitalId; 
        const macAddress= req.body.macAddress;
        const phone = req.body.phone;  

        if(!subCategoryId || !hospitalId || !macAddress || !phone)
            throw new PropertyRequiredError("Sub Category Id / Hospital Id / Mac Address Id / Phone"); 

        // get hospital resource deticated to the booking to update its values
         const hospitalResourceSnapshot = await HOSPITALS_RESOURCES_COLLECTION
         .where("hospitalId" , "==" , hospitalId )
         .where("subCategoryId" , "==" ,subCategoryId ).limit(1).get()




         let hospitalResource : HospitalResource; 
         hospitalResourceSnapshot.forEach(resource =>{
             hospitalResource = resource.data() as HospitalResource ; 
         }); 
         // if resources are zero return available  with false
         if(hospitalResource.available <1)
            resp.status(200).send({data : {} , available : false})
        
        // create a reservation
        const reservation = {} as Reservation; 
        reservation.createdAt = new Date(); 
        reservation.hospitalResourceId = hospitalResource.id; 
        reservation.macAddress = macAddress; 
        reservation.phone = phone;
        reservation.availabilityTime = hospitalResource.availabilityTime; 
        reservation.hospitalId = hospitalId; 
        reservation.subCategoryId= subCategoryId;
        
        // getting category Id 
        const SubCategoryId = await SUB_CATEGORIES_COLLECTION.doc(reservation.subCategoryId).get(); 

        // updating reservation object by getting the category id as well
        reservation.categoryId = SubCategoryId.data().categoryId; 

        console.log("reservation " , reservation); 

        // updating the available and pending in hospital resources
        await HOSPITALS_RESOURCES_COLLECTION.doc(hospitalResource.id).update({available : hospitalResource.available-1 
            , pending : hospitalResource.pending+1});

        // adding reservation 
        const reservationSnapshot = await BOOKINGS_COLLECTION.add(reservation);
        
        // attaching the id to send it back to the client in the response
        reservation.id = reservationSnapshot.id; 

        // getting hospital data in addition
        const hospitalData = await HOSPITALS_COLLECTION.doc(hospitalId).get(); 

        await sendPushNotification(hospitalData.id);

        resp.status(200).send({data : {reservation : reservation , hospital : hospitalData.data() as Hospital}  , available : true});
    }
    catch(err){
        let errorObject; 
        errorObject = ErrorHandler.handleError(err); 
        resp.status(errorObject.code).send(errorObject); 
    }
})

export const cancelRequiest = onRequestCorsEnabledHttpsFunction(async(req , resp)=>{
    try{
        if (req.method != "POST")
        throw new HttpMethodError("POST"); 

        const reservation : Reservation= req.body.reservation as Reservation; 
        
        const hospitalResourceSnapshot = await HOSPITALS_RESOURCES_COLLECTION.doc(reservation.hospitalResourceId).get(); 
        await HOSPITALS_RESOURCES_COLLECTION.doc(reservation.hospitalResourceId).update({
            pending : hospitalResourceSnapshot.data().pending -1,
            available : hospitalResourceSnapshot.data().available +1
        }); 
        await BOOKINGS_COLLECTION.doc(reservation.id).delete(); 

        console.log("issuing a cloud messaging push notification if admin is requesting a cancellation");
        let tempMac = reservation.macAddress;
        tempMac = tempMac.replace(/:/g, "");
        await sendPushNotificationCancel(tempMac); 

        resp.status(SUCCESSFUL_DELETION).send({data : {} , message : "success"}); 
        // if(req.headers.isAdmin){

        // }
        // else{
        //     console.log("nothing has been issued from the admin"); 
        // }
        
        // const bookingSnapshot = await BOOKINGS_COLLECTION.doc(bookingId)
    }
    catch(err){
        let errorObject; 
        errorObject = ErrorHandler.handleError(err); 
        resp.status(errorObject.code).send(errorObject); 
    }

})

export const _getCategoryAndSubCategoryObjects =async (catId , subId)=>{
    const promises = []; 
    promises.push(CATEGORIES_COLLECTION.doc(catId).get() , SUB_CATEGORIES_COLLECTION.doc(subId).get()); 

    const data = await Promise.all(promises); 
    return {
        category : data[0].data(),
        subCategory : data[1].data()
    }
}
export const getBookings = onRequestCorsEnabledHttpsFunction(async(req , resp)=>{
    try{
    const hospitalId = req.query.hospitalId; 
    if(!hospitalId)
        throw new PropertyRequiredError("Hospital Id"); 

    const bookingsSnapshots = await BOOKINGS_COLLECTION.where("hospitalId" , "==" , hospitalId).get(); 

    const bookingArray : Reservation[] = [] as Reservation[];
    const promieses = []; 

    bookingsSnapshots.forEach(book =>{
        let creationDate   = book.data().createdAt as Date; // 10:50:55 AM
        let timeToFinish = book.data().availabilityTime as number; // 400 mins
        let afterTime =new Date(creationDate.getTime() + timeToFinish*60000); 
        if(new Date() < afterTime){
            bookingArray.push(book.data() as Reservation); 
        }
    });

    bookingArray.forEach(book => promieses.push(_getCategoryAndSubCategoryObjects(book.categoryId , book.subCategoryId))); 
    const data = await Promise.all(promieses);
    for(let i =0; i<data.length; i++){
        data[i]["reservation"] = bookingArray[i]; 
    }

    resp.status(200).send({data : data}); 
}
catch(err){
    resp.status(500).send({message : "error in server"}); 
}
})