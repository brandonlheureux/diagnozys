import React from 'react'
import { Navigate } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <Navigate to="/dashboard/medical-reports/reports"/>
    </div>
  )
}

export default Home
