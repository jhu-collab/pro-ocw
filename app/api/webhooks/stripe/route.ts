import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const res = await request.json();

  const { record } = res;

  const { id, name } = record;

  // create a new customer in Stripe

  const customer = await stripe.customers.create({
    name,
    metadata: {
      teamId: id,
    },
  });

  // update user record in supabase profiles table

  const { error } = await supabase
    .from("teams")
    .update({ stripe_customer_id: customer.id })
    .match({ id })
    .single();

  if (error) {
    return new Response(error.message, {
      status: 500,
    });
  }

  return new Response("Success", {
    status: 200,
  });
}
