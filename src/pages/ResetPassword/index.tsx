import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Home from '@/pages/Home'
import ResetPasswordDialog from '@/components/auth/ResetPasswordDialog'
import { useToast } from '@/hooks/use-toast'

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const token = searchParams.get('token')
  const [open, setOpen] = useState<boolean>(Boolean(token))

  useEffect(() => {
    if (!token) {
      toast({
        title: 'Invalid link',
        description: 'This password reset link is missing a token.',
        variant: 'destructive',
      })
      navigate('/login', { replace: true })
    }
  }, [token, navigate, toast])

  const handleOpenChange = (next: boolean): void => {
    setOpen(next)
    if (!next) navigate('/login', { replace: true })
  }

  return (
    <>
      <Home />
      {token && (
        <ResetPasswordDialog open={open} onOpenChange={handleOpenChange} token={token} />
      )}
    </>
  )
}

export default ResetPassword
