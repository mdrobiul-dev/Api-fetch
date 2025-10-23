import React, { useEffect, useState } from "react";
import BlogCard from "../components/home/BlogCard";
import { blogservices } from "../services/api";
import Loading from "../components/loading";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      (async () => {
        const res = await blogservices.blog();
        setProducts(res.products);
        setLoading(false);
      })();
    } catch (error) {}
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="text-center text-4xl my-10 ">Blog List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Loading key={index} />
              ))
            : products.map((item) => <BlogCard key={item.id} data={item} />)}
        </div>
      </div>
    </>
  );
};

export default Home;
