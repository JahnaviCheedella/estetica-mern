MERN FullStack –  (Front and Backend api implementation)
——FRONTEND  - CLIENT SIDE—— 
Please find below the client-side implementation details for the Estetica web application. The frontend is built with React, Redux (global state), React Router (navigation with protected routes), and MUI for responsive UI components. Authentication state drives access control across routes, ensuring only authenticated users can access protected pages.

Environment
* Tech: React, Redux, React Router, MUI
* State: Auth, Products, Cart managed via Redux slices
* UI: Mobile-first responsive layouts with MUI, accessible components
* Security: Protected routes based on auth state, redirecting unauthenticated traffic to login
Routes and Screens
* / or /login — Auth screen with username/password. Calls POST /auth with mode=signup or mode=signin; on success, stores auth state in Redux and navigates to /home; protected-route guard prevents access to /home and /billing when unauthenticated. API: POST /auth.
* /home — Product catalog page. Fetches product list using GET /products/all; includes search and category filters, shows logged-in username in AppBar, and supports logout. Hovering a product reveals a + button to add items to cart using POST /add-to-cart; the right-side cart panel lists items with quantity increment/decrement via POST /add-to-cart and removal via DELETE /remove-from-cart/:id; supports clearing all via GET /clear-cart. API: GET /products/all, POST /add-to-cart, DELETE /remove-from-cart/:id, GET /clear-cart.
* Checkout button — Triggers navigation from /home to /billing when clicked; requires authentication (protected). API: Client-side navigation only.
* /billing — Billing summary page. Loads cart with GET /cart and displays computed totals from backend, including tax and discount application; totals are calculated server-side (current config: discount 0%, tax 18%). API: GET /cart.
Protected Routes
* Guarded routes: /home, /billing
* Behavior: If not authenticated, redirect to / or /login; on authentication success, allow access and hydrate user/cart state.
* Redux integration: Auth slice persists authentication details; route guard reads auth state to control access.
UI details
* MUI components enable consistent, accessible, and responsive UI across mobile and desktop.
* AppBar shows the authenticated username and a logout action.
* Cart side panel offers quick quantity controls and item removal; totals update immediately after server confirmation.
* Search and category filters operate on the fetched /products/all list for fast UX while remaining in sync with backend data.
Backend Interaction Summary (from Client)
* Auth: POST /auth with mode (signup/signin); store flag in Redux.
* Products: GET /products/all on /home load and upon filter/search updates.
* Cart:
    * Add/Update: POST /add-to-cart with productId and quantity.
    * Remove single: DELETE /remove-from-cart/:id.
    * Clear: GET /clear-cart.
    * Summary: GET /cart, which returns line items and computed totals (tax, discount, grand total) from the server.
Test Instructions
* Start the backend and open the client app.
* Attempt to access /home or /billing while logged out; expect redirect to /login (protected routes).
* Sign up or sign in via /auth; on success, navigate to /home and verify username in AppBar.
* Load products and test search/category filters.
* Add items via + hover button; verify right-side cart panel updates.
* Adjust quantities (increment/decrement), remove items, and clear cart; confirm server-backed updates.
* Proceed to /billing and verify totals reflect server-side tax (18%) and discount (0%) logic.

Notes:  Discount currently set to 0% and tax to 18% in backend configuration; frontend displays backend-computed totals as returned by /cart. 

——BACKEND - SERVER SIDE——
 Please find below the server-side implementation details (Node.js, Express, MongoDB) for the Estetica web application, developed as part of the recruitment assignment. The backend uses Express Router for API structuring, MongoDB (local) with the database name “estetica,” and integrates authentication with bcrypt for secure password handling.

Environment
* Stack: Node.js, Express, MongoDB (local)
* Database: estetica
* API Structure: Express Router
* Security: Password hashing via bcrypt
* Collections: users, cart, products
* Product images are stored in cloudinary and added the assets links in mongo documents

Endpoints Overview
* /initialize-data (POST) — Initializes database with seed data and creates collections users, cart, products. MongoDB: createCollection(), insertMany().
* /products/:filter (GET) — Retrieves products and applies an optional category/criteria filter like /products/all. MongoDB: find().
* / (GET) — Health/welcome endpoint responding with “welcome to estetica api”. MongoDB: N/A.
* /auth (POST) — Unified signup/signin; checks user by username/email, hashes password on signup, verifies hash on signin. MongoDB: findOne(), insertOne(); Crypto: bcrypt.hash()/compare.
* /add-to-cart (POST) — Upserts an array of items (productId, quantity) into the cart; updates if exists, inserts otherwise. MongoDB: updateOne({ upsert: true }), bulkWrite().
* /cart (GET) — Returns cart items with product lookups and computed totals (tax, discount, grand total) plus product details. MongoDB: findOne() for user/cart and product resolution, used filter/map/reduce for aggregations.
* /remove-from-cart/:id (DELETE) — Removes a single item from the cart by productId. MongoDB: deleteOne().
* /clear-cart (GET) — Clears all items in the cart. MongoDB: deleteMany().
Application Flow 
* Authentication: Sign-up stores hashed passwords; sign-in compares bcrypt hashes to validate credentials.
* Catalog: Products are loaded with /initialize-data and retrieved via /products/:filter with optional filter logic.
* Cart: Add/update via upsert semantics; totals computed server-side with tax and discount aggregation; clear and delete endpoints manage lifecycle.
Testing Instructions
* Use Postman or curl for endpoint verification after server start.
* Call /initialize-data (POST) once to create collections and seed sample data.
* Validate auth with /auth (POST) for both signup and signin flows.
* Exercise cart lifecycle: /add-to-cart → /cart → /remove-from-cart/:id → /clear-cart.
Next Steps (Optional Enhancements)
* Add JWT-based session management/authentication for protected cart/product ops. 

Deliverables Attached
* Source code committed to GitHub (frontend and backend).
* Attached: Web and mobile responsive, Mongo Compass screenshots.

 <img width="390" height="404" alt="Screenshot 2025-09-13 185832" src="https://github.com/user-attachments/assets/3c0358a9-65b1-40e4-a55b-9b32d62192a5" />
<img width="394" height="414" alt="Screenshot 2025-09-13 185756" src="https://github.com/user-attachments/assets/f5e48d1f-05e0-42e1-8280-d1dc0dd682e6" />
<img width="394" height="406" alt="Screenshot 2025-09-13 185718" src="https://github.com/user-attachments/assets/06eea4<img width="955" height="471" alt="signup" src="https://github.com/user-attachments/assets/f08f239e-c332-4d69-ae82-92875ad6bbad" />
<img width="951" height="497" alt="Screenshot 2025-09-13 190127" src="https://github.com/user-attachments/assets/0ec26962-13d8-4f5e-91a5-ac674ee748f9" />
<img width="958" height="499" alt="Screenshot 2025-09-13 190058" src="https://github.com/user-attachments/assets/f527aca7-f6e2-403e-a4f6-0222aae3a1d0" />
<img width="948" height="494" alt="Screenshot 2025-09-13 190007" src="https://github.com/user-attachments/assets/ff7bcf35-c0ae-4f6b-bd70-d9f844047df0" />
7b-bf9f-43b2-bf3c-92736d9dc88a" />
<img width="420" height="415" alt="Screenshot 2025-09-13 185517" src="https://github.com/user-attachments/assets/d497952a-b712-4a41-92a0-6310c66329e8" />
<img width="375" height="409" alt="Screenshot 2025-09-13 185451" src="https://github.com/user-attachments/assets/3bd10182-9962-46d7-9f60-f754c2d3f816" />
<img width="947" height="472" alt="Screenshot 2025-09-13 185149" src="https://github.com/user-attachments/assets/d8ddb1fd-6fb9-4b13-a3d2-4670fa72bf66" />
<img width="959" height="464" alt="Screenshot 2025-09-13 184854" src="https://github.com/user-attachments/assets/b31c806b-f614-4a45-89f7-9fa5dd9e55dc" />
<img width="1920" height="942" alt="screencapture-localhost-3000-home-2025-09-13-18_50_34" src="https://github.com/user-attachments/assets/98f72b8e-777a-4097-ab63-9d18e00bdca4" />
<img width="1920" height="942" alt="screencapture-localhost-3000-home-2025-09-13-18_49_48" src="https://github.com/user-attachments/assets/c420e4ae-f772-400b-ae86-41dac50a3c00" />
<img width="323" height="900" alt="screencapture-localhost-3000-billing-2025-09-13-18_58_57" src="https://github.com/user-attachments/assets/d1b90c77-5d99-4b87-8644-842e52320532" />
<img width="1920" height="897" alt="screencapture-localhost-3000-billing-2025-09-13-18_52_13" src="https://github.com/user-attachments/assets/7fd5435c-caee-4a78-81cd-4b25e14809be" />
