import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  const images = [
    '/images/recipe1.jpg',
    '/images/recipe2.jpg',
    '/images/recipe3.jpg',
    // Add more image paths as needed
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

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

  const carouselStyle = {
    marginBottom: '3rem',
  };

  const imageStyle = {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '12px',
  };

  const storyStyle = {
    backgroundColor: '#fff9f5',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  };

  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1 style={headingStyle}>Our Story</h1>
        <p style={subheadingStyle}>
          Discover the joy of cooking new recipes with your family
        </p>
      </div>

      <div style={carouselStyle}>
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Recipe ${index + 1}`} style={imageStyle} />
            </div>
          ))}
        </Slider>
      </div>

      <div style={storyStyle}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#e67e22' }}>
          For Every Sunday's "What Should We Cook Today?" Moment
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#34495e' }}>
          We've all been there - it's Sunday morning, and your children are already asking,
          "Mom, what's special for lunch today?" Or those weekends when they say,
          "Not the same food again!" That's exactly why we created Recipe Finder.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#34495e', marginTop: '1rem' }}>
          Our platform is dedicated to all the amazing moms who want to bring variety to their
          family's table. Whether you're looking for quick and easy recipes for busy weekdays,
          or special dishes to make weekends memorable, we've got you covered. No more
          repetitive meals, no more menu planning stress - just endless inspiration for
          delicious, family-friendly dishes that will make your children excited for mealtime.
        </p>
      </div>
    </div>
  );
};

export default About;
