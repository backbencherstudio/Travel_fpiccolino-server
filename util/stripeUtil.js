const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async ({ name, amount }) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna"],
      //   example:
      // line_items: [
      //   {
      //     price_data: {
      //       currency: "usd",
      //       product_data: {
      //         name: "Stubborn Attachments",
      //         images: ["https://i.imgur.com/EHyR2nP.png"],
      //       },
      //       unit_amount: 2000,
      //     },
      //     quantity: 1,
      //   },
      // ],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: name,
            },
            // amount is in dollars, stripe requires amount in cents
            unit_amount: Number(amount) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};

// webhooks
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  //   if (event.type === "checkout.session.completed") {
  //     const session = event.data.object;
  //     // Fulfill the purchase...
  //     console.log(session);
  //   }

  return event;
};

module.exports = { createCheckoutSession, stripeWebhook };
