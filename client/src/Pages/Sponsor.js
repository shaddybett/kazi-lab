import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js";
import PhoneNumberPopup from '../components/PhoneNumberPopup'

const stripePromise = loadStripe("pk_live_51PpWVz2LNaBLa9OHujPAFFVNHonHKiydkK5BTWeIIDfSfsTX6nOOXlfYZ57dRV6hzOVNwQW4Q7V9SWZAq6DNi1AG00me1GFA0D");
function Sponsor() {
  return (
    <div>Sponsor</div>
  )
}

export default Sponsor