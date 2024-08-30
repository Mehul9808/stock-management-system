"use client";
import { Header } from "./components/Header";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({
    slug: "",
    quantity: "",
    price: "",
  });
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingaction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    // Fetch products on load
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const rjson = await response.json(); // Parse JSON response
        setProducts(rjson.products || []); // Safely set products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    let index = products.findIndex((item) => item.slug === slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action === "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    let indexdrop = dropdown.findIndex((item) => item.slug === slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action === "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);

    setLoadingaction(true);
    await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    setLoadingaction(false);
  };

  const addProduct = async (e) => {
    e.preventDefault(); // Prevent form from submitting the default way
    
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        setAlert("Your Product has been added!");
        setProductForm({ slug: "", quantity: "", price: "" }); // Reset form after submission
        const rjson = await response.json(); // Get the response after product is added
        setProducts((prev) => [...prev, rjson.result]); // Add the new product to the list
      } else {
        console.error("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // fetch all the product again to sync back 
    const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const rjson = await response.json(); // Parse JSON response
        setProducts(rjson.products || []); // Safely set products
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto my-8 p-5">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        <div className="flex mb-2">
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder="Enter a product name"
            className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md"
          />
          {/* <select className="border border-gray-300 px-4 py-2 rounded-r-md">
            <option value="">All</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            
          </select> */}
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            {/* <img width={74} src="/loading.svg" alt="Loading..." /> */}
            

<svg version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  viewBox="0 0 100 100" enableBackground="new 0 0 100 100" >
 <path fill="#A855F7" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
  c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="2s" 
         from="0 50 50"
         to="360 50 50" 
         repeatCount="indefinite" />
  </path>
 <path fill="#34D399" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
  c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="1s" 
         from="0 50 50"
         to="-360 50 50" 
         repeatCount="indefinite" />
  </path>
 <path fill="#6366F1" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
  L82,35.7z">
      <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="2s" 
         from="0 50 50"
         to="360 50 50" 
         repeatCount="indefinite" />
  </path>
</svg>


          </div>
        )}
        <div className="dropcontainer absolute w-[72vw] border-1 bg-purple-100 rounded-md ">
          {dropdown.map((item) => {
            return (
              <div
                key={item.slug} // Ensure each item has a unique key
                className="container flex justify-between p-2 my-1 border-b-2"
              >
                <span className="slug">
                  {item.slug} ({item.quantity} available for ₹{item.price})
                </span>
                <div className="mx-5">
                  <button
                    onClick={() => buttonAction("minus", item.slug, item.quantity)}
                    disabled={loadingaction}
                    className="subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                  >
                    -
                  </button>
                  <span className="quantity inline-block min-w-3 mx-3">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => buttonAction("plus", item.slug, item.quantity)}
                    disabled={loadingaction}
                    className="add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Display Current Stock */}
      <div className="add-product-section container mx-auto my-8 p-5">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">
              Product Slug
            </label>
            <input
              value={productForm.slug}
              name="slug"
              onChange={handleChange}
              type="text"
              id="productName"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block mb-2">
              Quantity
            </label>
            <input
              value={productForm.quantity}
              name="quantity"
              onChange={handleChange}
              type="number"
              id="quantity"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price
            </label>
            <input
              value={productForm.price}
              name="price"
              onChange={handleChange}
              type="number"
              id="price"
              className="w-full border border-gray-300 px-4 py-2"
            />
          </div>

          <button
            onClick={addProduct}
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Display the table of products */}
      <div className="container my-8 mx-auto p-5">
        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>
        <table className="table-auto w-full">
    <thead>
      <tr>
        <th className="px-4 py-2">Product Name</th>
        <th className="px-4 py-2">Quantity</th>
        <th className="px-4 py-2">Price</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.slug}>
          <td className="border px-4 py-2">{product.slug}</td>
          <td className="border px-4 py-2">{product.quantity}</td>
          <td className="border px-4 py-2">₹{product.price}</td>
        </tr>
      ))}
    </tbody>
  </table>
      </div>
    </>
  );
}
