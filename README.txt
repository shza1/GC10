Inkhouse Database
-----------------

Overview:
The Inkhouse database serves as the foundation for our e-commerce platform, supporting user management, 
product listings, custom poster uploads, shopping carts, discounts, and finalized orders. 
This file contains the complete MySQL schema and setup script, including all tables, triggers, and 
the stored procedure for order placement. (Changes to be added as project progresses.)

MySQL Version:
Developed and tested on MySQL 8.0.13.
(Note: This version does not enforce CHECK constraints, triggers are used to handle validation logic.)

------------------------------------------------------------
Files Included:
------------------------------------------------------------
- inkhouse_schema.sql   →  Full database build script
- README.txt            →  README file

------------------------------------------------------------
How to Set Up:
------------------------------------------------------------
1. Open MySQL Workbench and connect to your local MySQL server.
2. Open the file "inkhouse_schema.sql" in a new query tab.
3. Run the script (lightning bolt icon) from top to bottom.
4. Once complete, verify that the database was created by running:
       USE inkhouse;
       SHOW TABLES;
5. Confirm initial data with:
       SELECT * FROM users;
       SELECT * FROM products;

------------------------------------------------------------
Key Features Implemented:
------------------------------------------------------------
• User and Cart Management  
  Each user has one active cart, automatically linked by user ID.

• Product Catalog  
  Includes base products, image URLs, and active status toggle.
  Variants allow multiple size and finish options for each product.

• Custom Designs  
  Supports user-uploaded posters with admin status control (pending, approved, rejected).

• Discount Codes  
  Handles both percentage-based and fixed-value promotions with usage tracking.

• Cart System  
  Tracks all items in a user’s cart, ensuring each item references exactly one source
  (product, variant, or custom design). Quantity and price are stored as snapshots.

• Stored Procedure: sp_place_order  
  Automates the entire checkout process:
     - Calculates subtotal, discount, and 8.25% tax
     - Creates a new order and order item entries
     - Updates inventory quantities
     - Clears the cart after checkout

------------------------------------------------------------
Testing the Procedure:
------------------------------------------------------------
After running the schema, you can test a full order cycle using:
   CALL sp_place_order(
       (SELECT user_id FROM users WHERE email='ariel@example.com'),
       'WELCOME10'
   );

Then check the results with:
   SELECT * FROM orders ORDER BY placed_at DESC LIMIT 5;
   SELECT * FROM order_items ORDER BY order_id DESC;

------------------------------------------------------------
Developer/Student Notes:
------------------------------------------------------------
- If rerunning the script, you may need to drop existing procedures:
       DROP PROCEDURE IF EXISTS sp_place_order;

- Default tax rate: 8.25% (825 basis points)
- Default seed user (Name used for example): ariel@example.com
- Example discount: WELCOME10 → 10% off

------------------------------------------------------------
Author:
------------------------------------------------------------
Database developed and maintained by:
   Ariel Martinez
   Software Engineering Team – Inkhouse Project
------------------------------------------------------------

End of README.