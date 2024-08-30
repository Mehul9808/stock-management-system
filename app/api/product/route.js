import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri =  "mongodb+srv://mehul:robintriple@cluster0.spxf7.mongodb.net/";


export async function GET(request) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const products = await inventory.find({}).toArray();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const body = await request.json();
    console.log(body)
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const result = await inventory.insertOne(body);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
