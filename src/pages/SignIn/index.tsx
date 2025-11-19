import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/containers/Navbar'
import Auth from '@/components/auth/Auth'
import { useAuth } from '@/context'

const SignIn = () => {
  const { getToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (getToken()) {
      navigate('/charts')
    }
  }, [navigate])

  return (
    <>
      <Navbar />
      <Auth mode="signin" />
    </>
  )
}

export default SignIn
