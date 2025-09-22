import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  function getProducts() {
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(
          "Unable to get the data. Please check your network and server connection."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // panggil otomatis sekali di awal
  useEffect(getProducts, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Products</h2>

      <div className="row mb-3">
        <div className="col"></div>
        <Link
          className="btn btn-primary me-2"
          to="/admin/products/create"
          role="button"
        >
          Create Products
        </Link>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={getProducts}
        >
          Refresh
        </button>
        <div className="col"></div>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>brand</th>
              <th>category</th>
              <th>price</th>
              <th>image</th>
              <th>created at</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              return (
                <tr key={index}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>
                    <img
                      src={
                        "http://localhost:5000/images/" + product.imageFilename
                      }
                      width="100"
                      alt={product.name}
                    />
                  </td>
                  <td>{product.createdAt.slice(0, 10)}</td>

                  <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-primary btn-sm me-1"
                      to={"/admin/products/edit/" + product.id}
                    >
                      Edit
                    </Link>
                    <button type="button" className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
