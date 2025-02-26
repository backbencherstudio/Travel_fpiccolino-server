const Transaction = require("./../transaction/transaction.model");

const { stripeWebhook } = require("./../../util/stripeUtil");
const paymentHelper = require("../common/payment/PaymentHelper");

const makePayment = async (req, res) => {
  const { package_name, amount, order_id } = req.body;
  try {
    const session = await createCheckoutSession({ name: package_name, amount });

    // save the transaction in the database
    const transaction = new Transaction({
      paymentIntentId: session.payment_intent,
      checkoutSessionId: session.id,
      order_id: order_id,
      amount: amount,
      currency: "eur",
      status: "pending",
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const webhook = async (req, res) => {
  const event = stripeWebhook(req, res);

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Update the transaction status in the database
    const transaction = await Transaction.findOne({
      checkoutSessionId: session.id,
    });
    transaction.status = "succeeded";
    await transaction.save();

    console.log(`Payment for ${session.id} succeeded!`);
  }

  res.status(200).send("Webhook received");
};

module.exports = {
  makePayment,
  webhook,
};
