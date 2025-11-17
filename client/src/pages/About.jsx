import recipe1 from '../images/recipe1.jpg';
import recipe2 from '../images/recipe2.jpg';
import recipe3 from '../images/recipe3.jpg';

const About = () => {
  const scrollToContent = () => {
    const contentSection = document.querySelector('.content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Lato:wght@300;400&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .about-landing {
          background: linear-gradient(to bottom, #fdfbf7 0%, #ffffff 100%);
          min-height: 100vh;
          overflow-x: hidden;
          margin-top: -85px;
        }

        /* Hero Section with Image */
        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-background img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7);
          animation: slowZoom 20s ease-in-out infinite alternate;
        }

        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(139,69,19,0.3) 100%);
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          color: white;
          padding: 2rem;
          max-width: 900px;
          animation: fadeInUp 1.2s ease-out;
        }

        .hero-content h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4.5rem;
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          text-shadow: 2px 4px 12px rgba(0,0,0,0.3);
          letter-spacing: 1px;
        }

        .hero-content p {
          font-family: 'Lato', sans-serif;
          font-size: 1.4rem;
          font-weight: 300;
          line-height: 1.7;
          text-shadow: 1px 2px 8px rgba(0,0,0,0.4);
          max-width: 700px;
          margin: 0 auto;
        }

        /* Scroll Down Button */
        .scroll-down-btn {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          animation: fadeInUp 1.5s ease-out 0.8s both;
          transition: all 0.3s ease;
        }

        .scroll-down-btn:hover {
          transform: translateX(-50%) translateY(5px);
        }

        .scroll-down-btn span {
          font-family: 'Lato', sans-serif;
          font-size: 0.85rem;
          color: white;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 400;
          text-shadow: 1px 2px 6px rgba(0,0,0,0.3);
        }

        .scroll-arrow {
          width: 30px;
          height: 50px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          position: relative;
          display: flex;
          justify-content: center;
          padding-top: 8px;
        }

        .scroll-arrow::before {
          content: '';
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: scrollDot 2s infinite;
        }

        @keyframes scrollDot {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(20px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Content Section */
        .content-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }

        /* Image Gallery with Text Integration */
        .gallery-text-blend {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 5rem;
        }

        .gallery-images {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          position: relative;
        }

        .gallery-img {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gallery-img:nth-child(1) {
          grid-column: 1 / 3;
          animation: fadeInLeft 1s ease-out 0.2s both;
        }

        .gallery-img:nth-child(2) {
          animation: fadeInLeft 1s ease-out 0.4s both;
        }

        .gallery-img:nth-child(3) {
          animation: fadeInLeft 1s ease-out 0.6s both;
        }

        .gallery-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s ease;
        }

        .gallery-img:nth-child(1) img {
          height: 320px;
        }

        .gallery-img:nth-child(2) img,
        .gallery-img:nth-child(3) img {
          height: 240px;
        }

        .gallery-img:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 50px rgba(0,0,0,0.15);
        }

        .gallery-img:hover img {
          transform: scale(1.08);
        }

        .text-content {
          padding: 2rem;
          animation: fadeInRight 1s ease-out 0.3s both;
        }

        .text-content h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 600;
          color: #2c1810;
          margin-bottom: 2rem;
          line-height: 1.3;
        }

        .text-content p {
          font-family: 'Lato', sans-serif;
          font-size: 1.1rem;
          line-height: 1.9;
          color: #4a4a4a;
          margin-bottom: 1.8rem;
          font-weight: 300;
        }

        .text-content p:last-child {
          margin-bottom: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .hero-content h1 {
            font-size: 3.5rem;
          }

          .hero-content p {
            font-size: 1.2rem;
          }

          .content-section {
            padding: 4rem 2rem;
          }

          .gallery-text-blend {
            gap: 3rem;
          }

          .text-content h2 {
            font-size: 2.5rem;
          }

          .text-content p {
            font-size: 1.05rem;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .scroll-down-btn {
            display: none;
          }

          .about-landing {
            margin-top: -80px;
          }

          .hero-section {
            height: 100vh;
            min-height: 480px;
          }

          .hero-content {
            padding: 2rem 1.5rem;
          }

          .hero-content h1 {
            font-size: 2.2rem;
            margin-bottom: 1.2rem;
            line-height: 1.25;
          }

          .hero-content p {
            font-size: 1.05rem;
            line-height: 1.65;
          }

          .content-section {
            padding: 3rem 1.5rem 4rem;
          }

          .gallery-text-blend {
            grid-template-columns: 1fr;
            gap: 0;
            margin-bottom: 0;
          }

          /* Hide image gallery on mobile */
          .gallery-images {
            display: none;
          }

          .text-content {
            order: 1;
            padding: 2rem 1rem;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          }

          .text-content h2 {
            font-size: 2.2rem;
            margin-bottom: 1.8rem;
            text-align: center;
            color: #2c1810;
          }

          .text-content p {
            font-size: 1.02rem;
            line-height: 1.85;
            margin-bottom: 1.6rem;
            text-align: left;
            color: #4a4a4a;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 100vh;
            min-height: 420px;
          }

          .hero-content {
            padding: 1.5rem 1.2rem;
          }

          .hero-content h1 {
            font-size: 1.85rem;
            line-height: 1.3;
            margin-bottom: 1rem;
          }

          .hero-content p {
            font-size: 0.98rem;
            line-height: 1.6;
          }

          .content-section {
            padding: 2.5rem 1rem 3rem;
          }

          .text-content {
            padding: 1.8rem 1rem;
            border-radius: 12px;
          }

          .text-content h2 {
            font-size: 1.85rem;
            margin-bottom: 1.5rem;
          }

          .text-content p {
            font-size: 0.97rem;
            line-height: 1.8;
            margin-bottom: 1.4rem;
          }
        }

        @media (max-width: 380px) {
          .hero-content h1 {
            font-size: 1.65rem;
          }

          .hero-content p {
            font-size: 0.92rem;
          }

          .text-content {
            padding: 1.5rem 0.8rem;
          }

          .text-content h2 {
            font-size: 1.65rem;
          }

          .text-content p {
            font-size: 0.93rem;
            line-height: 1.75;
          }
        }
      `}</style>

      <div className="about-landing">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <img src={recipe1} alt="Delicious recipes" />
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>For the Heart of Every Home: Moms Who Make Magic</h1>
            <p>
              Discover inspiration, break the routine, and bring joy to your family's table with every delicious discovery.
            </p>
          </div>
          
          {/* Scroll Down Button - Desktop Only */}
          <div className="scroll-down-btn" onClick={scrollToContent}>
            <span>Scroll</span>
            <div className="scroll-arrow"></div>
          </div>
        </section>

        {/* Content Section */}
        <section className="content-section">
          <div className="gallery-text-blend">
            {/* Gallery */}
            <div className="gallery-images">
              <div className="gallery-img">
                <img src={recipe2} alt="Recipe inspiration" />
              </div>
              <div className="gallery-img">
                <img src={recipe3} alt="Culinary creativity" />
              </div>
              <div className="gallery-img">
                <img src={recipe1} alt="Family meals" />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-content">
              <h2>Why Recipedia?</h2>
              <p>
                In the ever-evolving theatre of family life, it is the mother who dons the mantle of culinary innovator, especially on those languorous Sundays and the inevitable days when children, with their insatiable curiosity, yearn for something beyond the quotidian. Recipedia is not merely a compendium of recipes, it is a celebration of maternal ingenuity, a digital ally for every mom who wishes to transform the refrain of "not the same food again!" into an opportunity for delight and discovery.
              </p>
              <p>
                Here, inspiration is perennial. Whether you are orchestrating a swift weekday meal or curating a Sunday feast that lingers in memory, Recipedia empowers you to break the cycle of repetition and infuse your kitchen with creativity. For every mother seeking to enchant her family's palate and for every child who dreams of variety, this platform is your passport to a world where every meal is a new adventure, and every table, a stage for joy.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
