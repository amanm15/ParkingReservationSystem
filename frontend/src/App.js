import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    licensePlate: '',
    spotNumber: '',
    date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setMessage('Error fetching reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData = {
        ...formData,
        spotNumber: parseInt(formData.spotNumber)
      };
      
      if (editingId) {
        // Update existing reservation
        await axios.put(`/api/reservations/${editingId}`, submitData);
        setMessage('Reservation updated successfully!');
        setEditingId(null);
      } else {
        // Create new reservation
        await axios.post('/api/reservations', submitData);
        setMessage('Reservation created successfully!');
      }
      
      setFormData({ name: '', licensePlate: '', spotNumber: '', date: '' });
      fetchReservations(); // Refresh the list
    } catch (error) {
      console.error('Error saving reservation:', error);
      setMessage(error.response?.data?.error || 'Error saving reservation');
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await axios.delete(`/api/reservations/${id}`);
        setMessage('Reservation deleted successfully!');
        fetchReservations(); // Refresh the list
      } catch (error) {
        console.error('Error deleting reservation:', error);
        setMessage('Error deleting reservation');
      }
    }
  };

  const editReservation = (reservation) => {
    setFormData({
      name: reservation.name,
      licensePlate: reservation.licensePlate,
      spotNumber: reservation.spotNumber.toString(),
      date: reservation.date
    });
    setEditingId(reservation.id);
    setMessage('');
    // Scroll to form
    document.querySelector('.reservation-form').scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', licensePlate: '', spotNumber: '', date: '' });
    setMessage('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚗 Parking Reservation System</h1>
        <p>Reserve your parking spot easily</p>
      </header>

      <main className="main-content">
        {/* Reservation Form */}
        <section className="reservation-form">
          <h2>{editingId ? 'Edit Reservation' : 'Make a Reservation'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="licensePlate">License Plate:</label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                required
                placeholder="e.g. ABC123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="spotNumber">Parking Spot Number:</label>
              <select
                id="spotNumber"
                name="spotNumber"
                value={formData.spotNumber}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a spot</option>
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Spot {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Reservation Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Reservation' : 'Reserve Spot')}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel Edit
              </button>
            )}
          </form>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </section>

        {/* Reservations List */}
        <section className="reservations-list">
          <h2>Current Reservations</h2>
          {loading && <p>Loading...</p>}
          
          {reservations.length === 0 ? (
            <p className="no-reservations">No reservations found</p>
          ) : (
            <div className="reservations-grid">
              {reservations.map(reservation => (
                <div key={reservation.id} className="reservation-card">
                  <div className="reservation-header">
                    <h3>{reservation.name}</h3>
                    <div className="action-buttons">
                      <button 
                        onClick={() => editReservation(reservation)}
                        className="edit-btn"
                        title="Edit reservation"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteReservation(reservation.id)}
                        className="delete-btn"
                        title="Delete reservation"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                  <div className="reservation-details">
                    <p><strong>License Plate:</strong> {reservation.licensePlate}</p>
                    <p><strong>Spot:</strong> #{reservation.spotNumber}</p>
                    <p><strong>Date:</strong> {reservation.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;