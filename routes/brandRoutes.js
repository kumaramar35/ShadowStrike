import express from 'express';
import Brand from '../models/Brand.js';
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get('/', isAuthenticated, authorizeRoles("admin", "super_admin"), async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch brands.", error: error.message });
    }
});

router.post('/save', isAuthenticated, authorizeRoles("admin", "super_admin"), async (req, res) => {
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
        } else {
            brand = new Brand({ name, email, status });
            await brand.save();
            return res.status(201).json({ message: "Brand created successfully.", brand });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to save brand.", error: error.message });
    }
});

export default router;
