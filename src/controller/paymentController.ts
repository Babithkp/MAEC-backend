import { Request, Response } from "express";import Stripe from "stripe";

interface PaymentItemType {
  name: string;
  amount: number;
  quantity: number;
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Please provide a publish key");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const makePayment = async (req: Request, res: Response) => {
  const paymentData = req.body.data;
  if (!paymentData) return res.json({ error: "Invalid data provided" });

  const lineItems = paymentData.map((product: PaymentItemType) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount:Math.round(product.amount * 100),
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://maec-kappa.vercel.app/payment/success",
    cancel_url: "https://maec-kappa.vercel.app/payment/failed",
  });
  if (session) {
    res.json(session);
  } else {
    res.status(500).json({ error: "Failed to create session" });
  }
};



