import Brand from "../models/Brand.js";

// GET all brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
      .select("_id name email status deposit withdrawal kycRequired canDeposit canWithdraw canCryptoDeposit canCashAppDeposit")
      .lean();

    const numberedBrands = brands.map((brand, index) => ({
      serial: index + 1,      // serial number
      id: brand._id,          // expose id
      name: brand.name,
      email: brand.email,
      status: brand.status,
      deposit: brand.deposit,
      withdrawal: brand.withdrawal,
      kycRequired: brand.kycRequired,
      canDeposit: brand.canDeposit,
      canWithdraw: brand.canWithdraw,
      canCryptoDeposit: brand.canCryptoDeposit,
      canCashAppDeposit: brand.canCashAppDeposit,
    }));

    res.json(numberedBrands);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch brands.",
      error: error.message,
    });
  }
};



// GET single brand by ID
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id).lean();
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch brand.",
      error: error.message,
    });
  }
};

// CREATE brand
export const createBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json({ message: "Brand created successfully.", brand });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "Email already exists." });
    }
    res.status(500).json({ message: "Failed to create brand.", error: error.message });
  }
};

// UPDATE brand
export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json({ message: "Brand updated successfully.", brand });
  } catch (error) {
    // Handle duplicate email error (code 11000 = duplicate key)
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "Email already exists." });
    }

    res.status(500).json({
      message: "Failed to update brand.",
      error: error.message,
    });
  }
};
