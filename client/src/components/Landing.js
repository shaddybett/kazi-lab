import React from 'react'
import {Link} from 'react-router-dom'
import { Button } from "flowbite-react";

function Landing() {
  return (
    <div>
      <Link to='/login'>
      <Button>
        login
      </Button>
      
      </Link>
      <p>Don't have an account? <Link to='/signup'>Signup</Link></p>
    </div>
  )
}

export default Landing