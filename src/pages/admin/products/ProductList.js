import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function getProducts() {
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/products?_sort=id&_order=desc")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(getProducts, []);

  // ===========================
  // FUNGSI DELETE
  // ===========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      // update state supaya langsung hilang dari tabel
      setProducts(products.filter((product) => product.id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      alert("Error deleting product: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Products</h2>

      <div className="row mb-3">
        <div className="col"></div>
        <Link className="btn btn-primary me-2" to="/admin/products/create">
          Create Products
        </Link>
        <button className="btn btn-outline-primary" onClick={getProducts}>
          Refresh
        </button>
        <div className="col"></div>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

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
            {products.map((p, i) => (
              <tr key={i}>
                <td>{p.id}</td>
                <td>{p.name || "-"}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.category || "-"}</td>
                <td>{p.price ?? "-"}</td>
                <td>
                  {p.imageFilename ? (
                    <img
                      src={`http://localhost:5000/images/${p.imageFilename}`}
                      width="100"
                      alt={p.name}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>{p.createdAt?.slice(0, 10) || "-"}</td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm me-1"
                    to={`/admin/products/edit/${p.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
