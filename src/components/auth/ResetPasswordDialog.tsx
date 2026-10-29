import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiService } from '@/services/apiServices'
import { useToast } from '@/hooks/use-toast'

interface ResetPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  token: string
}

interface FieldErrors {
  password?: string
  confirmPassword?: string
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({ open, onOpenChange, token }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const validate = (): boolean => {
    const next: FieldErrors = {}
    if (!password) {
      next.password = 'Password is required'
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters long.'
    }
    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      next.confirmPassword = 'Passwords do not match'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const response = await apiService.resetPassword(token, password)
      if (response.success) {
        toast({
          title: 'Password reset successful',
          description: 'You can now sign in with your new password.',
        })
        onOpenChange(false)
        navigate('/login', { replace: true })
      } else {
        const detail =
          response.errors?.detail || response.message || 'Could not reset password.'
        toast({
          title: 'Reset failed',
          description: detail,
          variant: 'destructive',
        })
        if (/8 characters/i.test(detail)) {
          setErrors({ password: detail })
        }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-subheadline-lg text-gray-800">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-body-md text-gray-600">
            Choose a new password for your account. Must be at least 8 characters.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
              }}
              className={errors.password ? inputErrorClass : ''}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword)
                  setErrors((p) => ({ ...p, confirmPassword: undefined }))
              }}
              className={errors.confirmPassword ? inputErrorClass : ''}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
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
                <span className="font-subheadline">Resetting...</span>
              </div>
            ) : (
              <span className="font-subheadline">Reset Password</span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordDialog
