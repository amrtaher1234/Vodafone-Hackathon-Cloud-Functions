import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin'; 

export const HOSPITALS_COLLECTION = admin.firestore().collection("Hospitals"); 
export const USERS_COLLECTION = admin.firestore().collection("Users"); 
export const CATEGORIES_COLLECTION = admin.firestore().collection("Categories"); 
export const SUB_CATEGORIES_COLLECTION = admin.firestore().collection("SubCategories"); 
export const HOSPITALS_RESOURCES_COLLECTION = admin.firestore().collection("HospitalResources"); 
export const BOOKINGS_COLLECTION = admin.firestore().collection("Bookings"); 

export const ADMIN_USERS_COLLECTION = admin.firestore().collection("AdminUsers"); 