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
 
   `id=[ingredient id]`

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
 
   `id=[ingredient id]`

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

  /api/users

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
 
   `id=[fooditem/allergen id]`


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

 

 Restaurant Recommendation
----
Retrieves restaurants where all menu items are allergen free

* **URL**

 /api/restaurants/recommended
* **Method:**

  `GET`
  
*  **HTTP Header**
`Authorization Bearer [access token]`
* **URL Params**

	None

* **Data Params**

 None
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[
    {
        "name": "Olive yard hen",
        "location": "123 farm drive",
        "menu": [
            {
                "description": "Hen drenched in teriyaki sauce",
                "image": "http://testing.com/images/3",
                "name": "Yakuza chicken",
                "ingredients": [
                    {
                        "name": "Olives",
                        "id": "5a2c76aed562eba69c0d26a8"
                    },
                    {
                        "name": "Cauliflower",
                        "id": "5a2c769dd562eba69c0d269d"
                    }
                ],
                "id": "5a2c8c8d185ae0392099827b"
            },
          ...

]`

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

 


Restaurant menu browsing
----
  Retrieves restaurant menu with meals
  and ingredients annotated with user allergen markers
  
* **URL**

 /api/restaurants/:id/menu
* **Method:**

  `GET`
  
*  **HTTP Header**
`Authorization Bearer [access token]`
*  **URL Params**

   **Required:**
 
   `id=[restaurant id]`

* **Data Params**

 None
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    `{
    "name": "My Restaurant",
    "location": "test description",
    "menu": [
        {
            "description": "test description",
            "image": "http://testing.com",
            "name": "Test Name",
            "ingredients": [
                {
                    "name": "spidermonkey",
                    "id": "5a2c76aed562eba69c0d26a8",
                    "isAllergen": true
                },
                {
                    "name": "Cauliflower",
                    "id": "5a2c769dd562eba69c0d269d",
                    "isAllergen": false
                }
            ],
            "id": "5a2c8c8d185ae0392099827b",
            "isSafe": false
        },
	    ...
    ],
    "id": "5a2c8ad34c7dae1bfce5d87c"
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

 

Allergen free meal search
----
 Retrieves safe versions of meals across all registered restaurants filtered by name
* **URL**

/api/restaurants/all/menu/search?item=m
* **Method:**

  `GET`
  
*  **HTTP Header**
`Authorization Bearer [access token]`
*  **URL Params**

	None
* **Data Params**

 None

* **Query Params**

 `item=[ name of meal] -`
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    `[
    {
        "_id": "5a2e020cf802ec494427b976",
        "name": "Kazakhstan's Fried Carrots ",
        "location": "Kazakhstan ",
        "menu": [
            {
                "_id": "5a2e02bcf802ec494427b977",
                "description": "Carrots slow fried and served with soy sauce",
                "image": "http://testing.com/15",
                "name": "Mmm Carrots,
                "ingredients": [
                    {
                        "name": "Carrots",
                        "id": "5a29fe10d562eba69c0c9cf8"
                    },
                    {
                        "name": "Soy",
                        "id": "5a2c769dd562eba69c0d269d"
                    }
                ]
            }
        ]
    }
]`

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

  OR

  * **Code:** 400 BAD REQUEST<br />
    **Content:** ` string query parameter [item] is required`

 




Get all registered restaurants
----
Retrieves all restaurants. 
Uses optional name query parameter for filtering by name 
   * 
* **URL**

/api/restaurants?name=olive%20garden
* **Method:**

  `GET`
  
*  **HTTP Header**
`Authorization Bearer [access token]`

*  **URL Params**

 None

* **Query Params**

   **Optional:**
 `item=[name of meal] `
  

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ` [ {
        "name": "My Restaurant",
        "location": "test description",
        "menu": [
            {
                "description": "test description",
                "image": "http://testing.com/1",
                "name": "Test meal",
                "ingredients": [
                    "5a2c76aed562eba69c0d26a8",
                    "5a2c769dd562eba69c0d269d"
                ],
                "id": "5a2c8c8d185ae0392099827b"
            },
         ...
        ],
        "id": "5a2c8ad34c7dae1bfce5d87c"
    }
    ...
]`

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
 


Register new restaurant client (Admin)
----
Registers a new client.
* **URL**

/api/admin/clients

* **Method:**

  `POST`
  
*  **URL Params**
None
* **Data Params**

`{
	"name":"Another Test",
	"location":"Testing"
}`
* **Query Params**
None
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
	 None




Get Registered Client Restaurant (Admin)
----
 Retrieves the restaurant registered to client
 
* **URL**

/api/admin/clients/me
* **Method:**

  `GET`
  
*  **URL Params**

 None

* **Query Params**

   **Required:**
   key = [string] - clients api key generated at signup
   secret =[string] - client secret generated at signup
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    `{
    "name": "Test restaurant ",
    "location": "Never land",
    "menu": [
        {
            "description": "test description",
            "image": "http://testing.com",
            "name": "Test meal 3",
            "ingredients": [
                {
                    "name": "Peanut Butter",
                    "id": "5a29fe10d562eba69c0c9cf8"
                },
                {
                    "name": "Cauliflower",
                    "id": "5a2c769dd562eba69c0d269d"
                }
            ],
            "id": "5a2e02bcf802ec494427b977"
        },
        {
            "description": "test description",
            "image": "http://testing.com",
            "name": "Test meal 2",
            "ingredients": [
                {
                    "name": "Peanut Butter",
                    "id": "5a29fe10d562eba69c0c9cf8"
                }
            ],
            "id": "5a2e02c7f802ec494427b978"
        },
        {
            "description": "test description",
            "image": "http://testing.com/1",
            "name": "Test meal1",
            "ingredients": [
                {
                    "name": "Cauliflower",
                    "id": "5a2c769dd562eba69c0d269d"
                }
            ],
            "id": "5a2e02dbf802ec494427b979"
        }
    ],
    "id": "5a2e020cf802ec494427b976"
}`

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `Unauthorized access`




Add meal to menu (Admin)
----
Adds a new meal to restaurant menu for client
 
* **URL**

/api/admin/clients/me/menuitems
* **Method:**

  `POST`
  
*  **URL Params**

 None

* **Data Params**

  `{
	"name":"Vegan Cheesecake",
	"description":"Veganville's best fake cheese",
	"image":"http://testing.com/1",
	"ingredients":["5a2c769dd562eba69c0d269d"]
}`


* **Query Params**

   **Required:**
   key = [string] - clients api key generated at signup <br/>
   
   secret =[string] - client secret generated at signup
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
	 None

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `Unauthorized access`



Remove meal from menu (Admin)
----
Adds a new meal to restaurant menu for client
 
* **URL**

/api/admin/clients/me/menuitems/:id
* **Method:**

  `DELETE`
  
*  **URL Params**
 `id = {menuitemid}`

* **Data Params**
	None


* **Query Params**

   **Required:**
   key = [string] - clients api key generated at signup <br/>
   
   secret =[string] - client secret generated at signup
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
	 None

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `Unauthorized access`



Add meal ingredients (Admin)
----
Adds ingredients to a menu item
 
* **URL**

/api/admin/clients/me/menuitems/:id/ingredients
* **Method:**

  `POST`
  
*  **URL Params**
 `id = {menuitemid}`

* **Data Params**
	`[ingredientId,ingredientId2,...]`


* **Query Params**

   **Required:**
   key = [string] - clients api key generated at signup <br/>
   
   secret =[string] - client secret generated at signup
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
	 None

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `Unauthorized access`



Remove meal ingredient (Admin)
----
 Removes ingredient from menu item 
* **URL**

/api/admin/clients/me/menuitems/:menuItemId/ingredients/:ingredientId
* **Method:**

  `DELETE`
  
*  **URL Params**
 `menuItemId= {id of menu item}`
 `ingredientId= {id of ingredient}`

* **Data Params**
None
* **Query Params**

   **Required:**
   key = [string] - clients api key generated at signup <br/>
   
   secret =[string] - client secret generated at signup
  
* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
	 None

* **Error Response:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `Unauthorized access`
