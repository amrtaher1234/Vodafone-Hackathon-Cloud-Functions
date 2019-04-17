import { onRequestCorsEnabledHttpsFunction } from "../..";
import { Category, SubCategory } from "../../models/hospital";
import { SUB_CATEGORIES_COLLECTION, CATEGORIES_COLLECTION } from "../../models/databaseConstants";
import { ErrorHandler } from "../../errors/ErrorHandler";
import { SUCCESSFUL_CREATION, SUCCESSFUL_READING } from "../../errors/ErrorCodes";
import { PropertyRequiredError, HttpMethodError } from "../../errors/MyError";
import { checkMacAddress } from "../../helper-functions/helper-functions";

const _createSubCategories = async function(subCategories : SubCategory[] , categoryId : string){
    try{
    const promises = []; 
    subCategories.forEach(subCategory =>{
        subCategory.categoryId = categoryId; 

        promises.push(SUB_CATEGORIES_COLLECTION.add(subCategory)); 
    })

    await Promise.all(promises); 
}
catch(err){
    throw new Error("Inside function, createSubCategories"); 
}
}

export const createCategory = onRequestCorsEnabledHttpsFunction( async(req, resp)=>{
    try{
    const category = req.body.category as Category; 

    const snapshotCategory =await  CATEGORIES_COLLECTION.add(category); 
    
    const subCategories : SubCategory[] = req.body.subCategories as SubCategory[] ;

    // checks if sub categories where provided in the post given.
    if(subCategories && subCategories.length>0)
    await _createSubCategories(subCategories , snapshotCategory.id); 


    resp.status(SUCCESSFUL_CREATION).send({message : "Success"}); 
    }
    catch(err){
        const errorObject= ErrorHandler.handleError(err)
        resp.status(errorObject.code).send(errorObject); 
    }

}); 



export const addSubCategory = onRequestCorsEnabledHttpsFunction( async(req , resp) =>{

    try{
    const categoryName = req.body.categoryName; 
    const subCategories : SubCategory[]  = req.body.subCategories as SubCategory[]; 
    let CategoryId  : string; 
    // getting the category ID 
    const categorySnapshot = await CATEGORIES_COLLECTION.where("name" , "==" , categoryName).limit(1).get(); 
    categorySnapshot.forEach( cat =>{
        CategoryId = cat.id; 
    })

    const promises = []; 
    subCategories.forEach(sub =>{
        sub.categoryId = CategoryId; 
        promises.push(SUB_CATEGORIES_COLLECTION.add(sub)) ;
    })
    
    await Promise.all(promises); 

    resp.status(SUCCESSFUL_CREATION).send({message : "Success"}); 
}
    catch(err){
        const errorObject = ErrorHandler.handleError(err); 
        resp.status(errorObject.code).send(errorObject); 
    }
})


export const getCategories = onRequestCorsEnabledHttpsFunction(async (req , resp)=>{

    try{
        // let temp = await checkMacAddress(req.headers.authorization); 
        // if(temp){
        //     resp.status(200).send({data : temp , redirect : true})
        // }

        if(req.method !== "GET")
            throw new HttpMethodError('GET'); 
    const snapshot = await CATEGORIES_COLLECTION.get(); 
    
    const categoriesArray =[]
     snapshot.forEach(snap => categoriesArray.push(snap.data())); 

     resp.status(SUCCESSFUL_READING).send({data : categoriesArray}); 
    }
    catch(err){
        const errorObject = ErrorHandler.handleError(err); 
        resp.status(errorObject.code).send(errorObject); 
    }
})

export const getSubCategories = onRequestCorsEnabledHttpsFunction(async (req , resp)=>{
    try{
        
        if(req.method != "GET")
            throw new HttpMethodError("GET"); 

        const categoryId = req.query.categoryId; 
        if(!categoryId)
            throw new PropertyRequiredError("Category ID"); 
        
        const snapshot = await SUB_CATEGORIES_COLLECTION.where("categoryId" , "==" ,categoryId ).get(); 
        const subCategories = []; 
        snapshot.forEach( snap =>{
            subCategories.push(snap.data()); 
        })

        resp.status(SUCCESSFUL_READING).send({data : subCategories});
    }
    catch(err){
        const errorObject = ErrorHandler.handleError(err); 
        resp.status(errorObject.code).send(errorObject);
    }
})