// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = [
    {
      name: "Electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600",
      color: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      name: "Men",
      image:
        "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&q=80&w=600",
      color: "bg-indigo-100",
      textColor: "text-indigo-800",
    },
    {
      name: "Women",
      image: "/women.jpg",
      color: "bg-pink-100",
      textColor: "text-pink-800",
    },
    {
      name: "Men's Footwear",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
      color: "bg-teal-100",
      textColor: "text-teal-800",
    },
    {
      name: "Women's Footwear",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
      color: "bg-rose-100",
      textColor: "text-rose-800",
    },
    {
      name: "Home & Kitchen",
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=600",
      color: "bg-amber-100",
      textColor: "text-amber-800",
    },
    {
      name: "Beauty",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
      color: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      name: "Sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600",
      color: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      name: "Books",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
      color: "bg-red-100",
      textColor: "text-red-800",
    },
    {
      name: "Kids",
      image: "/kids.jpg",
      color: "bg-cyan-100",
      textColor: "text-cyan-800",
    },
    {
      name: "Jewelry",
      image: "/jewerly.jpg",
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const nextCategories = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex + itemsPerPage >= categories.length) {
        return 0;
      }
      return prevIndex + itemsPerPage;
    });
  };

  const prevCategories = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return categories.length - itemsPerPage;
      }
      return prevIndex - itemsPerPage;
    });
  };

  const getVisibleCategories = () => {
    let visibleCategories = [];

    if (currentIndex + itemsPerPage > categories.length) {
      const remaining = categories.length - currentIndex;
      visibleCategories = [
        ...categories.slice(currentIndex),
        ...categories.slice(0, itemsPerPage - remaining),
      ];
    } else {
      visibleCategories = categories.slice(
        currentIndex,
        currentIndex + itemsPerPage
      );
    }

    return visibleCategories;
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec titre et bouton See All */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0"
          >
            Explore Trending Categories
          </motion.h2>
        </div>

        {/* Conteneur des catégories avec boutons de navigation */}
        <div className="flex items-center justify-center gap-4">
          {/* Bouton précédent */}
          <motion.button
            onClick={prevCategories}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-[#5f46e8] hover:text-[#8a75ff]"
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Grille de catégories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
            {getVisibleCategories().map((category, index) => (
              <Link
                to={`/products/${encodeURIComponent(category.name)}`}
                key={`${category.name}-${currentIndex}-${index}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full ${category.color} ${category.textColor} text-sm font-medium`}
                    >
                      {category.name}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Bouton suivant */}
          <motion.button
            onClick={nextCategories}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-[#5f46e8] hover:text-[#8a75ff]"
            aria-label="Next categories"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Bouton Show More pour mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center md:hidden"
        >
          <button
            onClick={nextCategories}
            className="px-6 py-3 bg-[#5f46e8] text-white font-semibold rounded-full hover:bg-[#8a75ff] transition-colors flex items-center"
          >
            Show More <ChevronRight className="ml-1 h-5 w-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
