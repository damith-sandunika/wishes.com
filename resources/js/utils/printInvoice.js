export function printInvoice(order) {
    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${order.invoice_number}</title>
            <style>
                body { font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif; padding: 40px; color: #1f2937; margin: 0; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #fecdd3; padding-bottom: 20px; margin-bottom: 30px; }
                .logo { font-size: 26px; font-weight: 800; color: #dc2626; letter-spacing: -0.5px; }
                .logo span { font-family: cursive, sans-serif; font-size: 32px; }
                .badge { background: #ffe4e6; color: #e11d48; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
                .details { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 13px; line-height: 1.6; }
                .col { width: 48%; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                th { background: #fff1f2; color: #9f1239; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
                .total-box { margin-left: auto; width: 280px; font-size: 13px; line-height: 1.8; text-align: right; }
                .grand-total { font-size: 18px; font-weight: 800; color: #dc2626; border-top: 2px solid #e5e7eb; padding-top: 8px; margin-top: 8px; }
                .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #9ca3af; border-top: 1px dashed #e5e7eb; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="/logo.png" alt="Wishes.com" style="height: 48px; object-fit: contain;" />
                <div class="badge">Official Order Invoice</div>
            </div>
            <div class="details">
                <div class="col">
                    <strong>Invoice #:</strong> ${order.invoice_number}<br>
                    <strong>Tracking Code:</strong> ${order.tracking_number || '-'}<br>
                    <strong>Date & Time:</strong> ${new Date(order.created_at).toLocaleString()}<br>
                    <strong>Payment Method:</strong> ${order.payment_method}<br>
                    <strong>Payment Status:</strong> ${order.payment_status}
                </div>
                <div class="col" style="text-align: right;">
                    <strong>Recipient / Customer:</strong> ${order.customer_name}<br>
                    <strong>WhatsApp / Phone:</strong> ${order.whatsapp_number}<br>
                    <strong>Delivery Address:</strong> ${order.delivery_address}
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(i => `
                        <tr>
                            <td><strong>${i.product_name}</strong></td>
                            <td>${i.quantity}</td>
                            <td>LKR ${Number(i.unit_price).toLocaleString()}</td>
                            <td style="text-align: right;">LKR ${Number(i.total_price).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="total-box">
                <div>Subtotal: LKR ${Number(order.sub_total).toLocaleString()}</div>
                <div>Delivery Fee: ${Number(order.delivery_charge) === 0 ? 'FREE' : `LKR ${Number(order.delivery_charge).toLocaleString()}`}</div>
                ${Number(order.discount_amount) > 0 ? `<div>Discount: -LKR ${Number(order.discount_amount).toLocaleString()}</div>` : ''}
                <div class="grand-total">Total: LKR ${Number(order.grand_total).toLocaleString()}</div>
            </div>
            <div class="footer">
                Thank you for choosing Wishes.com – Gifts For Every Moment!<br>
                For questions, contact +94 71 808 0582 or support@wishes.com
            </div>
        </body>
        </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
}
