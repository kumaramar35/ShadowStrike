import express from 'express';
import { getInvoice } from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/', getInvoice);

export default router;
