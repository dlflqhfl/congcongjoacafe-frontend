import React from 'react';
import { motion } from 'framer-motion';
import { menuData } from '../../data/menuData';
import { Link } from 'react-router-dom';

const FeaturedMenu = () => {
  const recommendedMenus = menuData.filter(menu => menu.isRecommended);
  const newMenus = menuData.filter(menu => menu.isNew);
  const bestSellers = menuData.filter(menu => menu.isBestSeller);

  const MenuCard = ({ menu, badge }: { menu: typeof menuData[0], badge?: string }) => {
    const mainImage = menu.images.find(img => img.isMain) || menu.images[0];

    return (
      <motion.div
        whileHover={{ y: -10 }}
        className="relative bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {badge && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
            {badge}
          </div>
        )}
        <img 
          src={mainImage.url}
          alt={mainImage.alt || menu.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{menu.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{menu.nameEng}</p>
          <p className="text-primary font-bold">{menu.price.toLocaleString()}원</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="py-16 bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* New Menus */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">신메뉴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newMenus.map(menu => (
              <Link to={`/menu/${menu.id}`} key={menu.id}>
                <MenuCard menu={menu} badge="NEW" />
              </Link>
            ))}
          </div>
        </div>

        {/* Monthly Recommendations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">이달의 추천메뉴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedMenus.map(menu => (
              <Link to={`/menu/${menu.id}`} key={menu.id}>
                <MenuCard menu={menu} badge="PICK" />
              </Link>
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">베스트셀러</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(menu => (
              <Link to={`/menu/${menu.id}`} key={menu.id}>
                <MenuCard menu={menu} badge="BEST" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMenu;