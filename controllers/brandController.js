import Brand from "../models/Brand.js";
import slugify from "slugify";

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
      .select("_id name email status deposit withdrawal kycRequired canDeposit canWithdraw canCryptoDeposit canCashAppDeposit")
      .lean();

    const numberedBrands = brands.map((brand, index) => ({
      serial: index + 1,      
      id: brand._id,          
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

export const createBrand = async (req, res) => {
  try {
      const data = { ...req.body };

    // if slug not provided, generate from name
    if (!data.slug && data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }
    const brand = new Brand(data);
    await brand.save();
    res.status(201).json({ message: "Brand created successfully.", brand });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "Email already exists." });
    }
     if (error.keyPattern?.slug) {
        return res.status(400).json({ message: "Slug already exists." });
      }
    res.status(500).json({ message: "Failed to create brand.", error: error.message });
  }
};


export const updateBrand = async (req, res) => {
  try {
    const updates = { ...req.body };

    // if name changed and slug not explicitly provided
    if (updates.name && !updates.slug) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });

      // ensure uniqueness: if slug already exists on a different brand, append suffix
      let candidate = updates.slug;
      let i = 0;
      // find any brand with same slug and id != current
      while (
        await Brand.exists({
          slug: candidate,
          _id: { $ne: req.params.id }
        })
      ) {
        i += 1;
        candidate = `${updates.slug}-${i}`;
      }
      updates.slug = candidate;
    }

    const brand = await Brand.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json({ message: "Brand updated successfully.", brand });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ message: "Email already exists." });
      }
      if (error.keyPattern?.slug) {
        return res.status(400).json({ message: "Slug already exists." });
      }
    }
    res.status(500).json({ message: "Failed to update brand.", error: error.message });
  }
};
