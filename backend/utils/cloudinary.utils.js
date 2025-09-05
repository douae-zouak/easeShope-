const cloudinary = require('../config/cloudinary.config');

/**
 * Supprime une image de Cloudinary
 * @param {string} publicId - L'ID public de l'image sur Cloudinary
 */
const deleteImageFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image supprimée de Cloudinary:', publicId, result);
    return result;
  } catch (error) {
    console.error('Erreur lors de la suppression Cloudinary:', error);
    throw error;
  }
};

/**
 * Supprime plusieurs images de Cloudinary
 * @param {Array} images - Tableau d'objets image avec public_id
 */
const deleteMultipleImagesFromCloudinary = async (images) => {
  try {
    if (!images || images.length === 0) return;
    
    const deletePromises = images.map(image => {
      if (image.public_id) {
        return deleteImageFromCloudinary(image.public_id);
      }
      return Promise.resolve();
    });
    
    await Promise.all(deletePromises);
    console.log('Toutes les images supprimées de Cloudinary');
  } catch (error) {
    console.error('Erreur lors de la suppression multiple Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  deleteImageFromCloudinary,
  deleteMultipleImagesFromCloudinary
};