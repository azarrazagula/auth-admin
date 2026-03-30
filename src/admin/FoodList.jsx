import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import API_BASE_URL from '../config';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', description: '', category: '', price: '', image: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sa_accessToken') || localStorage.getItem('accessToken');
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/admin/food`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setFoods(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch foods');
      }
    } catch (err) {
      setError('An error occurred while fetching foods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      setNewFood(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sa_accessToken') || localStorage.getItem('accessToken');
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/admin/food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFood),
      });
      const data = await response.json();
      if (data.success) {
        setFoods([...foods, data.data]);
        setNewFood({ name: '', description: '', category: '', price: '', image: '' });
        setImagePreview(null);
        setShowAddForm(false);
        alert('Food added successfully!');
      } else {
        alert(data.message || 'Failed to add food');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleDeleteFood = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('sa_accessToken') || localStorage.getItem('accessToken');
      const apiBase = API_BASE_URL;
      const response = await fetch(`${apiBase}/api/admin/food/${selectedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setFoods(foods.filter(f => f._id !== selectedId));
        setModalOpen(false);
      } else {
        alert(data.message || 'Failed to delete food');
      }
    } catch (err) {
      alert('Error deleting food');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && foods.length === 0) return <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>;
  if (error && foods.length === 0) return <div className="error" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger-color)' }}>{error}</div>;

  return (
    <div className="food-list-container">
      <div className="sa-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Product Management</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? 'secondary' : 'primary'}
          >
            {showAddForm ? 'Cancel' : '+ Add Food'}
          </Button>
          <Button
            variant="glass"
            size="sm"
            onClick={handleRefresh}
            loading={loading && foods.length > 0}
            style={{ minWidth: '120px' }}
          >
             🔄 Refresh
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="user-table-wrapper" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Add New Food Item</h3>
          <form onSubmit={handleCreateFood} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <Input
              id="food-name"
              label="Food Name"
              type="text"
              value={newFood.name}
              onChange={e => setNewFood({ ...newFood, name: e.target.value })}
              required
            />
            <Input
              id="food-category"
              label="Category"
              type="text"
              value={newFood.category}
              onChange={e => setNewFood({ ...newFood, category: e.target.value })}
              required
            />
            <Input
              id="food-price"
              label="Price"
              type="number"
              value={newFood.price}
              onChange={e => setNewFood({ ...newFood, price: e.target.value })}
              required
            />
            <div className="sa-form-group">
              <label>Food Image</label>
              <input
                type="file"
                accept="image/*"
                className="sa-input"
                style={{ padding: '0.5rem' }}
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ marginTop: '0.5rem', width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
              )}
            </div>
            <div className="sa-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea
                className="sa-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                value={newFood.description}
                onChange={e => setNewFood({ ...newFood, description: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="sa-btn" style={{ padding: '0.75rem' }}>Create Product</button>
            </div>
          </form>
        </div>
      )}

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No products found.</td></tr>
            ) : (
              foods.map(food => (
                <tr key={food._id}>
                  <td>
                    <img src={food.image} alt={food.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                  </td>
                  <td>{food.name}</td>
                  <td>{food.category}</td>
                  <td>${food.price}</td>
                  <td>
                    <button className="delete-btn" onClick={() => openDeleteModal(food._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteFood}
        title="Confirm Deletion"
        message="Are you sure you want to remove this food item?"
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default FoodList;
