# Job Application Portal

A Food Ordering Portal following where users have the option to search and order various food items. At the same time, various vendors have the ability to list food items.

## How to run:

Backend -
```shell
$ cd backend
$ npm install
$ npm start
```
Frontend - 
```shell
$ cd ../frontend
$ npm install
$ npm start
```

## Buyer Details
Each buyer should have the following attributes:
- Name
- Email [Unique]
- Contact Number
- Age
- Batch Name: [possible fields UG1, UG2, UG3, UG4, UG5]

## Vendor Details
Each vendor should have the following attributes:
- Manager’s Name
- Shop Name like JC, VC, BBC, etc. [Unique]
- Email Address [Unique]
- Contact Number
- Canteen Opening and Closing Time

## Features
1. Login and Registration 
- Common registration page with a drop-down to choose user type (Vendor / Buyer) and have fields appear as per
their profile. 
- Common login portal redirecting to respective UI after login. 

2. Food Item Details
Each Food Item should have the following attributes:
- Item Name
- Price: integer-based pricing
- Rating [0-5]: By default, the rating is 0 i.e. the item is unrated.
- Veg / Non-Veg
- Food add-on fields providing users an option to add taste-enhancing elements such as Cheese, Sauce, etc.
- Each food item has its own set of food add-ons, with their pricing <Addon, Price>. A buyer has the option to select a single quantity of each food add-on at max while buying a particular food item. e.g: (Extra Cheese, Rs. 50), (Sauce, Rs. 20), etc.
- Adding tags such as Drinks, Sweet, Cold, Hot etc. These tags that will help in finding an item of their interests. Each food item can have multiple tags.

3. Wallet Details
- A wallet stores the money required to buy items in a canteen.
- For an order to be placed, the wallet amount should be greater than or equal to the order amount. For e.g, If the user wants to buy an item worth 30 there should be a minimum balance of 30 in the wallet.
- To add some money to the wallet, a dummy money adding field is implemented, which just takes an integer amount and adds it into the wallet.
- As soon as the order is placed, the money is deducted from the wallet.
- If the order gets cancelled, the money is refunded back to the wallet. 

## Use Cases
1. Buyer
- Profile page with buyer details and an option to edit them. 
- The dashboard should have the following features
  - Implemented a Search Bar in dashboard, where one can search for a food item based upon item name.
  - Implemented fuzzy search based upon food item name in the dashboard


- Favorites tab: A buyer can mark some food items as favorites and they should appear in a different section on the dashboard. 
- In the food item list, for each food item, the buyer should be able to view all its properties such price, name,
vendor, etc.
- For each food item, the buyer should be able to choose from: its quantity (an integer value), some addons available within a food item and place an order with a buy button. 
- Wallet amount is visible at the top, and the functionalities present in the Wallet Details section are implemented.
- A buyer cannot place an order if the canteen is closed. Such items are present at the end of the item list with an indication that identifies them as unavailable. 


- My Orders page 
- This displays all the current orders, in which each order should have the following fields: Placed Time, Vendor Name, Food Item, Quantity, Status, Cost and Rating.
- The status field tells the current status of the order. It can be of 6 types -
  - PLACED
  - ACCEPTED
  - COOKING
  - READY FOR PICKUP - When the status is Ready for Pickup, a button name “Picked up” should come up. On clicking Picked up, the order status should become Completed.
  - COMPLETED - Every completed order should get an option to rate the food item in the Rating field. Once rated, the food items’ average rating should get updated. 
  - REJECTED
 
2. Vendor
- Profile page with vendor details and an option to edit them. 
- A Food Menu dashboard displaying all food items of the vendor. There must be a button at the top to add a food item. For each added food item, there must be 2 options available - to Edit, and to Delete the food item. 
- A dashboard to view orders issued to the vendor, each order should have details such as placed time, food item, quantity, along with a button [titled “MOVE TO NEXT STAGE”] to change the status of the order. This button should be dynamic in nature, i.e. the functionality of this button depends on the status of the order.
-  Each order as discussed earlier, can have 6 stages 
  - PLACED: Initially, a placed order comes here. An additional REJECT button should be present along with the MOVE TO NEXT STAGE button.
  - ACCEPTED: Upon clicking the latter button, the order should move to the Accepted stage.
  - COOKING: The vendor can then change the state of order from the Accepted stage to the Cooking stage using the button.
  - READY FOR PICKUP: Once the order is in the Cooking Stage, the Vendor can use the button to change the state of the order from the Cooking stage to Ready for pickup.
  - COMPLETED: Orders that have been picked up by their respective buyers.
  - REJECTED: Orders rejected by the vendor
 

- A Statistics Page 
  - Top 5 Items that have been sold
  - Counts for
  - Orders Placed
  - Pending Orders
  - Completed Orders
  - Graphs to visualise batch-wise, age-wise distribution of completed orders.
  - Any vendor can have at-max 10 orders at ACCEPTED and COOKING stage combined. It can’t move any more orders in the ACCEPTED stage till any of these orders reach READY FOR PICKUP stage. An error popup should appear in case the vendor tries to accept more. 

## Extra features
- Deployed the web app (both frontend and backend) on Heroku.
- Email to the buyers on acceptance/rejection of their order. A common email ID has been created for mailing purposes stating that "<vendor-name>" accepted your order. 
 
## Dockerization
- 3 Docker containers are created for hosting Backend, static server hosting Frontend and nginx.
- A docker-compose file is present to boot up all the three containers.
- The backend is hosted at /api and frontend at / 
