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
exports.makePayment = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
    throw new Error("Please provide a publish key");
}
const stripe = new stripe_1.default(stripeKey);
console.log(stripeKey);
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
        success_url: "https://maec-kappa.vercel.app/payment/success",
        cancel_url: "https://maec-kappa.vercel.app/payment/failed",
    });
    if (session) {
        res.json(session);
    }
    else {
        res.status(500).json({ error: "Failed to create session" });
    }
});
exports.makePayment = makePayment;
