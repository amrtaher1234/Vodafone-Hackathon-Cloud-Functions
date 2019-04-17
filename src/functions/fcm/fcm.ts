import * as admin from 'firebase-admin'

export const sendPushNotification =async function(topic){
    console.log("Making a notification to " + topic); 
    await admin.messaging().sendToTopic(topic , {data : {
        message : "data updated" , 
        update :'true',
    } , notification : {body : "A new reservation has been issued" , title : "New Reservation"} })
}


export const sendPushNotificationCancel =async function(topic){
    console.log("Registeration cancelled  " + topic); 
    await admin.messaging().sendToTopic(topic.replace(':' , '') , {data : {
        message : "Reservation cancelled" , 
        update :'true',
    } , notification : {body : "Reservation has been cancelled " , title : "Reservation Cancel"} })
}
