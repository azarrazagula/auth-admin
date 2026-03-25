import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', category: '', price: '', image: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sa_accessToken') || localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/admin/food', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setFoods(data.foods || []);
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
  }, []);

  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sa_accessToken') || localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/admin/food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFood),
      });
      const data = await response.json();
      if (data.success) {
        setFoods([...foods, data.food]);
        setNewFood({ name: '', category: '', price: '', image: '' });
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
      const response = await fetch(`http://localhost:5001/api/admin/food/${selectedId}`, {
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

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="food-list-container">
      <div className="sa-page-header">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Product Management</h2>
        <button 
          className="refresh-btn" 
          style={{ width: 'auto', background: 'var(--primary-color)', color: 'white' }} 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Food'}
        </button>
      </div>

      {showAddForm && (
        <div className="user-table-wrapper" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Add New Food Item</h3>
          <form onSubmit={handleCreateFood} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="sa-form-group">
              <label>Food Name</label>
              <input 
                type="text" 
                className="sa-input" 
                value={newFood.name} 
                onChange={e => setNewFood({...newFood, name: e.target.value})} 
                required 
              />
            </div>
            <div className="sa-form-group">
              <label>Category</label>
              <input 
                type="text" 
                className="sa-input" 
                value={newFood.category} 
                onChange={e => setNewFood({...newFood, category: e.target.value})} 
                required 
              />
            </div>
            <div className="sa-form-group">
              <label>Price</label>
              <input 
                type="number" 
                className="sa-input" 
                value={newFood.price} 
                onChange={e => setNewFood({...newFood, price: e.target.value})} 
                required 
              />
            </div>
            <div className="sa-form-group">
              <label>Image URL</label>
              <input 
                type="text" 
                className="sa-input" 
                value={newFood.image} 
                onChange={e => setNewFood({...newFood, image: e.target.value})} 
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
