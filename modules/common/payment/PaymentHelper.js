const { createCheckoutSession } = require("../../../util/stripeUtil");
const Transaction = require("../../transaction/transaction.model");

const paymentHelper = {};

paymentHelper.makePayment = async ({ package_name, amount, order_id }) => {
  try {
    const session = await createCheckoutSession({ name: package_name, amount });

    // save the transaction in the database
    const transaction = new Transaction({
      paymentIntentId: session.payment_intent,
      checkoutSessionId: session.id,
      amount: amount,
      order_id: order_id,
      currency: "eur",
      status: "pending",
    });
    await transaction.save();

    return { url: session.url };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = paymentHelper;
