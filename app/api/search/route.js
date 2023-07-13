import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");


//get request
export async function GET(request) {
    const query=request.nextUrl.searchParams.get("query")
  // Replace the uri string with your connection string.
  const uri =
    "mongodb+srv://stockMan:vgnO0iAAED1SCN8M@cluster0.gjzh8n6.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db("stock");
    const invent = database.collection("invent");
    const products = await invent.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } },
            
            ]
          }
        }
      ]).toArray()
    return NextResponse.json({ products });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}




