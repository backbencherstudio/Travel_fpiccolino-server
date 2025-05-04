## users
- **POST:** `http://localhost:3000/users/register`  
- **POST:** `http://localhost:3000/users/verify-otp`  
- **POST:** `http://localhost:3000/users/resendotp`  
- **POST:** `http://localhost:3000/users/login`  
- **POST:** `http://localhost:3000/users/logout`  
- **POST:** `http://localhost:3000/users/request-forgot-password-otp`  
- **POST:** `http://localhost:3000/users/match-password-otp`  

- **GET:** `http://localhost:3000/users`  
- **GET:** `http://localhost:3000/users/check`  

- **PUT:** `http://localhost:3000/users/update-profile`  
- **PATCH:** `http://localhost:3000/users/reset-forgot-password`  


## package
- **POST:** `http://localhost:3000/packages`  
- **GET:** `http://localhost:3000/packages`  
- **GET:** `http://localhost:3000/packages/:id`  
- **PUT:** `http://localhost:3000/packages/:id`  
- **DELETE:** `http://localhost:3000/packages/:id`  



## Blogs
- **POST:** `http://localhost:3000/blogs/uploads`  
- **POST:** `http://localhost:3000/blogs/createblog`  
- **GET:** `http://localhost:3000/blogs/blogGet/:id`  
- **PATCH:** `http://localhost:3000/blogs/updateHeroSection/:id`  
- **PATCH:** `http://localhost:3000/blogs/updateContent/:id/:contentID`  
- **PATCH:** `http://localhost:3000/blogs/updatecatagory/:id`  
- **DELETE:** `http://localhost:3000/blogs/deleteContent/:id/:contentID`  
- **DELETE:** `http://localhost:3000/blogs/blogDelete/:id`  
- **GET:** `http://localhost:3000/blogs/allblogs`  
- **GET:** `http://localhost:3000/blogs/categorywise`  
- **GET:** `http://localhost:3000/blogs/categoryCount`  
- **GET:** `http://localhost:3000/blogs/popular`  
- **GET:** `http://localhost:3000/blogs/all`  


## category
- **POST:** `http://localhost:3000/categories`  
- **GET:** `http://localhost:3000/categories`  
- **DELETE:** `http://localhost:3000/categories/:id`  

## subscriber
- **POST:** `http://localhost:3000/subscribers`  
- **GET:** `http://localhost:3000/subscribers`  
- **DELETE:** `http://localhost:3000/subscribers/:id`  

## Newsletter
- **GET:** `http://localhost:3000/newsletter/send`  

## Header
- **GET:** `http://localhost:3000/headers`  
- **GET:** `http://localhost:3000/headers/:pageName`  
- **POST:** `http://localhost:3000/headers`  
- **PUT:** `http://localhost:3000/headers`  
- **DELETE:** `http://localhost:3000/headers/:pageName`  

## Contact
- **POST:** `http://localhost:3000/contacts/createContact`  
- **GET:** `http://localhost:3000/contacts/AllContact`  
- **GET:** `http://localhost:3000/contacts/ContactById/:id`  
- **DELETE:** `http://localhost:3000/contacts/DeleteContact/:id`  

## Payment
- **POST:** `http://localhost:3000/payment/stripe/pay`  
- **POST:** `http://localhost:3000/payment/stripe/webhook`  


## Subscriber
- **GET:** `http://localhost:3000/subscribers`  
- **DELETE:** `http://localhost:3000/subscribers/:id`  

## Transaction
- **GET:** `http://localhost:3000/transactions`  
- **DELETE:** `http://localhost:3000/transactions/:id`  

## Order
- **POST:** `http://localhost:3000/order`  
- **GET:** `http://localhost:3000/order/:id`  
- **GET:** `http://localhost:3000/order/user/:userId`  
- **PUT:** `http://localhost:3000/order/:id/status`  
- **DELETE:** `http://localhost:3000/order/:id`  

