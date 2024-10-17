import { auth, currentUser } from '@clerk/nextjs/server'
import React from 'react'

const CurrentUser = async () => {
    const { userId } = auth();
    const user = await currentUser();
  
    if (!userId || !user) {
      return <div>You are not logged in</div>;
    }
  return (
      <div>{user.emailAddresses[0].emailAddress}</div>
  )
}

export default CurrentUser