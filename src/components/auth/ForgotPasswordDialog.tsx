import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiService } from '@/services/apiServices'
import { useToast } from '@/hooks/use-toast'
import { Mail } from 'lucide-react'

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const reset = (): void => {
    setEmail('')
    setEmailError(undefined)
    setIsLoading(false)
    setSent(false)
  }

  const handleOpenChange = (next: boolean): void => {
    if (!next) reset()
    onOpenChange(next)
  }

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required')
      return false
    }
    if (!EMAIL_RE.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(undefined)
    return true
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const response = await apiService.forgotPassword(email.trim())
      if (response.success) {
        setSent(true)
        toast({
          title: 'Check your email',
          description: response.data?.message || 'Password reset link sent to email.',
        })
      } else {
        const detail = response.errors?.detail || response.message || 'Could not send reset link.'
        setEmailError(detail)
        toast({
          title: 'Request failed',
          description: detail,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const inputErrorClass =
    'border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-0'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-subheadline-lg text-gray-800">
            Forgot Password
          </DialogTitle>
          <DialogDescription className="text-body-md text-gray-600">
            Enter your account email and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center space-y-4 text-center pt-2">
            <Mail className="h-12 w-12 text-gray-800" />
            <p className="text-body-md text-gray-700">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
              The link expires in 30 minutes.
            </p>
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="w-full bg-gradient-to-r from-black via-gray-700 to-gray-500 hover:from-gray-800 hover:via-gray-600 hover:to-gray-400 text-white font-medium py-3 rounded-lg transition-all duration-200"
            >
              <span className="font-subheadline">Done</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError(undefined)
                }}
                className={emailError ? inputErrorClass : ''}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-black via-gray-700 to-gray-500 hover:from-gray-800 hover:via-gray-600 hover:to-gray-400 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  <span className="font-subheadline">Sending link...</span>
                </div>
              ) : (
                <span className="font-subheadline">Send Reset Link</span>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordDialog
