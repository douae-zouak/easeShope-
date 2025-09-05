// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[88vh] flex flex-col md:flex-row items-center justify-between overflow-hidden bg-gradient-to-br from-[#5f46e8] to-[#8a75ff] rounded-4xl m-3">
      {/* Partie gauche avec texte */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 md:p-12">
        <div className="relative z-10 text-white mx-auto md:mx-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 leading-tight"
          >
            <span className="block">We bring the store</span>
            <span className="block">to your door</span>
            <span className="text-yellow-300 font-light text-3xl md:text-4xl lg:text-5xl block mt-4">
              Get 50% off
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-lg md:text-xl mb-8 opacity-90"
          >
            <span className="block">Discover the best products with fast</span>
            delivery directly to your home
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#5f46e8] font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-2 shadow-lg w-full md:w-auto"
          >
            Shop Now <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Partie droite avec image de produits */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="relative w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Image principale - Essayez différents chemins */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-200  flex items-center justify-center">
              <img
                src="/hero_image.png"
                alt="Collection of shopping products"
                className="w-full  object-cover h-[550px] pt-10"
              />

              {/* Fallback si l'image ne charge pas */}
              {/* <div
                id="image-fallback"
                className="absolute inset-0 grid place-items-center text-center p-6 bg-gray-100 text-[#5f46e8]"
              >
                <div className="text-center">
                  <ShoppingBag className="h-16 w-16 mx-auto opacity-30" />
                  <p className="mt-4 font-semibold">Shopping Products</p>
                </div>
              </div> */}
            </div>

            {/* Éléments flottants décoratifs */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-lg"
            >
              <div className="bg-yellow-100 p-2 rounded-xl">
                <span className="text-sm font-bold text-yellow-700">NEW</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-lg"
            >
              <div className="bg-green-100 p-2 rounded-xl">
                <span className="text-md font-bold text-green-700">
                  $ Best Prices
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
