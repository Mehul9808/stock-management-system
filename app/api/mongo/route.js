import { MongoClient } from "mongodb";
import {NextResponse} from "next/server";

export async function GET(request){

// Replace the uri string with your connection string.
const uri = process.env.CONNECTION_STRING_URI;

const client = new MongoClient(uri);


  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    const query = { };
    const allProducts = await inventory.findOne().toArray();

    console.log(allProducts);
    return NextResponse.json({allProducts})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }



}


export async function POST(request){

  // This line is particularly common in server-side code where you're
  //  handling form submissions, API requests, or other data sent to the server.
let body = await request.json()

  // Replace the uri string with your connection string.
  const uri = process.env.CONNECTION_STRING_URI;
  
  const client = new MongoClient(uri);
  
  
    try {
      const database = client.db('stock');
      const inventory = database.collection('inventory');
      const product = await inventory.insertOne(body);
  
      console.log(product);
      return NextResponse.json({product, ok:true})
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  
  
  
  }