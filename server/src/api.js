import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import { productsCollectionData } from "./estetica.products.js";

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();
app.use(router);

//mongodb connection url
const client = new MongoClient("mongodb://localhost:27017");
let db;

// Basic route to check if the server is running
router.get("/", (req, res) => {
  res.send("Welcome to the Estetica API");
});

// signin/signup
router.post("/auth", async (req, res) => {
  try {
    const { username, password, mode } = req.body;

    if (mode === "signup") {
      // Check if user exists
      const existingUser = await db.collection("users").findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save new user
      await db
        .collection("users")
        .insertOne({ username, password: hashedPassword });
      return res.status(201).json({ message: "User registered successfully" });
    } else {
      // Find user
      const user = await db.collection("users").findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      //Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      return res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to get products
router.get("/products/:filter", async (req, res) => {
  try {
    const { filter } = req.params || "all";
    const products = await db
      .collection("products")
      .find({ ...(filter !== "all" && { category: filter }) })
      .toArray();
    res.send(products).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to add items to the cart
router.post("/add-to-cart", async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Request body must be a non-empty array of items." });
    }

    const operations = items.map((item) => ({
      updateOne: {
        filter: { productId: item.productId },
        update: { $set: { quantity: item.quantity } },
        upsert: true,
      },
    }));

    const result = await db.collection("cart").bulkWrite(operations);

    res.status(200).json({
      message: "Cart updated successfully.",
      updatedCount: result.modifiedCount,
      newlyAddedCount: result.upsertedCount,
    });
  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to get cart items with detailed product info and cart summary
router.get("/cart", async (req, res) => {
  try {
    const cartItems = await db.collection("cart").find().toArray();
    const detailedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await db
          .collection("products")
          .findOne({ _id: new ObjectId(item.productId) });
        if (product) {
          const price = product.price;
          const total = price * item.quantity;
          return {
            ...product,
            quantity: item.quantity,
            total: total,
          };
        }
        return null;
      })
    );

    const filteredCartItems = detailedCartItems.filter((item) => item !== null);
    const serviceTotal = 1000;
    const discountInPercent = 0.0;
    const taxInPercent = 18;
    const productTotal = filteredCartItems.reduce(
      (acc, item) => acc + (item ? item.total : 0),
      0
    );
    const finalTotalAfterDiscount =
      productTotal +
      serviceTotal -
      (productTotal + serviceTotal) * (discountInPercent / 100);
    const taxAmount = finalTotalAfterDiscount * (taxInPercent / 100);
    const grandTotal = finalTotalAfterDiscount + taxAmount;

    res.status(200).json({
      filteredCartItems,
      serviceTotal,
      discountInPercent,
      taxInPercent,
      productTotal,
      finalTotalAfterDiscount,
      taxAmount,
      grandTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/remove-from-cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection("cart").deleteOne({ productId: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Item not found in cart." });
    }

    res.status(200).json({ message: "Item removed from cart successfully." });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/clear-cart", (req, res) => {
  db.collection("cart").deleteMany({}, (err, result) => {
    if (err) {
      console.error("Error clearing cart:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ message: "Cart cleared successfully." });
  });
});

// fill database with products data and create collections users, products, cart if not exists using postman
router.post("/initialize-data", async (req, res) => {
  try {

    const productsData = productsCollectionData;
    const results = {};

    // Check for collections and create if they don't exist 
    const requiredCollections = ["users", "products", "cart"];
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    for (const coll of requiredCollections) {
      if (!collectionNames.includes(coll)) {
        await db.createCollection(coll);
        results[coll] = { status: `Collection '${coll}' created.` };
      }
    }

    // If 'products' collection is empty, load it from the JSON variable
    const productsCount = await db.collection("products").countDocuments();
    if (productsCount === 0) {
      console.log("Products collection is empty. Loading data from variable");
      
      if (productsData && productsData.length > 0) {
        const productResult = await db.collection("products").insertMany(productsData);
        results.products = { loadedFromVariable: productResult.insertedCount };
      }
    } else {
      results.products = { status: "Collection already contains data. No action taken." };
    }

    console.log("Database initialization complete:", results);
    res.status(200).json({
      message: "Database initialization process completed.",
      details: results
    });

  } catch (error) {
    console.error("Data Initialization Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Start the server after connecting to the MongoDB
client
  .connect()
  .then(() => {
    db = client.db("estetica");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error(err));
