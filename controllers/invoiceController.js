import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getInvoice = (req, res) => {
    const uniqueId = 'INV-' + uuidv4().split('-')[0].toUpperCase();
    const today = new Date();
    const date = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
    const userId = req.query.userId || 'USR-0000';

    const host = req.get('host');
    const protocol = req.protocol;
    const logoUrl = `${protocol}://${host}/public/logo.jpeg`;

    const invoiceData = {
        date,
        invoiceNo: uniqueId,
        userId,
        customerName: 'user_good',
        customerEmail: 'ziasam447@gmail.com',
        items: [
            { no: '01', description: 'AlphaTech 2026 roadmap prep', price: '0.19', qty: 17, total: '3.23' },
            { no: '02', description: 'Xylent logout confirmation', price: '1.77', qty: 1, total: '1.77' }
        ],
        subTotal: '5.00',
        serviceCharge: '0.65',
        grandTotal: '5.65'
    };

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Invoice</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 20px; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.15); }
            .header { background: linear-gradient(90deg, #0d47a1, #1976d2); color: white; padding: 20px; border-radius: 5px 5px 0 0; display: flex; justify-content: space-between; align-items: center; }
            .header h1 { margin: 0; }
            .details { display: flex; justify-content: space-between; margin: 20px 0; }
            .details div { max-width: 45%; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            table, th, td { border: 1px solid #ddd; }
            th { background-color: #0d47a1; color: white; text-align: left; padding: 8px; }
            td { padding: 8px; }
            .total-box { text-align: right; }
            .footer { font-size: 12px; color: #555; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="invoice-box">
            <div class="header">
                <h1>INVOICE</h1>
                <img src="${logoUrl}" style="width:150px;" alt="Logo"/>
            </div>

            <div class="details">
                <div>
                    <p><strong>Date:</strong> ${invoiceData.date}</p>
                    <p><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</p>
                    <p><strong>User ID:</strong> ${invoiceData.userId}</p>
                </div>
                <div>
                    <p><strong>Invoice To:</strong></p>
                    <p>${invoiceData.customerName}</p>
                    <p>${invoiceData.customerEmail}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>NO</th>
                        <th>ITEM DESCRIPTION</th>
                        <th>PRICE</th>
                        <th>QTY</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceData.items.map(item => `
                    <tr>
                        <td>${item.no}</td>
                        <td>${item.description}</td>
                        <td>$${item.price}</td>
                        <td>${item.qty}</td>
                        <td>$${item.total}</td>
                    </tr>`).join('')}
                </tbody>
            </table>

            <div class="total-box">
                <p><strong>SUB TOTAL:</strong> $${invoiceData.subTotal}</p>
                <p><strong>Service Charge:</strong> $${invoiceData.serviceCharge}</p>
                <p><strong>GRAND TOTAL:</strong> $${invoiceData.grandTotal}</p>
            </div>

            <div class="footer">
                <p>By proceeding with this payment, you confirm you are authorized to make this purchase and acknowledge that all sales are final and non-refundable once processed. Service fees are applied for processing and platform maintenance.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    res.set('Content-Type', 'text/html');
    res.send(html);
};
