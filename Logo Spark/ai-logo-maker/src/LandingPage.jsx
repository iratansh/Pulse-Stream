import React from "react";
import NavigationBar from "./Navbar";
import Footer from "./Footer";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import logoSparkImage from "./assets/generated_logos/logo_spark.png";
import arrowImage from "./assets/generated_logos/arrow.png";
import balloonImage from "./assets/generated_logos/balloon.png";
import boltImage from "./assets/generated_logos/bolt.png";
import explosionImage from "./assets/generated_logos/explosion.png";
import financeImage from "./assets/generated_logos/finance.png";
import galaxyImage from "./assets/generated_logos/galaxy.png";
import someStuffImage from "./assets/generated_logos/some_stuff.png";
import airPlaneImage from "./assets/generated_logos/airplane.png";
import carImage from "./assets/generated_logos/car.png";
import carBrandImage from "./assets/generated_logos/car_brand.png";
import crescentImage from "./assets/generated_logos/crescent.png";
import crossImage from "./assets/generated_logos/cross.png";
import fireImage from "./assets/generated_logos/fire.png";
import heartImage from "./assets/generated_logos/heart.png";
import maskImage from "./assets/generated_logos/mask.png";
import rocketImage from "./assets/generated_logos/rocket.png";
import starImage from "./assets/generated_logos/star.png";
import sunImage from "./assets/generated_logos/sun.png";
import sunRiseImage from "./assets/generated_logos/sunrise.png";
import travelImage from "./assets/generated_logos/travel.png";
import trophyImage from "./assets/generated_logos/trophy.png";

const AutoPlayPlugin = (slider) => {
  let timeout;
  let mouseOver = false;
  function clearNextTimeout() {
    clearTimeout(timeout);
  }
  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 2000);
  }
  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};

export default function LandingPage() {
  const navigate = useNavigate();
  const carouselIconComponents = [
    airPlaneImage,
    carImage,
    crescentImage,
    carBrandImage,
    crossImage,
    fireImage,
    heartImage,
    travelImage,
    trophyImage,
    sunImage,
    maskImage,
  ];

  // Updated slider configuration
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      rtl: false,
      slides: {
        perView: 5,
        spacing: 20, 
      },
      breakpoints: {
        "(max-width: 1200px)": {
          slides: {
            perView: 4,
            spacing: 20,
          },
        },
        "(max-width: 900px)": {
          slides: {
            perView: 3,
            spacing: 20,
          },
        },
        "(max-width: 600px)": {
          slides: {
            perView: 2,
            spacing: 15,
          },
        },
      },
    },
    [AutoPlayPlugin]
  );

  // Logo gallery slider
  const [logoSliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 3,
      spacing: 20,
    },
    breakpoints: {
      "(max-width: 1200px)": {
        slides: {
          perView: 3,
          spacing: 20,
        },
      },
      "(max-width: 900px)": {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
      "(max-width: 600px)": {
        slides: {
          perView: 1,
          spacing: 15,
        },
      },
    },
  });

  // Logo gallery data
  const logoGalleryItems = [
    {
      img: logoSparkImage,
      title: "Logo Spark",
      description: "Our own AI-generated logo showcasing creativity and innovation",
      primary: true,
    },
    {
      img: galaxyImage,
      title: "Galaxy",
      description: "Space-inspired design for tech and innovation companies",
    },
    {
      img: financeImage,
      title: "Finance",
      description: "Professional logo perfect for financial institutions",
    },
    {
      img: boltImage,
      title: "Bolt",
      description: "Energetic design for dynamic and fast-paced brands",
    },
    {
      img: arrowImage,
      title: "Arrow",
      description: "Forward-thinking logo for growth-oriented businesses",
    },
    {
      img: balloonImage,
      title: "Balloon",
      description: "Playful design for entertainment and children's brands",
    },
    {
      img: explosionImage,
      title: "Explosion",
      description: "Impactful design that makes your brand stand out",
    },
    {
      img: someStuffImage,
      title: "Abstract",
      description: "Modern abstract design for creative industries",
    },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <div className="hero-wrapper">
        <NavigationBar />
        <section className="hero-section">
          <div className="content-container">
            <div className="text-container">
              <h2 className="heading">Create a logo in minutes</h2>
              <p className="description">
                Our AI-powered logo maker will help you create a beautiful logo
                for your brand in minutes. No design skills needed.
              </p>
              <button className="primary-button" onClick={() => navigate('/logo-maker')}>Get Started</button>
            </div>
          </div>
        </section>
      </div>

      {/* SLIDER SECTION */}
      <div className="slider-wrapper">
        <section className="slider-section">
          <div className="carousel-container">
            <div ref={sliderRef} className="keen-slider">
              {carouselIconComponents.map((iconSrc, index) => (
                <div className="keen-slider__slide slider-item" key={index}>
                  <div className="icon-container" style={{ backgroundColor: "#3b82f6"}}>
                    <img 
                      src={iconSrc} 
                      alt={`Logo Example ${index + 1}`} 
                      className="carousel-icon" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* EXAMPLES SECTION */}
      <div className="examples-wrapper">
        <section className="examples-section">
          <div className="content-container">
            <h2 className="section-title">
              Transform Your Brand Identity with AI Innovation
            </h2>
            <p className="section-subtitle">
              See how industry leaders have leveraged our platform
            </p>

            <div className="example-item">
              <div className="example-content">
                <div className="text-container left-align">
                  <h3>Modern Aesthetics</h3>
                  <p>
                    Craft clean, contemporary designs that resonate with modern
                    audiences. Our AI analyzes current design trends to deliver
                    timeless logos.
                  </p>
                </div>
                <div className="icon-container">
                  <img src={rocketImage} alt="Rocket Image" className="example-icon" />
                </div>
              </div>
            </div>

            <div className="example-item">
              <div className="example-content reverse">
                <div className="icon-container">
                  <img src={starImage} alt="Star Image" className="example-icon" />
                </div>
                <div className="text-container right-align">
                  <h3>Premium Quality</h3>
                  <p>
                    Generate professional-grade logos with perfect symmetry and
                    balance. Our algorithm ensures pixel-perfect precision in
                    every creation.
                  </p>
                </div>
              </div>
            </div>

            <div className="example-item">
              <div className="example-content">
                <div className="text-container left-align">
                  <h3>Enterprise Ready</h3>
                  <p>
                    Scale your branding efforts with solutions that grow with
                    your business. Export in multiple formats for any
                    application.
                  </p>
                </div>
                <div className="icon-container">
                  <img src={sunRiseImage} alt="Sunrise Image" className="example-icon" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* LOGO SHOWCASE SECTION */}
      <div className="logo-showcase-wrapper">
        <section className="logo-showcase-section">
          <div className="content-container">
            <h2 className="section-title">AI-Generated Logo Gallery</h2>
            <p className="section-subtitle">
              Browse through our collection of AI-generated logos and imagine what we can create for your brand
            </p>

            {/* Featured Logo - Logo Spark */}
            <div className="featured-logo">
              <div className="featured-logo-content">
                <div className="featured-logo-image">
                  <img src={logoSparkImage} alt="Logo Spark" />
                </div>
                <div className="featured-logo-text">
                  <h3>Meet Logo Spark</h3>
                  <p>
                    Our flagship AI-generated logo represents our commitment to creativity, 
                    innovation, and quality design. This is just one example of what our 
                    technology can create for your brand.
                  </p>
                  <button className="secondary-button" onClick={() => navigate('/logo-maker')}>Create Your Logo Now</button>
                </div>
              </div>
            </div>

            {/* Logo Gallery Slider */}
            <div className="logo-gallery">
              <h3 className="gallery-title">More Logo Examples</h3>
              <div ref={logoSliderRef} className="keen-slider logo-slider">
                {logoGalleryItems.slice(1).map((item, index) => (
                  <div className="keen-slider__slide logo-slide" key={index}>
                    <div className="logo-card">
                      <div className="logo-image">
                        <img src={item.img} alt={item.title} />
                      </div>
                      <div className="logo-details">
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER SECTION */}
      <Footer />
    </>
  );
}