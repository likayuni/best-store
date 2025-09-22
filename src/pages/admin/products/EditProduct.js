import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams(); // ambil id dari URL
  const navigate = useNavigate();

  const [product, setProduct] = useState(null); // state untuk menyimpan data product
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch product dari server saat komponen mount
  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  // Handle submit form
  async function handleSubmit(event) {
    event.preventDefault();
    if (!product) return;

    const formData = new FormData(event.target);

    // Validasi sederhana
    if (
      !formData.get("name") ||
      !formData.get("brand") ||
      !formData.get("category") ||
      !formData.get("price") ||
      !formData.get("description")
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/admin/products");
      } else if (response.status === 400) {
        const errors = data.errors || {};
        alert(
          "Validation error:\n" +
            Object.entries(errors)
              .map(([key, msg]) => `${key}: ${msg}`)
              .join("\n")
        );
      } else {
        alert("Server error");
      }
    } catch (error) {
      alert("Unable to connect to the server");
    }
  }

  // Tampilkan loading jika product belum ter-fetch
  if (!product)
    return <div className="text-center mt-4">Loading product...</div>;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 mx-auto rounded border p-4">
          <h2 className="text-center mb-5">Edit Product</h2>

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">ID</label>
            <div className="col-sm-8">
              <input
                readOnly
                className="form-control-plaintext"
                defaultValue={product.id}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Name</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="name"
                  defaultValue={product.name}
                />
              </div>
            </div>

            {/* Brand */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Brand</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="brand"
                  defaultValue={product.brand}
                />
              </div>
            </div>

            {/* Category */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Category</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  name="category"
                  defaultValue={product.category}
                >
                  <option value="">Select Category</option>
                  <option value="Computers">Computers</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Printers">Printers</option>
                  <option value="Cameras">Cameras</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Description</label>
              <div className="col-sm-8">
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  defaultValue={product.description}
                ></textarea>
              </div>
            </div>

            {/* Price */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Price</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={product.price}
                />
              </div>
            </div>

            {/* Image */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Image</label>
              <div className="col-sm-8">
                <img
                  src={"http://localhost:5000/images/" + product.imageFilename}
                  width="200"
                  alt={product.name}
                />
                <input className="form-control mt-2" type="file" name="image" />
              </div>
            </div>

            {/* Created At */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Created At</label>
              <div className="col-sm-8">
                <input
                  readOnly
                  className="form-control-plaintext"
                  defaultValue={product.createdAt?.slice(0, 10)}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <div className="col-sm-4 d-grid">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
