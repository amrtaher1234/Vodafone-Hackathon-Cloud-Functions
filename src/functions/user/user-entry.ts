import { onRequestCorsEnabledHttpsFunction } from "../..";
import { checkMacAddress } from "../../helper-functions/helper-functions";
import { ErrorHandler } from "../../errors/ErrorHandler";
import { AdminUser } from "../../models/user";
import * as admin from 'firebase-admin'; 
import { USERS_COLLECTION, ADMIN_USERS_COLLECTION, HOSPITALS_COLLECTION, HOSPITALS_RESOURCES_COLLECTION } from "../../models/databaseConstants";
import { PropertyRequiredError } from "../../errors/MyError";

// export const onNewAdmin = functions.auth.user().onCreate(async (user) => {
//     const adminUser = {} as AdminUser; 
//     adminUser.email = user.email; 
//     adminUser
// });

export const createAdmin = onRequestCorsEnabledHttpsFunction(async(req , resp)=>{
    try {
        const email  = req.body.email;
        const password  = req.body.password;
        const phone  = req.body.phone;
        const hospitalId  = req.body.hospitalId;
    
        const user = await admin.auth().createUser({email : email , password : password , phoneNumber : phone , disabled : false , emailVerified : false}); 
        
        const adminUser= {} as AdminUser; 
        adminUser.email = email;
        adminUser.hospitalId = hospitalId;
        adminUser.id = user.uid;
        adminUser.phone = phone;
    
        await ADMIN_USERS_COLLECTION.doc(adminUser.id).set(adminUser);
    
        resp.status(200).send({data : {} , message : "successful user creatuin"});  
    } catch (error) {
        resp.status(500).send({message : error})
    }
    

})
export const checkBooking = onRequestCorsEnabledHttpsFunction(async(req, resp)=>{
        try{
        let temp = await checkMacAddress(req.headers.authorization); 
        if(temp)
            resp.status(200).send({data : temp , redirect : true})
        
        else
            resp.status(200).send({data : {} , redirect : false}); 
        }
        catch(err){
            const errorObject = ErrorHandler.handleError(err); 
            resp.status(errorObject.code).send(errorObject);
        }
})  

export const getHospitalDataToAdmin = onRequestCorsEnabledHttpsFunction(async (req , resp)=>{
    try{
    const userId = req.query.userId ; 

    const userSnapshot = await ADMIN_USERS_COLLECTION.doc(userId).get(); 

    const hospitalSnapshot = await HOSPITALS_COLLECTION.doc(userSnapshot.data().hospitalId).get(); 

    resp.status(200).send({data : hospitalSnapshot.data()}); 
    }
    catch(err){
        resp.status(500).send({message : err})
    }
})

export const updateHospitalResources = onRequestCorsEnabledHttpsFunction(async(req , resp)=>{
    try{
    const hospitalResourceId = req.body.hospitalResourceId; 
    const available = req.body.available; 
    const availabilityTime = req.body.availabilityTime;

    if(!hospitalResourceId || !available || !availabilityTime)
        throw new PropertyRequiredError("Hospital resource Id / Available / Availability time"); 
    
    const newHospitalResource = await HOSPITALS_RESOURCES_COLLECTION.doc(hospitalResourceId).update({availabilityTime : availabilityTime , available : available}); 
    resp.status(200).send({data : {} , message : "successful update"}); 
    }
    catch(err){
        resp.status(500).send({message : err})
    }
})