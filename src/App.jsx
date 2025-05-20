import { useState, useEffect } from "react";
import AddClothingItem from "./components/AddClothingItem";
import "./App.css";

const categories = ["All", "Shirt", "Pants", "Dress", "Jacket"];

function App() {
  const [clothingItems, setClothingItems] = useState(() => {
    const saved = localStorage.getItem("clothingItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Track the item currently being edited (by id), or null if none
  const [editingItemId, setEditingItemId] = useState(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("clothingItems", JSON.stringify(clothingItems));
  }, [clothingItems]);

  // Add new item
  const handleAddItem = (item) => {
    setClothingItems([item, ...clothingItems]);
  };

  // Delete an item
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setClothingItems(clothingItems.filter((item) => item.id !== id));
    }
  };

  // Update an existing item
  const handleUpdate = (updatedItem) => {
    setClothingItems(
      clothingItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setEditingItemId(null);
  };

  // Filter items by category
  const filteredItems =
    selectedCategory === "All"
      ? clothingItems
      : clothingItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="app-container">
      <h1>🧥 My Virtual Closet</h1>

      {/* Show Add form only when NOT editing */}
      {!editingItemId && <AddClothingItem onAdd={handleAddItem} />}

      <hr />

      <h2>👚 Clothing Items</h2>

      {/* Category Filter Buttons */}
      <div className="filter-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="closet-grid">
          {filteredItems.map((item) => (
            <ClosetItem
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onEdit={() => setEditingItemId(item.id)}
            />
          ))}
        </div>
      )}

      {/* Edit form modal */}
      {editingItemId && (
        <EditClothingItem
          item={clothingItems.find((item) => item.id === editingItemId)}
          onCancel={() => setEditingItemId(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}

// New component to show each clothing item with Edit/Delete buttons
function ClosetItem({ item, onDelete, onEdit }) {
  return (
    <div className="closet-item">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.category}</p>
      <button className="edit-btn" onClick={onEdit}>
        Edit
      </button>
      <button className="delete-btn" onClick={() => onDelete(item.id)}>
        Delete
      </button>
    </div>
  );
}

// New component to edit clothing item
function EditClothingItem({ item, onCancel, onSave }) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [image, setImage] = useState(item.image);
  const [newImageFile, setNewImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !category || !image) {
      alert("Please fill all fields");
      return;
    }

    if (newImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave({ ...item, name, category, image: reader.result });
      };
      reader.readAsDataURL(newImageFile);
    } else {
      onSave({ ...item, name, category, image });
    }
  };

  return (
    <div className="edit-modal">
      <form onSubmit={handleSubmit} className="form">
        <h2>Edit Clothing Item</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Shirt">Shirt</option>
          <option value="Pants">Pants</option>
          <option value="Dress">Dress</option>
          <option value="Jacket">Jacket</option>
        </select>

        <div>
          <img src={image} alt={name} style={{ maxWidth: "150px" }} />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImageFile(e.target.files[0])}
        />

        <div style={{ marginTop: "10px" }}>
          <button type="submit">Save</button>{" "}
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
