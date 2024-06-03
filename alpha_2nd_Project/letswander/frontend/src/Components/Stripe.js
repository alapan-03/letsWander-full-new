import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import URL from "./../Components/rootUrl";
import Cookies from 'universal-cookie';

export default function Stripe(props) {

  let cookie = new Cookies();

  async function makePayment() {
    try {
      const stripe = await loadStripe("pk_test_51PFdVzSAGBUk6wlR63cDDG4Umtl2ou7OOX40T7emc50SF6GhB4nZiSqxY753HB3EFiWkPIrqhPfbq8Xh8MWT7HZf00wxUsCL11");

      const headers = {
        "Content-Type": "application/json"
      };

      const response = await fetch(`${URL}/api/v1/makePayment/stripe`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          items: [
            { id: 1, quantity: 3 },
            { id: 2, quantity: 1 }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

    //   console.log("hrnen")

      const session = await response.json();

      cookie.set("sessionId", session.id, {path: "/"})

      if (!session.id) {
        throw new Error('Session ID not returned');
      }
      console.log(session.id)

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <>
    <div className='summary-i2-outer'>
      <button className='summary-book' onClick={makePayment}>Make payment</button>
      </div>
    </>
  );
}
