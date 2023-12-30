import { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: "2023-10-16"
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user_id = req.body.user_id;

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: process.env.PREMIUM_STRIPE_PRICE as string,
        quantity: 1,
      },
    ],
    metadata: {
      user: user_id,
    },
  });

  res.status(200).json({ paymentLinkUrl: paymentLink.url });
}
