import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MenuItem as MenuItemType } from '../../types';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const mainImage = item.images.find(img => img.isMain) || item.images[0];

  return (
    <Link to={`/menu/${item.id}`}>
      <motion.div
        layout
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={mainImage.url}
          alt={mainImage.alt || item.name}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            {item.isNew && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                NEW
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          <p className="text-primary font-semibold">{item.price.toLocaleString()}원</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default MenuItem;