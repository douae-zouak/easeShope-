const axios = require("axios");
const User = require("../../models/user.model");
const Cart = require("../../models/Cart.model");
const Order = require("../../models/Order.model");
const Product = require("../../models/product.model");
const brevoConfig = require("../../config/brevo.config");

// Taux de conversion DH → USD (à ajuster)
const DH_TO_USD_RATE = 0.1; // 1 DH = 0.1 USD

// ---------------------
// Fonction pour récupérer le token PayPal - CORRIGÉE
// ---------------------
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting PayPal access token:",
      error.response?.data || error.message
    );
    throw new Error(
      "Failed to get access token: " +
        (error.response?.data?.error_description || error.message)
    );
  }
};

// ---------------------
// Convertir DH en USD pour PayPal
// ---------------------
const convertDhToUsd = (dhAmount) => {
  return (parseFloat(dhAmount) * DH_TO_USD_RATE).toFixed(2);
};

// ---------------------
// Créer une commande PayPal - CORRIGÉE
// ---------------------
exports.createOrder = async (req, res) => {
  try {
    const { total, items = [] } = req.body;

    if (!total || isNaN(total)) {
      return res.status(400).json({
        error: "Total amount is required and must be a valid number",
      });
    }

    const accessToken = await getAccessToken();
    const totalUSD = convertDhToUsd(total);

    // Calculer le total des items pour validation
    const itemsTotalUSD = items
      .reduce((sum, item) => {
        const itemPriceUSD = convertDhToUsd(item.priceAtPurchase || 0);
        return sum + parseFloat(itemPriceUSD) * parseInt(item.quantity || 1);
      }, 0)
      .toFixed(2);

    // Structure simplifiée et corrigée pour PayPal
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalUSD,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: itemsTotalUSD,
              },
            },
          },
          items: items.map((item, index) => ({
            name: (item.productId?.name || `Item ${index + 1}`).substring(
              0,
              127
            ),
            quantity: item.quantity?.toString() || "1",
            unit_amount: {
              currency_code: "USD",
              value: convertDhToUsd(item.priceAtPurchase || 0),
            },
            category: "PHYSICAL_GOODS",
            sku: item.sku || `SKU-${index}`,
          })),
        },
      ],
      application_context: {
        brand_name: "EaseShop",
        locale: "en-US",
        landing_page: "LOGIN",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: `${process.env.REDIRECT_BASE_URL}/complete-payment`,
        cancel_url: `${process.env.REDIRECT_BASE_URL}/cancel-payment`,
      },
    };

    const response = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Prefer: "return=representation",
        },
        timeout: 10000,
      }
    );

    const orderId = response.data.id;
    const approvalUrl = response.data.links.find(
      (link) => link.rel === "approve"
    )?.href;

    return res.status(201).json({
      success: true,
      orderId,
      approvalUrl,
    });
  } catch (error) {
    console.error(
      "Error creating PayPal order:",
      error.response?.data || error.message
    );

    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      success: false,
      error: "Failed to create order",
      details: error.response?.data || error.message,
    });
  }
};

// Fonction utilitaire pour créer une commande
const orderProcess = async (userId, orderData) => {
  try {
    const { city, street, postalCode, phoneNumber, total } = orderData;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    console.log("user : ", user);

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name seller variants",
    });

    console.log("cart : ", cart);
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Vérification du stock
    for (const item of cart.items) {
      const product = item.productId;
      const variant = product.variants.find(
        (v) => v.size === item.size && v.colorTitle === item.colorTitle
      );

      if (!variant) {
        throw new Error(`Variant not found for: ${product.name}`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for: ${product.name}`);
      }
    }

    console.log("stock verified");

    // Préparer les items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      sellerId: item.productId.seller,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      size: item.size,
      colorTitle: item.colorTitle,
      colorCode: item.colorCode,
      sku: item.sku,
      colorImages: item.colorImages,
      productName: item.productId.name,
    }));

    console.log("orderItems : ", orderItems);

    // Créer la commande
    const order = await Order.create({
      userId,
      items: orderItems,
      total,
      shippingAddress: {
        name: user.fullName,
        email: user.email,
        city,
        postalCode,
        street,
        phoneNumber,
      },
      paidAt: new Date(),
    });

    console.log("order : ", order);

    // Mettre à jour les stocks
    for (const item of cart.items) {
      // Mettre à jour la variante spécifique
      await Product.findOneAndUpdate(
        {
          _id: item.productId._id,
          "variants.size": item.size,
          "variants.colorTitle": item.colorTitle,
        },
        {
          $inc: {
            "variants.$.stock": -item.quantity,
            stock: -item.quantity,
          },
        }
      );
    }

    // Vider le panier
    cart.items = [];
    await cart.save();

    console.log("sending email : ");

    await brevoConfig.OrderReciept(user.email);

    return order;
  } catch (error) {
    console.error("Error in orderProcess:", error);
    throw error; // Propager l'erreur pour la capturer dans capturePayment
  }
};

// Nouvelle version de capturePayment
exports.capturePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { city, street, postalCode, phoneNumber, total } = req.body;
    console.log("city : ", city);
    const accessToken = await getAccessToken();

    // 1. Capturer le paiement PayPal
    const response = await axios.post(
      `${process.env.PAYPAL_SANDBOX_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Prefer: "return=representation",
        },
        timeout: 10000,
      }
    );
    console.log("here");

    // 2. Préparer les données pour orderProcess
    const orderData = {
      total,
      city,
      street,
      postalCode,
      phoneNumber,
    };

    console.log("order date : ", orderData);

    // 2. Créer la commande
    const order = await orderProcess(req.user._id, orderData);

    // 3. Répondre avec succès
    res.status(201).json({
      success: true,
      paymentData: response.data,
      order: order,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
