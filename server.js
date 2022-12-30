require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const express = require('express');
const app = express();

app.use(express.static('public'));

app.post('/create-checkout', async (req, res) => {

    const payload = {
        name: 'Gold Special',
        unit_amount: 2000,
        currency: "USD",
        quantity: 1,
    }

    /**
     * @description Create the product 
     */
    const product = await stripe.products.create({
        name: payload.name,
    });

    /**
     * @description Create the price from product id
     */
    const prices = await stripe.prices.create({
        unit_amount: payload.unit_amount,
        currency: payload.currency,
        product: product.id
    });

    console.log("product", product)

    /**
     * @description Create session with price id 
     */
    const session = await stripe.checkout.sessions.create({
        submit_type: 'auto',
        line_items: [
            {
                price: prices.id,
                quantity: payload.quantity,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.URL}/success.html`,
        cancel_url: `${process.env.URL}/cancel.html`,
    });

    res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'))