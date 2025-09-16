import express from 'express';
import Brand from '../models/Brand.js';
import auth from '../middleware/auth.js'; // adjust path as needed

const router = express.Router();

// Get all brands
router.get('/', auth([0, 1]), async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch brands.", error: error.message });
    }
});

// Create or update brand
router.post('/save', auth([0, 1]), async (req, res) => {
    try {
        const { id, name, email, status } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }

        let brand;
        if (id) {
            // Update existing brand
            brand = await Brand.findById(id);
            if (!brand) {
                return res.status(404).json({ message: "Brand not found." });
            }
            brand.name = name;
            brand.email = email;
            brand.status = status !== undefined ? status : brand.status;
            await brand.save();
            return res.json({ message: "Brand updated successfully.", brand });
        } else {
            // Create new brand
            brand = new Brand({ name, email, status });
            await brand.save();
            return res.status(201).json({ message: "Brand created successfully.", brand });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to save brand.", error: error.message });
    }
});

export default router;
