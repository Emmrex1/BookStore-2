
import cloudinary from "../config/Cloudinary.js";
import productModel from "../model/productModel.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, popular, images } = req.body;

    // Validation
    if (!name || !category || !price || !images || images.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      popular: popular === "true" || popular === true,
      images, 
      date: Date.now(),
    };

    console.log("✅ Product data:", productData);

    const newProduct = new productModel(productData);
    await newProduct.save();

    res.json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log("❌ Error saving product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


  
const getAllProducts = async (req, res) => {
  try {
    const { search, category, location } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category (case-insensitive match)
    if (category) {
      query.category = category.toLowerCase(); 
    }

    if (location) {
      query.location = location;
    }

    const products = await productModel.find(query);
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const getProductById = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await productModel.findById(_id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, book: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

  
  const updateProduct = async (req, res) => {
    try {
      const { name, description, category, price, popular } = req.body;
  
      // Find product
      const product = await productModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      // Step 1: Handle new uploaded images
      let newImageUrls = [];
  
      if (req.files && req.files.length > 0) {
        newImageUrls = req.files.map(file => file.path); 
      }
  
      const allImages = [...product.images, ...newImageUrls];
  
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price !== undefined ? Number(price) : product.price;
      product.popular = popular !== undefined ? popular === "true" : product.popular;
      product.images = allImages;
      product.date = Date.now();
  
      const updatedProduct = await product.save();
  
      res.json({ success: true, message: "Product updated with images", product: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params._id); 
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Step 1: Delete images from Cloudinary
    try {
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`bookstore_uploads/${publicId}`);
        }
      }
    } catch (cloudErr) {
      console.error("Cloudinary error:", cloudErr.message);
    }

    // Step 2: Delete product from DB
    await productModel.findByIdAndDelete(req.params._id); 

    res.json({ success: true, message: "Product and images deleted successfully" });
  } catch (error) {
    console.log("❌ Product delete error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

  

export {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct}