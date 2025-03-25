'use client'

import { useSession } from 'next-auth/react'
import React from 'react'

const Dashboard = () => {
  const {data:session} = useSession()
  return (
    <div>{JSON.stringify(session?.user)}</div>
  )
}

export default Dashboard