// import { LEGAL_TCP_SOCKET_OPTIONS } from "mongodb";
import { getProducts } from "../models/products";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  let result = await getProducts();
  let products = Array.from(result).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
  return products;
}

export default function Index() {
  let products = useLoaderData();

  let [filterArray, setFilterArray] = useState([]);
  console.log({ filterArray });
  let filters = ["Samsung", "Sony", "LG", "Apple"];

  let filteredProducts = products.filter((item) =>
    filterArray.includes(item.model)
  );
  return (
    <main>
      <div className="mt-4 w-full flex">
        <div className="bg-gray-600 text-gray-200 w-80">
          <h2 className="mt-4">Filter by</h2>
          <ul className="flex flex-col gap-2">
            {filters.map((filter, index) => (
              <Filter
                key={index}
                title={filter}
                name="brand"
                value={filter}
                filterArray={filterArray}
                setFilterArray={setFilterArray}
              />
            ))}
          </ul>
        </div>
        <div className="w-full pl-16 text-gray-00">
          <h1 className="mt-4 text-4xl font-semibold">Products</h1>
          <ul className=" grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {filterArray.length > 0
              ? filteredProducts.map((item) => (
                  <li key={item._id}>
                    <Product product={item} />
                  </li>
                ))
              : products.map((item) => (
                  <li key={item._id}>
                    <Product product={item} />
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

function Filter({ title, name, value, filterArray, setFilterArray }) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          name={name}
          value={value}
          onChange={() => {
            //If the value is present in the array,remove it,else add it to the array
            if (filterArray.includes(value)) {
              let index = filterArray.indexOf(value);
              filterArray.splice(index, 1);
              setFilterArray([...filterArray]);
            } else {
              setFilterArray([...filterArray, value]);
            }
          }}
        />
        {title}
      </label>
    </li>
  );
}

function Product({ product }) {
  return (
    <article>
      <img
        src={product.image}
        alt={`Image of ${product.title} `}
        className="h-40 w-50"
      />
      <div className="flex gap-2 items-center mt-4">
        <h2>{product.title}</h2>
        <p>({product.model})</p>
      </div>
      <p className="mt-8 font-semibold text-orange-700">{product.price}</p>
    </article>
  );
}
