import { VercelRequest, VercelResponse } from "@vercel/node";
import { ManagementClient } from "auth0";
import Stripe from "stripe";
import { toRawBody } from "../helpers/rawBody";

const auth0 = new ManagementClient({
  domain: "shell-ai.eu.auth0.com",
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
});

const stripe = new Stripe(process.env.STRIPE_KEY as string, {
  apiVersion: "2022-08-01",
});

const roles = ["rol_RHllXYZi72sktKTy"]; // Shell premium role

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: VercelRequest, res: VercelResponse) => {
  const sig = req.headers["stripe-signature"] as string;

  const rawBody = await toRawBody(req);

  try {
    const event: Stripe.Event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_SECRET as string
    );

    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(session);

        return res.status(200).json({ handled: true });
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(subscription);

        return res.status(200).send({ handled: true });
      default:
        console.log(`Unhandled event type ${event.type}`);
        return res.status(200).send({ handled: false });
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  if (!session?.metadata?.user) return;

  await auth0.updateUserMetadata(
    {
      id: session.metadata.user,
    },
    {
      sub_id: session.subscription,
    }
  );

  await auth0.assignRolestoUser({ id: session.metadata.user }, { roles });

  console.log(
    `Subscription created: ${JSON.stringify(
      {
        user: session.metadata.user,
        subscription: session.subscription,
        roles,
      },
      null,
      2
    )}`
  );
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const users = await auth0.getUsers({
    fields: "user_metadata,user_id",
  });

  const user = users.find(
    (user) => user.user_metadata?.sub_id === subscription.id
  );

  if (user) {
    await auth0.removeRolesFromUser({ id: user.user_id as string }, { roles });

    await auth0.updateUserMetadata({ id: user.user_id as string }, {});

    console.log(
      `Subscription deleted: ${JSON.stringify(
        {
          user: user.user_id,
          rolesRemoved: roles,
          subscriptionRemoved: subscription.id,
        },
        null,
        2
      )}`
    );
  }
};
