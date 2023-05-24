const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
	res.send("KidsPlay server is running........");
});

// Mongo DB
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.coz8j6b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const toyCollection = client.db("toysDB").collection("toy");

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		client.connect();

		// Get all toys
		app.get("/allToys", async (req, res) => {
			const result = await toyCollection.find().toArray();
			res.send(result);
		});

		// Get a single toy
		app.get("/toy/:_id", async (req, res) => {
			const _id = req.params._id;
			const query = { _id: new ObjectId(_id) };
			const result = await toyCollection.findOne(query);
			res.send(result);
		});

		// get filtered toy by name
		app.get("/allToys/filter=:filterData", async (req, res) => {
			const textIndex = await toyCollection.createIndex({
				a: 1,
				"$**": "text",
			});
			const filter = req.params.filterData;
			const result = await toyCollection
				.find({ $text: { $search: "math" } })
				.toArray();
			console.log(result);
		});

		// Get subCategorize toys
		app.get("/allToys/:subCategory", async (req, res) => {
			const subCategory = req.params.subCategory;
			const query = { subCategory: subCategory };
			const result = await toyCollection.find(query).toArray();
			res.send(result);
		});

		// Get my toys
		app.get("/myToys/:sellerUid", async (req, res) => {
			const sellerUid = req.params.sellerUid;
			const query = { "seller.sellerUid": sellerUid };
			const result = await toyCollection.find(query).toArray();
			res.send(result);
		});

		// Add a toy
		app.post("/toys/add", async (req, res) => {
			const toy = req.body;
			const result = await toyCollection.insertOne(toy);
			res.send(result);
		});

		// update toy
		app.put("/myToys/:_id/edit", async (req, res) => {
			const _id = req.params._id;
			const toy = req.body;
			const updatedData = {};
			if (toy?.price) {
				updatedData.price = toy.price;
			}
			if (toy?.quantity) {
				updatedData.quantity = toy.quantity;
			}
			if (toy?.details) {
				updatedData.details = toy.details;
			}
			const filter = { _id: new ObjectId(_id) };
			const result = await toyCollection.updateOne(filter, {
				$set: updatedData,
			});
			res.send(result);
		});

		// delete toy
		app.delete("/myToys/:_id/delete", async (req, res) => {
			const _id = req.params._id;
			const query = { _id: new ObjectId(_id) };
			const result = await toyCollection.deleteOne(query);
			res.send(result);
		});
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`KidsPlay server is running on port ${port}`);
});
