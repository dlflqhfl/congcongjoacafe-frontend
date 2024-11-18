import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedMenu from '../components/home/FeaturedMenu';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-beige-50">
      <Hero />
      <FeaturedMenu />
    </div>
  );
};

export default Home;