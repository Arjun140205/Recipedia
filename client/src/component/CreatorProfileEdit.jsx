import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTimes, 
  FaUser, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaEdit,
  FaCamera,
  FaSave,
  FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../styles/dashboard.css';

const CreatorProfileEdit = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: '',
    location: '',
    specialties: [],
    avatar: null
  });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.profile?.displayName || user.username || '',
        email: user.email || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        specialties: user.profile?.specialties || [],
        avatar: null
      });
      setAvatarPreview(user.profile?.avatar || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtiesChange = (e) => {
    const specialties = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      specialties
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        avatar: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'specialties') {
          formDataToSend.append(key, formData[key].join(','));
        } else if (key === 'avatar' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'avatar') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://recipedia-2si5.onrender.com/api/user/profile',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Profile updated successfully!');
      onUpdate(response.data.user);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: window.innerWidth < 768 ? '1.5rem' : '2rem',
          maxWidth: '600px',
          width: window.innerWidth < 768 ? '95%' : '90%',
          maxHeight: '95vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <FaTimes />
        </button>

        <h2 style={{ marginTop: 0, marginBottom: '2rem', color: '#333' }}>
          <FaEdit style={{ marginRight: '0.5rem' }} />
          Edit Creator Profile
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Avatar Upload */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '3px solid #e67e22',
                margin: '0 auto'
              }}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <FaUser size={40} color="#ccc" />
                )}
              </div>
              <label style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                backgroundColor: '#e67e22',
                color: 'white',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid white'
              }}>
                <FaCamera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
              Click camera icon to upload profile picture
            </p>
          </div>

          {/* Display Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              <FaUser style={{ marginRight: '0.5rem' }} />
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Your display name"
              className="profile-input"
              required
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              <FaEnvelope style={{ marginRight: '0.5rem' }} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className="profile-input"
            />
          </div>

          {/* Location */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              className="profile-input"
            />
          </div>

          {/* Bio */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself, your cooking style, and what makes you passionate about food..."
              rows={4}
              maxLength={500}
              className="profile-textarea"
            />
            <small style={{ color: '#666' }}>
              {formData.bio.length}/500 characters
            </small>
          </div>

          {/* Specialties */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Specialties
            </label>
            <input
              type="text"
              value={formData.specialties.join(', ')}
              onChange={handleSpecialtiesChange}
              placeholder="e.g., Italian, Vegan, Baking, Desserts"
              className="profile-input"
            />
            <small style={{ color: '#666' }}>
              Separate multiple specialties with commas
            </small>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? '#ccc' : '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <FaSpinner className="fa-spin" />
                Updating Profile...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreatorProfileEdit;