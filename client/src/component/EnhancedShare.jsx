import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFacebook, 
  FaTwitter, 
  FaWhatsapp, 
  FaInstagram,
  FaCopy,
  FaQrcode,
  FaTimes,
  FaDownload
} from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';

const EnhancedShare = ({ recipe, onClose }) => {
  const [shareContent, setShareContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  React.useEffect(() => {
    if (recipe && recipe._id) {
      // Always try to fetch share content since we're handling it locally now
      fetchShareContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  const fetchShareContent = async () => {
    setLoading(true);
    try {
      console.log('Fetching share content for recipe:', recipe);
      console.log('Recipe ID:', recipe._id);
      console.log('Recipe ID length:', recipe._id?.length);
      console.log('Recipe ID type:', typeof recipe._id);
      
      if (!recipe._id) {
        throw new Error('Recipe ID is missing');
      }
      
      // Ensure the ID is properly formatted
      const recipeId = String(recipe._id).trim();
      console.log('Cleaned recipe ID:', recipeId);
      console.log('Cleaned recipe ID length:', recipeId.length);
      
      // Since the server share endpoint isn't deployed yet, create share content locally
      const baseUrl = window.location.origin;
      const creatorName = recipe.userId?.profile?.displayName || recipe.userId?.username || 'Unknown Chef';
      
      const shareContent = {
        title: recipe.strMeal || recipe.title,
        description: recipe.strInstructions || recipe.description || `Delicious ${recipe.category || 'recipe'} by ${creatorName}`,
        url: `${baseUrl}/recipe/${recipe.idMeal || recipeId}`,
        image: recipe.strMealThumb || recipe.image || '',
        creator: recipe.idMeal ? 'TheMealDB' : creatorName,
        prepTime: recipe.prepTime || 30,
        servings: recipe.servings || 4,
        ingredients: recipe.strIngredient1 ? 
          [recipe.strIngredient1, recipe.strIngredient2, recipe.strIngredient3].filter(Boolean).join(', ') :
          (typeof recipe.ingredients === 'string' ? recipe.ingredients.split('\n').slice(0, 5).join(', ') : 'Various ingredients'),
        
        templates: {
          whatsapp: `🍽️ *${recipe.title}* by ${creatorName}\n\n📝 ${recipe.description || 'Delicious homemade recipe'}\n\n⏱️ Prep time: ${recipe.prepTime || 30} mins\n👥 Serves: ${recipe.servings || 4}\n\n🥘 Key ingredients: ${typeof recipe.ingredients === 'string' ? recipe.ingredients.split('\n').slice(0, 3).join(', ') : 'Various ingredients'}\n\nTry this amazing recipe: ${baseUrl}/recipe/${recipeId}`,
          
          facebook: `🍽️ Just discovered this amazing ${recipe.category || 'recipe'}: "${recipe.title}" by ${creatorName}!\n\n${recipe.description || 'A delicious homemade recipe perfect for any occasion.'}\n\n⏱️ ${recipe.prepTime || 30} minutes | 👥 Serves ${recipe.servings || 4}\n\nCheck it out and try it yourself! 👨‍🍳👩‍🍳`,
          
          twitter: `🍽️ Amazing ${recipe.category || 'recipe'}: "${recipe.title}" by ${creatorName}\n\n⏱️ ${recipe.prepTime || 30}min | 👥 Serves ${recipe.servings || 4}\n\n#Recipe #Cooking #Homemade #${(recipe.category || 'food').toLowerCase()}`,
          
          instagram: `🍽️ ${recipe.title}\nBy: ${creatorName}\n\n${recipe.description || 'Delicious homemade recipe'}\n\n⏱️ Prep: ${recipe.prepTime || 30} mins\n👥 Serves: ${recipe.servings || 4}\n\n#recipe #cooking #homemade #foodie #${(recipe.category || 'food').toLowerCase()}`
        }
      };
      
      setShareContent(shareContent);
      return;
      
      // Original server call (commented out until server is updated)
      /*
      
      const shareUrl = `https://recipedia-2si5.onrender.com/api/recipes/${recipeId}/share`;
      console.log('Making request to:', shareUrl);
      
      const response = await axios.get(shareUrl);
      setShareContent(response.data);
      */
    } catch (error) {
      console.error('Error fetching share content:', error);
      console.error('Recipe object:', recipe);
      
      if (error.response?.status === 400) {
        toast.error('Invalid recipe ID format');
      } else if (error.response?.status === 404) {
        toast.error('Recipe not found');
      } else {
        toast.error('Failed to generate share content');
      }
    } finally {
      setLoading(false);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      color: '#25D366',
      action: () => shareToWhatsApp()
    },
    {
      name: 'Facebook',
      icon: <FaFacebook />,
      color: '#1877F2',
      action: () => shareToFacebook()
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      color: '#1DA1F2',
      action: () => shareToTwitter()
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      color: '#E4405F',
      action: () => shareToInstagram()
    },
    {
      name: 'Copy Link',
      icon: <FaCopy />,
      color: '#6c757d',
      action: () => copyToClipboard()
    },
    {
      name: 'QR Code',
      icon: <FaQrcode />,
      color: '#495057',
      action: () => setShowQR(true)
    }
  ];

  const shareToWhatsApp = () => {
    if (!shareContent) return;
    const text = encodeURIComponent(shareContent.templates.whatsapp);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    if (!shareContent) return;
    const url = encodeURIComponent(shareContent.url);
    const quote = encodeURIComponent(shareContent.templates.facebook);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank');
  };

  const shareToTwitter = () => {
    if (!shareContent) return;
    const text = encodeURIComponent(shareContent.templates.twitter);
    const url = encodeURIComponent(shareContent.url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToInstagram = () => {
    if (!shareContent) return;
    setSelectedPlatform('instagram');
    // Instagram doesn't support direct sharing via URL, so we'll show instructions
    toast.info('Instagram content copied! Paste it when sharing your post or story.');
    navigator.clipboard.writeText(shareContent.templates.instagram);
  };

  const copyToClipboard = () => {
    if (!shareContent) return;
    navigator.clipboard.writeText(shareContent.url);
    toast.success('Recipe link copied to clipboard!');
  };

  const downloadRecipeCard = () => {
    // Create a downloadable recipe card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 1000;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add recipe content
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(recipe.title, 40, 60);

    ctx.font = '18px Arial';
    ctx.fillText(`By: ${shareContent?.creator || 'Unknown'}`, 40, 100);
    ctx.fillText(`Prep Time: ${recipe.prepTime} mins | Serves: ${recipe.servings}`, 40, 130);

    // Add ingredients
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Ingredients:', 40, 180);
    
    ctx.font = '16px Arial';
    let yPos = 210;
    recipe.ingredients.forEach((ingredient, index) => {
      if (yPos < 900) {
        ctx.fillText(`• ${ingredient.amount} ${ingredient.name}`, 40, yPos);
        yPos += 25;
      }
    });

    // Download
    const link = document.createElement('a');
    link.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('Recipe card downloaded!');
  };

  if (loading) {
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
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍳</div>
          <p>Preparing share content...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        key="share-modal"
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
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
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

          <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#333' }}>
            Share Recipe
          </h2>

          {shareContent && (
            <>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  {shareContent.title}
                </h3>
                <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                  By {shareContent.creator} • {shareContent.prepTime} mins • Serves {shareContent.servings}
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={option.action}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '1rem',
                      backgroundColor: option.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    <div style={{ fontSize: '1.5rem' }}>
                      {option.icon}
                    </div>
                    {option.name}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadRecipeCard}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#e67e22',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaDownload />
                Download Recipe Card
              </motion.button>

              {selectedPlatform === 'instagram' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#e4405f',
                    color: 'white',
                    borderRadius: '8px'
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>Instagram Sharing</h4>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}>
                    The caption has been copied to your clipboard. Open Instagram and paste it when creating your post or story!
                  </p>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>

      {/* QR Code Modal */}
      {showQR && shareContent && (
        <motion.div
          key="qr-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1001
          }}
          onClick={() => setShowQR(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem 0' }}>Scan to View Recipe</h3>
            <QRCodeSVG
              value={shareContent.url}
              size={200}
              level="H"
              includeMargin
            />
            <p style={{ margin: '1rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              Scan with your phone camera to open the recipe
            </p>
            <button
              onClick={() => setShowQR(false)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default EnhancedShare;