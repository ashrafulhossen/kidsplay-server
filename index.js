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
		await client.connect();
		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);

		// Add a toy
		app.post("/toys/add", async (req, res) => {
			const toy = req.body;
			const result = await toyCollection.insertOne(toy);
			console.log(result);
		});

		// Get all toys
		app.get("/allToys", async (req, res) => {
			const result = await toyCollection.find().toArray();
			res.send(result);
		});

		
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`KidsPlay server is running on port ${port}`);
});
