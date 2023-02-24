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


app.get('/payout', async (req, res) => {
    try {
        const payout = await stripe.payouts.create({
            amount: 20,
            currency: 'usd',
            // method: 'instant',
            // destination: 'pm_1McrsMJuuPL8VgJ9dXpUhNpX',
        });

        console.log("payout", JSON.stringify(payout))
    } catch (error) {
        console.log("error", error)
    }


    res.send("ok")
})


app.get('/create/external/acc', async (req, res) => {
    const payout = await stripe.accounts.createExternalAccount("acct_1M5a17JuuPL8VgJ9", {
        external_account: {
            currency: "aud",
            country: "au",
            object: "bank_account",
            account_holder_name: "Leo the service provider",
            account_holder_type: "company", // "individual"
            routing_number: "110000",
            account_number: "000123456",
        },
    })

    // .then(function (bank_account) {
    //     console.log(JSON.stringify(bank_account, null, 2));
    // });

    res.json(payout)
})


app.get('/create/transfers', async (req, res) => {

    const transfer = await stripe.transfers.create({
        amount: 10,
        currency: "usd",
        source_transaction: "acct_1M5a17JuuPL8VgJ9",
        destination: "acct_1LG1UzKHsT5UCQu5",
    });

    console.log("transfer", transfer);

    res.send("ok");
})



app.listen(4242, () => console.log('Running on port 4242'))