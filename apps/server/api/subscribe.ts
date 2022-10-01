import { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: "2022-08-01",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user_id = req.body.user_id;

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: "price_1LnrX6LzoIyAumTjfO4ciyr3", // £5 /month silver plan
        quantity: 1,
      },
    ],
    metadata: {
      user: user_id,
    },
  });

  res.status(200).json({ paymentLinkUrl: paymentLink.url });
}
