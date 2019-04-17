import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin'; 

admin.initializeApp(); 

import * as express from 'express';
import * as cors from 'cors';


export const corsHandler = cors({origin: true});

export const onRequestCorsEnabledHttpsFunction = (handler: (req: express.Request, resp: express.Response) => void) =>{
    return functions.region('us-central1').https.onRequest((req, resp) => {
        corsHandler(req, resp, () => {
            handler(req,resp);
        });
    });
};



import * as Hospital from './functions/hospital/hospitals-entry';
export {Hospital};

import * as Trigger from './functions/trigger-functions/trigger-entry'; 
export {Trigger};

import * as Categories from './functions/hospital/hospital-categories'; 
export {Categories};


import * as Booking from './functions/booking/booking-entry'; 
export {Booking}; 

import * as User from './functions/user/user-entry'; 
export {User}; 