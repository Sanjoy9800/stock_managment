"use client";
import { useState, useEffect } from "react";
import Header from "./components/Header";

export default function Home() {
  const [productFrom, setproductFrom] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch("/api/product");
      let data = await response.json();
      setProducts(data.products);
    };

    fetchProduct();
  }, []);

  //add product function
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productFrom),
      });

      if (response.ok) {
        console.log("product added successfully");
        setAlert("Your Product has been Added!");
        setproductFrom({});
      } else {
        // Handle the error
        console.error("error adding product");
      }
    } catch (error) {
      // Handle any errors
      console.error("error:", error);
    }

    // fetch all the product again sync back
    const response = await fetch("/api/product");
    let data = await response.json();
    setProducts(data.products);
    
  };

  // input handel function

  const handelChange = (e) => {
    setproductFrom({ ...productFrom, [e.target.name]: e.target.value });
  };

  // dropdown search function
  const DropDownEdit = async (e) => {
    let value=e.target.value
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let data = await response.json();
      setDropdown(data.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  // search action in dropdpown
  const actionBtn = async (action, slug, initQuantity) => {
    //imidiatly change the quantity of the product with given slug in products
    let index = products.findIndex((item) => item.slug == slug);
    console.log(index);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initQuantity) + 1;
      console.log(newProducts[index].quantity);
    } else {
      newProducts[index].quantity = parseInt(initQuantity) - 1;
    }
    setProducts(newProducts);

    //imidiatly change the quantity of the product with given slug in dropdown
    let indexDrop = dropdown.findIndex((item) => item.slug == slug);
    console.log(indexDrop);
    let newDropDown = JSON.parse(JSON.stringify(dropdown));
    if (action == "plus") {
      newDropDown[indexDrop].quantity = parseInt(initQuantity) + 1;
      console.log(newProducts[indexDrop].quantity);
    } else {
      newDropDown[indexDrop].quantity = parseInt(initQuantity) - 1;
    }
    setDropdown(newDropDown);

    console.log(action, slug);
    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initQuantity }),
    });
    let res = response.json();
    console.log(res);
    setLoadingAction(false);
  };
  return (
    <>
      <Header />

      {/* Search section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-green-600 font-bold text-center">{alert}</div>
        <div className="container mx-auto px-4 sm:px-6 sm: py-4">
          <h1 className="text-3xl font-bold mt-8 text-center">
            Search Product
          </h1>

          <div className="flex flex-col sm:flex-row sm:justify-center mt-8">
            <div className="mb-4 sm:mr-4">
              <input
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
                type="text"
                placeholder="Enter product name"
                onChange={DropDownEdit}
                // onBlur={() => setDropdown([])}
              />
            </div>

            {/* <div className="mb-4 sm:mr-4">
              <select className="border border-gray-300 px-4 py-2 rounded-md w-full">
                <option value="">All</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                <option value="category3">Category 3</option>
              </select>
            </div> */}

            {/* 
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
              Search
            </button> */}

            {/* svg loding */}
          </div>
          {loading && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 40 40"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="4"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="1, 200; 80, 200; 80, 200"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0; -15; -124"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          )}

          {/* dropdown logic */}

          <div className="dropcontainer absolute w-[72vw] border-1 bg-purple-100 rounded-md ">
            {dropdown.map((item) => {
              return (
                <div
                  key={item.slug}
                  className="container flex justify-between py-2 px-3 my-1  border-b-2"
                >
                  <span className="slug">
                    {item.slug} ({item.quantity} available for ₹{item.price})
                  </span>
                  <div className="mx-5">
                    <button
                      onClick={() => {
                        actionBtn("minus", item.slug, item.quantity);
                      }}
                      disabled={loadingAction}
                      className="sub inline-block px-3 py-1 cursor-pointer bg-purple-400 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                    >
                      -
                    </button>
                    <span className="quantity mx-3">{item.quantity}</span>
                    <button
                      onClick={() => {
                        actionBtn("plus", item.slug, item.quantity);
                      }}
                      disabled={loadingAction}
                      className="add inline-block px-3 py-1 cursor-pointer bg-purple-400 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"
                    >
                      +
                    </button>
                    {/* <span className="price">{item.price}</span> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* add product section */}

        <h1 className="text-3xl font-bold mt-8 text-center">Add Product</h1>

        <div className="flex flex-col sm:flex-row sm:justify-center mt-8 text-center">
          <div className="mb-4 sm:mr-4">
            <label className="block mb-2">Product Slug</label>
            <input
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="text"
              placeholder="Enter product name"
              value={productFrom?.slug || ""}
              name="slug"
              onChange={handelChange}
            />
          </div>

          <div className="mb-4 sm:mr-4">
            <label className="block mb-2">Quantity</label>
            <input
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="number"
              placeholder="Enter quantity"
              value={productFrom?.quantity || ""}
              name="quantity"
              onChange={handelChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Price</label>
            <input
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              type="number"
              placeholder="Enter price"
              value={productFrom?.price || ""}
              name="price"
              onChange={handelChange}
            />
          </div>

          <button
            onClick={addProduct}
            className="bg-purple-500 text-white px-4 py-2 rounded-md ml-3 mt-7 mb-4"
          >
            Add Stock
          </button>
        </div>

        {/* Table to display stock */}

        <h1 className="mt-8 text-center text-3xl">Display Current Stock</h1>
        <div className="overflow-x-auto text-center">
          <table className="w-full mx-auto mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-center text-gray-700">
                  Product Slug
                </th>
                <th className="px-6 py-3 text-center text-gray-700">
                  Quantity
                </th>
                <th className="px-6 py-3 text-center text-gray-700">Price</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder data */}

              {products.map((item) => {
                return (
                  <tr className="bg-white" key={item.slug}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {item.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">₹{item.price}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
