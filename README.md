# CIETAPi
Allergy aware restaurant menu data 

Get allergen/ meal ingredient
----
 Retrieves a meal ingredient/allergen

* **URL**

  /api/fooditems/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[GUID]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `
    {
    "name": "Peanut Butter",
    "id": "5a29fe10d562eba69c0c9cf8"
}`
 

Get all allergen/ meal ingredients
----
 Retrives all meal ingredients/allergens

* **URL**

  /api/fooditems
* **Method:**

  `GET`
  
*  **URL Params**
None

   **Required:**
 
   `id=[GUID]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `
[
    {
        "name": "Peanut Butter",
        "id": "5a29fe10d562eba69c0c9cf8"
    },
    {
        "name": "spidermonkey",
        "id": "5a2c76aed562eba69c0d26a8"
    },
    {
        "name": "cashews",
        "id": "5a2e04791a2fb2bd176bba0d"
    }
]`
 

 **Register User**
----
Registers a new user

* **URL**

  api/users

* **Method:**

  `POST`
  
*  **URL Params**
None
   **Required:**
 
   None

* **Data Params**

  `{
	"firstname":"Wally",
	"lastname":"West",
	"email":"fastestmanalive@speed.com",
	"password":"seddfdfcret"
}`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** None
 
* **Error Response:**

  * **Code:** 400 BadRequest <br />
  


**Get Access Token**
----
   Retrieves access token for subsequent api calls for user account 

* **URL**

  /api/users/token

* **Method:**

  `POST`
  
*  **URL Params**
	None

* **Data Params**

  `{	"email":"fastestmanalive@speed.com",
	"password":"seddfdfcret"}`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YTJjYTJiMTIyMjdlNzMyOTBkOTI4MTUiLCJuYW1lIjoiS2Vtcm9uIEdsYXNnb3ciLCJlbWFpbCI6ImtlbXJvbi5nbGFzZ293QGdtYWlsLmNvbSIsImlhdCI6MTUxMjk3NjMzMSwiZXhwIjoxNTEzMDYyNzMxLCJpc3MiOiJOZXdJZCJ9.iYzxYyEXEeTnfEkSk1UnZl0djcEDSLUJcmV-pgH4OL0"
}`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED<br />
    **Content:** `{
    "success": false,
    "message": "Authentication failed. Credentials mismatch"
}`


Get user profile
----
  Retrieves user's profile data

* **URL**

 /api/users/me
* **Method:**

  `GET`
  
*  **HTTP Header**
`Authorization Bearer [access token]`
*  **URL Params**
None

* **Data Params**

  None
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `
{
    "id": "5a2ca2b12227e73290d92815",
    "name": "Wally West",
    "emailAddress": "fastestmanalive@speed.com",
    "allergens": []
}`

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{
    "success": false,
    "message": "Token authentication failed"
}`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{
    "success": false,
    "message": "Missing token"
}`

 
Add user allergen Details
----
 Adds allergens to user profile

* **URL**

 /api/users/me/allergens
* **Method:**

  `POST`
  
*  **HTTP Header**
`Authorization Bearer [access token]`
*  **URL Params**
None

* **Data Params**

  `["fooditemid1","fooditemId2"]`
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `
None

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{
    "success": false,
    "message": "Token authentication failed"
}`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{
    "success": false,
    "message": "Missing token"
}`

 


Remove user allergen Details
----
  Removes allergens from user profile

* **URL**

 /api/users/me/allergens/:id
* **Method:**

  `DELETE`
  
*  **HTTP Header**
`Authorization Bearer [access token]`
* **URL Params**

   **Required:**
 
   `id=[GUID]`


* **Data Params**

  None
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
None

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{
    "success": false,
    "message": "Token authentication failed"
}`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{
    "success": false,
    "message": "Missing token"
}`

 
