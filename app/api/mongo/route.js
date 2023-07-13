import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");

export async function GET(request) {
   

// Replace the uri string with your connection string.
const uri = "mongodb+srv://stockMan:vgnO0iAAED1SCN8M@cluster0.gjzh8n6.mongodb.net/";

const client = new MongoClient(uri);


  try {
    const database = client.db('sanju');
    const movies = database.collection('stack-mangment');

    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const movie = await movies.find(query).toArray();

    console.log(movie);
    return NextResponse.json({"a":"56", movie})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }


}