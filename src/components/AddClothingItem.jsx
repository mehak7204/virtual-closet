import { useState } from "react";

const AddClothingItem = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Shirt");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Please fill in all fields");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onAdd({
        id: Date.now(),
        name,
        category,
        image: reader.result,
      });

      // Reset form
      setName("");
      setCategory("Shirt");
      setImage(null);
      e.target.reset(); // Clear file input
    };

    reader.readAsDataURL(image);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Add Clothing Item</h2>

      <input
        type="text"
        placeholder="Clothing Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Shirt">Shirt</option>
        <option value="Pants">Pants</option>
        <option value="Dress">Dress</option>
        <option value="Jacket">Jacket</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddClothingItem;
