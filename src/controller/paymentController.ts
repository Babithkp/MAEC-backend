import { Request, Response } from "express"; import Stripe from "stripe";
import axios from "axios";



interface PaymentItemType {
  name: string;
  amount: number;
  quantity: number;
}

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error("Please provide a publish key");
}
const stripe = new Stripe(stripeKey);

export const makePayment = async (req: Request, res: Response) => {
  const paymentData = req.body.data;
  if (!paymentData) return res.json({ error: "Invalid data provided" });

  const lineItems = paymentData.map((product: PaymentItemType) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: Math.round(product.amount * 100),
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://maec.us/payment/success",
    cancel_url: "https://maec.us/payment/failed",
    custom_text: {
      submit: {
        message: 'Pay for maec.us',
      },
    }
  });
  if (session) {
    res.json(session);
  } else {
    res.status(500).json({ error: "Failed to create session" });
  }
};

async function generateAccessToken() {
  const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL as string;
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET as string;
  
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error(
      "PayPal client ID or secret is not set in the environment variables"
    );
  }

  const response = await axios({
    url: PAYPAL_BASE_URL + "/v1/oauth2/token",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET,
    },
    data: "grant_type=client_credentials",
  });

  return response.data.access_token;
}

export const makePaymentPaypal = async (req: Request, res: Response) => {
  try {
    const items = req.body.data;

    const mappedItems = items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: "EUR",
        value: item.amount.toFixed(2),
      },
    }));

    const totalAmount = mappedItems
      .reduce((total: number, item: any) => {
        const itemAmount = parseFloat(item.unit_amount.value);
        const itemQuantity = parseInt(item.quantity, 10);
        return total + itemAmount * itemQuantity;
      }, 0)
      .toFixed(2);

    const access_token = await generateAccessToken();

    const response = await axios({
      url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            items: mappedItems,
            amount: {
              currency_code: "EUR",
              value: totalAmount,
              breakdown: {
                item_total: {
                  currency_code: "EUR",
                  value: totalAmount,
                },
              },
            },
          },
        ],
        application_context: {
          return_url: "https://www.internationaltranslationservice.de/payment/success",
          cancel_url: "https://www.internationaltranslationservice.de/payment/failed",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "internationaltranslationservice.de",
        },
      },
    });

    const approveLink = response.data.links?.find(
      (link: any) => link.rel === "approve"
    );

    if (!approveLink) {
      return res.status(500).json({ error: "PayPal approve link not found" });
    }

    res.json(approveLink.href);

  } catch (error: any) {
    console.error("PayPal Order Error:", error?.response?.data || error);
    res.status(500).json({
      message: "PayPal order creation failed",
      error: error?.response?.data || error.message,
    });
  }
};

export const capturePaypalPayment = async (req: Request, res: Response) => {
  const orderId = req.body.id;
  try {
    const accessToken = await generateAccessToken();

    const response = await axios({
      url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error capturing payment:');
    if (error) {
      // Log additional details from the error response
      console.log('Error Details:', error);
    }
    return res.status(500).json({ error: 'Failed to capture payment' });
  }
};
