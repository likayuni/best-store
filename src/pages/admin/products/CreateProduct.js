import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // validasi client-side sederhana
    if (
      !formData.get("name") ||
      !formData.get("brand") ||
      !formData.get("category") ||
      !formData.get("price") ||
      !formData.get("description") ||
      !formData.get("image").name
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
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

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 mx-auto rounded border p-4">
          <h2 className="text-center mb-5">Create Product</h2>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Name</label>
              <div className="col-sm-8">
                <input className="form-control" name="name" />
                <span className="text-danger">{validationErrors.name}</span>
              </div>
            </div>

            {/* Brand */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Brand</label>
              <div className="col-sm-8">
                <input className="form-control" name="brand" />
                <span className="text-danger">{validationErrors.brand}</span>
              </div>
            </div>

            {/* Category */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Category</label>
              <div className="col-sm-8">
                <select className="form-select" name="category">
                  <option value="">Select Category</option>
                  <option value="Computers">Computers</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Printers">Printers</option>
                  <option value="Cameras">Cameras</option>
                  <option value="Other">Other</option>
                </select>
                <span className="text-danger">{validationErrors.category}</span>
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
                ></textarea>
                <span className="text-danger">
                  {validationErrors.description}
                </span>
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
                />
                <span className="text-danger">{validationErrors.price}</span>
              </div>
            </div>

            {/* Image */}
            <div className="row mb-3">
              <label className="col-sm-4 col-form-label">Image</label>
              <div className="col-sm-8">
                <input className="form-control" type="file" name="image" />
                <span className="text-danger">{validationErrors.image}</span>
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
