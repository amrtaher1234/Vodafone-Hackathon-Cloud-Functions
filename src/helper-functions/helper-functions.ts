import { BOOKINGS_COLLECTION } from "../models/databaseConstants";
import { Reservation } from "../models/booking";
import { readDoc } from "./helper-reading-functions";
import { HospitalResource, Hospital, Category, SubCategory } from "../models/hospital";

export const randomise = (num)=>{
    return Math.ceil(Math.random()*num); 
}

export const createCategory = function(name) : number{
    return randomise(20); 
}

export function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2 ) : number {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d ;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  export function checkIfOpen(str){
      let start = str.split('-')[0];
      let finish = str.split('-')[1];

      const currentHrs= new Date().getHours(); 

      return currentHrs>=Number(start) && currentHrs <=Number(finish) ? true : false;
      
  }
  export const getAllDataByReservationObject = async (reservation : Reservation) =>{
    let data  = {}; 
    data["reservation"] = reservation; 

    // getting hospital resources

    const hospitalResources : HospitalResource = await readDoc(reservation.hospitalResourceId , "HospitalResources") as HospitalResource; 
    // data["hospitalResources"] = hospitalResources;

   // getting hospital data

   const hospital : Hospital = await readDoc(hospitalResources.hospitalId , "Hospital") as Hospital;
//    data["hospital"] = hospital;
    data["hospitalName"] = hospital.name; 
    data["hospitalAddress"] = hospital.address; 
    data["hospitalLatitude"] = hospital.destination.latitude; 
    data["hospitalLongitude"] = hospital.destination.longitude; 
    data["hospitalPhone"] = hospital.phone; 
    data["hospitalRating"] = hospital.rating; 
    data["hospitalWorkingHours"] = hospital.workingHours;
    data["hospitalIcon"] = hospital.image;
    data["hospitalId"] = hospital.id;  

   // getting sub category 

   const subCategory : SubCategory = await readDoc(hospitalResources.subCategoryId , "SubCategories") as SubCategory; 
   data["subCategoryName"] = subCategory.name; 

   // getting Category
   const category : Category = await readDoc(subCategory.categoryId , "Category") as Category; 
   data["categoryIcon"] =category.icon; 
//    data["category"] = category; 

   return data; 
   
}
  export const checkMacAddress =async function(macAddress){
    const bookings =await BOOKINGS_COLLECTION.where("macAddress" , "==" , macAddress).limit(1).get()
    if(bookings.empty){
        return false; 
    }
    else{
        let toReturn : any = false; 
        let creationDate : Date = null; 
        let timeToFinish  : number= null ; 
        bookings.forEach( book =>{
            console.log(book.data()); 
            creationDate   = book.data().createdAt as Date; // 10:50:55 AM
            timeToFinish = book.data().availabilityTime as number; // 400 mins
            console.log(creationDate , timeToFinish); 
            
            let afterTime =new Date(creationDate.getTime() + timeToFinish*60000); 
            console.log(afterTime , new Date()); 

            if(new Date() < afterTime){
                console.log("before reutining book data"); 
                // toReturn =book.data(); 
                toReturn =getAllDataByReservationObject(book.data() as Reservation); 
            }
            else
            toReturn = false; 
        })
        return toReturn; 
    }
    
  }



  