import React from 'react';
import { motion } from 'framer-motion';
import { FaUtensils } from 'react-icons/fa';

// Lightweight loader - reduced animations for faster LCP
const FoodLoader = () => {
  // Simplified to just 4 icons for faster rendering
  const foodIcons = [
    { emoji: '🍕', delay: 0 },
    { emoji: '🍔', delay: 0.15 },
    { emoji: '🍰', delay: 0.3 },
    { emoji: '🍪', delay: 0.45 }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem'
    }}>
      {/* Simplified animated food emojis */}
      <div style={{
        position: 'relative',
        width: '150px',
        height: '150px',
        marginBottom: '1.5rem'
      }}>
        {foodIcons.map(({ emoji, delay }, index) => {
          const angle = (index / foodIcons.length) * 2 * Math.PI;
          const radius = 50;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                fontSize: '2rem',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {emoji}
            </motion.div>
          );
        })}

        {/* Center spinning icon */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(230, 126, 34, 0.3)'
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <FaUtensils size={20} color="white" />
        </motion.div>
      </div>

      {/* Simplified loading text */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#2c3e50',
          marginBottom: '0.5rem',
          fontWeight: '600'
        }}>
          Loading Recipes
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#7f8c8d'
        }}>
          Just a moment...
        </p>
      </div>
    </div>
  );
};

export default FoodLoader;
