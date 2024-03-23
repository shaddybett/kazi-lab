import React from 'react'
import {Link} from 'react-router-dom'

function Landing() {
  return (
    <div>
      <Link to='/login'>
      <button>
        login
      </button>
      </Link>
      <p>Don't have an account? <Link to='/signup'>Signup</Link></p>
    </div>
  )
}

export default Landing