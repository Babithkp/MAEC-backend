"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capturePaypalPayment = exports.makePaymentPaypal = exports.makePayment = void 0;
const stripe_1 = __importDefault(require("stripe"));
const axios_1 = __importDefault(require("axios"));
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
    throw new Error("Please provide a publish key");
}
const stripe = new stripe_1.default(stripeKey);
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentData = req.body.data;
    if (!paymentData)
        return res.json({ error: "Invalid data provided" });
    const lineItems = paymentData.map((product) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: product.name,
            },
            unit_amount: Math.round(product.amount * 100),
        },
        quantity: product.quantity,
    }));
    const session = yield stripe.checkout.sessions.create({
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
    }
    else {
        res.status(500).json({ error: "Failed to create session" });
    }
});
exports.makePayment = makePayment;
function generateAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL;
        const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
        const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
        if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
            throw new Error("PayPal client ID or secret is not set in the environment variables");
        }
        const response = yield (0, axios_1.default)({
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
    });
}
const makePaymentPaypal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const items = req.body.data;
        const mappedItems = items.map((item) => ({
            name: item.name,
            quantity: item.quantity.toString(),
            unit_amount: {
                currency_code: "USD",
                value: item.amount.toFixed(2),
            },
        }));
        const totalAmount = mappedItems
            .reduce((total, item) => {
            const itemAmount = parseFloat(item.unit_amount.value);
            const itemQuantity = parseInt(item.quantity, 10);
            return total + itemAmount * itemQuantity;
        }, 0)
            .toFixed(2);
        const access_token = yield generateAccessToken();
        const response = yield (0, axios_1.default)({
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
                            currency_code: "USD",
                            value: totalAmount,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: totalAmount,
                                },
                            },
                        },
                    },
                ],
                application_context: {
                    return_url: "http://localhost:5173/payment/success",
                    cancel_url: "http://localhost:5173/payment/failed",
                    shipping_preference: "NO_SHIPPING",
                    user_action: "PAY_NOW",
                    brand_name: "ITS.us",
                },
            },
        });
        const approveLink = (_a = response.data.links) === null || _a === void 0 ? void 0 : _a.find((link) => link.rel === "approve");
        if (!approveLink) {
            return res.status(500).json({ error: "PayPal approve link not found" });
        }
        res.json(approveLink.href);
    }
    catch (error) {
        console.error("PayPal Order Error:", ((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || error);
        res.status(500).json({
            message: "PayPal order creation failed",
            error: ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message,
        });
    }
});
exports.makePaymentPaypal = makePaymentPaypal;
const capturePaypalPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.body.id;
    try {
        const accessToken = yield generateAccessToken();
        const response = yield (0, axios_1.default)({
            url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return res.json(response.data);
    }
    catch (error) {
        console.error('Error capturing payment:');
        if (error) {
            // Log additional details from the error response
            console.log('Error Details:', error);
        }
        return res.status(500).json({ error: 'Failed to capture payment' });
    }
});
exports.capturePaypalPayment = capturePaypalPayment;
