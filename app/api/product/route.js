import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");


//get request
export async function GET(request) {
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://stockMan:vgnO0iAAED1SCN8M@cluster0.gjzh8n6.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db("stock");
    const invent = database.collection("invent");
    const query = {};
    const products = await invent.find(query).toArray();
    return NextResponse.json({ products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


//post request

 export async function POST(request) {
    let body=await request.json()
    console.log(body);
    const uri =
      "mongodb+srv://stockMan:vgnO0iAAED1SCN8M@cluster0.gjzh8n6.mongodb.net/";
    const client = new MongoClient(uri);
    try {
      const database = client.db("stock");
      const invent = database.collection("invent");
      const query = {};
      const product = await invent.insertOne(body);
      return NextResponse.json({ product, ok:true });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  