import React from 'react'

function BlockedUsers({blocked}) {
  return (
    <div>
        {blocked ? <div key={blocked.id} >
        {blocked.first_name} {blocked.last_name} {blocked.reason}
        </div> : <p>No blocked users to display</p>}
    </div>
  )
}

export default BlockedUsers