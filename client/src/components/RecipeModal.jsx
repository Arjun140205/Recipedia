import { useState } from 'react';
import {
  FaTimes,
  FaStar,
  FaClock,
  FaFire,
  FaShare,
  FaPrint,
  FaList,
  FaChartLine,
  FaUtensils,
  FaCircle,
  FaPlay
} from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { resolveAssetUrl } from '../utils/resolveAssetUrl';

const RecipeModal = ({ recipe, onClose, onDelete, onUpdate, onRate, onShare, showQRCode, onQRCodeClose }) => {
  const [activeTab, setActiveTab] = useState('ingredients');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add safety check for recipe
  if (!recipe) {
    return null;
  }

  // handleDelete function commented out as it's not being used
  // const handleDelete = () => {
  //   setShowDeleteConfirm(true);
  // };

  const confirmDelete = () => {
    onDelete();
    onClose();
  };



  // Process ingredients and instructions with safety checks
  const ingredientsList = recipe.ingredients ? recipe.ingredients.split('\n').filter(Boolean) : [];
  const instructionsList = recipe.instructions ? recipe.instructions.split('\n').filter(Boolean) : [];

  // Add star rating display
  const StarDisplay = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          color={star <= (recipe.popularity || 0) ? '#FFD700' : '#ddd'}
          size={24}
          style={{ cursor: 'pointer' }}
          onClick={() => onRate(star)}
        />
      ))}
      <span style={{ marginLeft: '0.5rem', fontSize: '1.2rem' }}>
        {(recipe.popularity || 0).toFixed(1)}
      </span>
    </div>
  );

  return (
    <div style={{
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
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1
          }}
        >
          <FaTimes />
        </button>

        <div style={{ position: 'relative', height: '300px' }}>
          <img
            src={resolveAssetUrl(recipe.image)}
            alt={recipe.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '2rem',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '2rem' }}>{recipe.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FaClock />
                <span>{recipe.prepTime} mins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FaStar color="#FFD700" />
                <span>{recipe.popularity}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FaFire color="#FF4500" />
                <span>{recipe.category}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Video Section */}
          {recipe.video && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>
                <FaPlay style={{ marginRight: '0.5rem' }} />
                Recipe Video
              </h3>
              <video
                controls
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}
              >
                <source src={resolveAssetUrl(recipe.video)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => onShare(recipe)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaShare /> Share
            </button>
            <button
              onClick={() => window.print()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaPrint /> Print
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('ingredients')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === 'ingredients' ? '#e67e22' : '#f8f9fa',
                color: activeTab === 'ingredients' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FaList /> Ingredients
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === 'instructions' ? '#e67e22' : '#f8f9fa',
                color: activeTab === 'instructions' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FaUtensils /> Instructions
            </button>
            <button
              onClick={() => setActiveTab('popularity')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === 'popularity' ? '#e67e22' : '#f8f9fa',
                color: activeTab === 'popularity' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <FaChartLine /> Popularity
            </button>
          </div>

          {activeTab === 'ingredients' && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Ingredients</h3>
              {ingredientsList.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {ingredientsList.map((ingredient, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaCircle size={8} color="#e67e22" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#666' }}>No ingredients available</p>
              )}
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Instructions</h3>
              {instructionsList.length > 0 ? (
                <ol style={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
                  {instructionsList.map((instruction, index) => (
                    <li key={index} style={{ marginBottom: '1rem', color: '#666' }}>
                      {instruction}
                    </li>
                  ))}
                </ol>
              ) : (
                <p style={{ color: '#666' }}>No instructions available</p>
              )}
            </div>
          )}

          {activeTab === 'popularity' && (
            <div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Rate this Recipe</h3>
              <StarDisplay />
            </div>
          )}
        </div>
      </div>



      {showQRCode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Scan QR Code</h3>
            <QRCodeSVG
              value={window.location.href}
              size={200}
              level="H"
              includeMargin
            />
            <p style={{ margin: '1rem 0 0 0', color: '#666' }}>
              Scan this QR code to view the recipe on your mobile device
            </p>
            <button
              onClick={onQRCodeClose}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1001,
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          <h3 style={{ marginTop: 0 }}>Delete Recipe</h3>
          <p>Are you sure you want to delete "{recipe.title}"? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeModal;
