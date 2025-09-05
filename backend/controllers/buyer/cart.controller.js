const Cart = require("../../models/Cart.model"); // Note: Ton modèle s'appelle "Order" mais devrait être "Cart"
const Product = require("../../models/product.model");

// GET - Récupérer le panier de l'utilisateur
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: "items.productId",
      select: "name price imagesVariant originalPrice category variants seller",
      populate: {
        path: "seller", // le champ dans product qui référence User
        model: "user",
        select: "fullName email", // ce que tu veux afficher
      },
    });

    if (!cart) {
      return res.status(200).json({ items: [], total: 0, itemCount: 0 });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    res.json({
      items: cart.items,
      total: total,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST - Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    // Validation des données
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Product quantity should be positive" });
    }

    if (!variant || !variant.size || !variant.colorTitle) {
      return res.status(400).json({
        error: "Variant information is required (size and colorTitle)",
      });
    }

    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productVariant = product.variants.find(
      (v) => v.size === variant.size && v.colorTitle === variant.colorTitle
    );

    if (!productVariant) {
      return res.status(404).json({
        error: "Variant not found for this product",
      });
    }

    // Vérifier le stock
    if (productVariant.stock < quantity) {
      return res.status(400).json({
        error: `Stock insuffisant, it's still just ${productVariant.stock} pieces in this variant`,
        availableStock: productVariant.stock,
      });
    }

    // Trouver les images correspondant à la couleur choisie
    const colorImages = product.imagesVariant.find(
      (imgVariant) => imgVariant.color === variant.colorTitle
    );

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // Créer un nouveau panier
      cart = new Cart({
        userId: req.user._id,
        items: [
          {
            productId: productId,
            quantity: quantity,
            priceAtPurchase: product.price,
            size: variant.size,
            colorTitle: variant.colorTitle,
            colorCode: variant.colorCode,
            sku: variant.sku,
            colorImages: colorImages ? colorImages.images : [],
          },
        ],
      });
    } else {
      // Vérifier si le produit avec la même variante est déjà dans le panier
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId && item.sku === variant.sku
      );

      if (existingItemIndex > -1) {
        // Mettre à jour la quantité
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        if (product.stock < newQuantity) {
          return res.status(400).json({
            error: "Stock not enough!",
            availableStock: productVariant.stock,
          });
        }

        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Ajouter un nouvel item
        cart.items.push({
          productId: productId,
          quantity: quantity,
          priceAtPurchase: product.price,
          size: variant.size,
          colorTitle: variant.colorTitle,
          colorCode: variant.colorCode,
          sku: variant.sku,
          colorImages: colorImages ? colorImages.images : [],
        });
      }
    }

    await cart.save();

    // Populer les informations du produit pour la réponse
    await cart.populate({
      path: "items.productId",
      select: "name price imagesVariant originalPrice category variants seller",
      populate: {
        path: "seller", // le champ dans product qui référence User
        model: "user",
        select: "fullName email", // ce que tu veux afficher
      },
    });

    const total = cart.items.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    res.status(201).json({
      message: "Product added to cart",
      items: cart.items,
      total: total,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de produit invalide" });
    }
    res.status(500).json({ error: "Erreur serveur", error: error.message });
  }
};

// PUT - Mettre à jour la quantité d'un produit
exports.updateProductQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, size, colorTitle } = req.body;

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Product quantity should be positive" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Trouver l'item dans le panier
    const itemIndex = cart.items.findIndex((item) => {
      // Si des informations de variante sont fournies, les utiliser pour trouver l'item exact
      if (size && colorTitle) {
        return (
          item.productId.toString() === productId &&
          item.size === size &&
          item.colorTitle === colorTitle
        );
      }
      // Sinon, chercher juste par productId (pour compatibilité ascendante)
      return item.productId.toString() === productId;
    });

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    const cartItem = cart.items[itemIndex];

    let availableStock = product.stock; // Stock global par défaut

    // Si l'item a des informations de variante, vérifier le stock de la variante spécifique
    if (
      cartItem.size &&
      cartItem.colorTitle &&
      product.variants &&
      product.variants.length > 0
    ) {
      const productVariant = product.variants.find(
        (v) => v.size === cartItem.size && v.colorTitle === cartItem.colorTitle
      );

      if (productVariant) {
        availableStock = productVariant.stock;
      }
    }

    // Vérifier le stock disponible
    if (availableStock < quantity) {
      return res.status(400).json({
        error: "Stock insuffisant",
        availableStock: availableStock,
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "name price imagesVariant originalPrice category variants seller",
      populate: {
        path: "seller", // le champ dans product qui référence User
        model: "user",
        select: "fullName email", // ce que tu veux afficher
      },
    });
    const total = cart.items.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    res.json({
      message: "Quantity updated",
      items: cart.items,
      total: total,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de produit invalide" });
    }
    res.status(500).json({ error: "Erreur serveur", error: error.message });
  }
};

// DELETE - Supprimer un produit du panier
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, colorTitle } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const initialLength = cart.items.length;

    cart.items = cart.items.filter((item) => {
      if (size && colorTitle) {
        return !(
          item.productId.toString() === productId &&
          item.size === size &&
          item.colorTitle === colorTitle
        );
      }
      return item.productId.toString() !== productId;
    });

    if (cart.items.length === initialLength) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "name price imagesVariant originalPrice category variants seller",
      populate: {
        path: "seller", // le champ dans product qui référence User
        model: "user",
        select: "fullName email", // ce que tu veux afficher
      },
    });
    const total = cart.items.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    res.json({
      message: "Product deleted from the cart",
      items: cart.items,
      total: total,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de produit invalide" });
    }
    res.status(500).json({ error: "Erreur serveur", error: error.message });
  }
};

// DELETE - Vider tout le panier
// exports.clearCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user._id });

//     if (!cart || cart.items.length === 0) {
//       return res.status(200).json({ message: "The cart is alredy empty!" });
//     }

//     cart.items = [];
//     await cart.save();

//     res.json({ message: "Cart empty with success" });
//   } catch (error) {
//     res.status(500).json({ message: "Erreur serveur", error: error.message });
//   }
// };

// exports.chechout = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     // Validation du montant
//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Invalid amount",
//       });
//     }

//     // Création d'un PaymentIntent en mode test
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount), // en centimes
//       currency: "mad", // MAD
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         // Ajoutez des métadonnées si nécessaire
//         order_id: "test_order_" + Date.now(),
//       },
//     });

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//       status: paymentIntent.status,
//     });
//   } catch (error) {
//     console.error("Payment error : ", error);
//     res.status(500).json({ error: error.message, success: false });
//   }
// };
