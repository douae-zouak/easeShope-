import { motion } from "framer-motion";

const Transition = (OgComponent) => {
  return () => (
    <>
      <OgComponent />

      {/* Animation principale avec dégradé */}
      <motion.div
        className="slide-in fixed top-0 left-0 w-full h-full origin-bottom z-50"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-[#4a36bd] via-[#6b5bff] to-[#927ffc] overflow-hidden">
          {/* Élément décoratif - Lignes animées */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 bg-white rounded-full"
                style={{
                  top: `${20 + i * 15}%`,
                  left: "-10%",
                  width: "120%",
                }}
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Points décoratifs */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}

            {/* Élément décoratif - Formes géométriques */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-40 h-40 border-4 border-white rounded-lg rotate-45"></div>
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-4 border-white rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white opacity-30 rotate-45"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deuxième animation */}
      <motion.div
        className="slide-out fixed top-0 left-0 w-full h-full origin-top z-50"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative w-full h-full bg-gradient-to-br from-[#4a36bd] via-[#6b5bff] to-[#927ffc] overflow-hidden">
          {/* Élément décoratif - Formes géométriques */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-40 h-40 border-4 border-white rounded-lg rotate-45"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-4 border-white rounded-full"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white opacity-30 rotate-45"></div>
          </div>

          {/* Animation de particules */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 12 + 4}px`,
                  height: `${Math.random() * 12 + 4}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -40, opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Transition;
