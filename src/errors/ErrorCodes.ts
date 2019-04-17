// THESE ARE THE BASIC CODES WE WILL USE AS A START 

// 201 - Created // when a database doc is created
// 204 - Updated 
// 202 - Deleted 
// 205 - This will be used when an http request contains various updates/deletes/creations, it refers to a mixed operation that all were successful
// 304 - Not Modified
// 400 - Bad Request // for propertyerrors like if a field is missing or a parameter is wrong in formation
// 401 - Unauthorized // for admins when signing in or requesting a feature that is not authorized
// 403 - Forbidden 


// 1xx (Informational): The request was received, continuing process
// 2xx (Successful): The request was successfully received, understood, and accepted
// 3xx (Redirection): Further action needs to be taken in order to complete the request
// 4xx (Client Error): The request contains bad syntax or cannot be fulfilled
// 5xx (Server Error): The server failed to fulfill an apparently valid request
// ERROR CODES ARE HERE
const SUCCESSFUL_CREATION = 201;
const SUCCESSFUL_UPDATE  = 204; 
const SUCCESSFUL_DELETION =202; 
const SUCCESSFUL_READING = 203; 
const SUCCESSFUL_OPERATION=205; //- This will be used when an http request contains various updates/deletes/creations, it refers to a mixed operation that all were successful

const EXPIRED_ACCESS_TOKEN = 304; 
const BAD_REQUEST = 400; 
// The server cannot or will not process the request due to an apparent client error

const UNAUTHORIZED = 401; 
// but specifically for use when authentication is required and has failed or has not yet been provided.

const FORBIDDEN = 403; 
// but specifically for use when authentication is required and has failed or has not yet been provided.

const NOT_FOUND = 404; 

const METHOD_NOT_ALLOWED = 405; 
// A request method is not supported for the requested resource;

const NOT_ACCEPTABLE = 406; 
const REQUEST_TIMEOUT = 408; 

export {BAD_REQUEST ,REQUEST_TIMEOUT, NOT_ACCEPTABLE , METHOD_NOT_ALLOWED,EXPIRED_ACCESS_TOKEN ,SUCCESSFUL_OPERATION , UNAUTHORIZED , FORBIDDEN , NOT_FOUND , SUCCESSFUL_CREATION , SUCCESSFUL_UPDATE , SUCCESSFUL_DELETION , SUCCESSFUL_READING}; 

// ADD OUT OWN CODES AFTER 452