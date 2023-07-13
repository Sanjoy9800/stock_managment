import { NextResponse } from "next/server";

const { MongoClient } = require("mongodb");

export async function POST(request) {
  let { action, slug, initQuantity } = await request.json();

  const uri =
    "mongodb+srv://stockMan:vgnO0iAAED1SCN8M@cluster0.gjzh8n6.mongodb.net/";
  const client = new MongoClient(uri);
  try {
    const database = client.db("stock");
    const invent = database.collection("invent");
    const filter = { slug: slug };
    const newQuantity = action == "plus" ? (parseInt(initQuantity) + 1) : (parseInt(initQuantity) - 1);
    const updateDoc = {
      $set: {
        quantity: newQuantity,
      },
    };
    const result = await invent.updateOne(filter, updateDoc,{});

    return NextResponse.json({
      ok: true,
      success: true,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
