import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import recipe1 from '../images/recipe1.jpg';
import recipe2 from '../images/recipe2.jpg';
import recipe3 from '../images/recipe3.jpg';

const About = () => {
  const images = [
    recipe1,
    recipe2,
    recipe3,
    // Add more image imports as needed
  ];

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  };

  const heroStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  };

  const subheadingStyle = {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto',
  };

  const carouselContainerStyle = {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  };

  const imageStyle = {
    width: '350px',
    maxWidth: '90vw',
    height: '350px',
    objectFit: 'cover',
    borderRadius: '18px',
    boxShadow: '0 4px 16px rgba(44,62,80,0.10)',
    border: '3px solid #fff',
    background: '#fff',
    transition: 'transform 0.3s',
  };

  const storyStyle = {
    backgroundColor: '#fff9f5',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroStyle}>
        <h1 style={{ ...headingStyle, fontSize: '2.4rem', marginBottom: '1.2rem', fontFamily: 'inherit' }}>
          For the Heart of Every Home: Moms Who Make Magic
        </h1>
        <p style={{ ...subheadingStyle, fontSize: '1.1rem', fontStyle: 'normal', color: '#b9770e' }}>
          Discover inspiration, break the routine, and bring joy to your family's table with every delicious discovery.
        </p>
      </div>

      {/* Images Section */}
      <div style={carouselContainerStyle}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Recipe ${index + 1}`}
            style={imageStyle}
          />
        ))}
      </div>
      <style>{`
        @media (max-width: 700px) {
          div[style*='display: flex'] {
            flex-wrap: nowrap !important;
            overflow-x: auto;
            gap: 1rem !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            justify-content: flex-start !important;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          div[style*='display: flex'] img {
            width: 85vw !important;
            max-width: 320px !important;
            height: 180px !important;
            min-width: 220px;
            object-fit: cover;
            border-radius: 14px;
          }
        }
      `}</style>

      {/* Story/Mission Section */}
      <div style={storyStyle}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1.2rem', color: '#e67e22', fontFamily: 'inherit' }}>
          Why Recipedia?
        </h2>
        <p style={{ fontSize: '1.08rem', lineHeight: '1.8', color: '#34495e' }}>
          In the ever-evolving theatre of family life, it is the mother who dons the mantle of culinary innovator, especially on those languorous Sundays and the inevitable days when children, with their insatiable curiosity, yearn for something beyond the quotidian. Recipedia is not merely a compendium of recipes, it is a celebration of maternal ingenuity, a digital ally for every mom who wishes to transform the refrain of "not the same food again!" into an opportunity for delight and discovery.
        </p>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#34495e', marginTop: '1.1rem' }}>
          Here, inspiration is perennial. Whether you are orchestrating a swift weekday meal or curating a Sunday feast that lingers in memory, Recipedia empowers you to break the cycle of repetition and infuse your kitchen with creativity. For every mother seeking to enchant her family's palate and for every child who dreams of variety, this platform is your passport to a world where every meal is a new adventure, and every table, a stage for joy.
        </p>
      </div>
    </div>
  );
};

export default About;
