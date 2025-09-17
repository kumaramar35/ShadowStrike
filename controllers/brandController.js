import Brand from "../models/Brand.js";

// GET all brands with serial numbers
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().lean();

    const numberedBrands = brands.map((brand, index) => ({
      serial: index + 1,
      ...brand,
    }));

    res.json(numberedBrands);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch brands.", error: error.message });
  }
};

// CREATE or UPDATE brand
export const saveBrand = async (req, res) => {
  try {
    const { id, name, email, status } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    let brand;
    if (id) {
      brand = await Brand.findById(id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found." });
      }
      brand.name = name;
      brand.email = email;
      brand.status = status !== undefined ? status : brand.status;
      await brand.save();
      return res.json({ message: "Brand updated successfully.", brand });
    }

    brand = new Brand({ name, email, status });
    await brand.save();
    res.status(201).json({ message: "Brand created successfully.", brand });
  } catch (error) {
    res.status(500).json({ message: "Failed to save brand.", error: error.message });
  }
};
