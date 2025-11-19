import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiService } from '@/services/apiServices'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyAccount = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setVerificationStatus('error')
        setMessage('Invalid verification link. No token provided.')
        setIsLoading(false)
        return
      }

      try {
        const response = await apiService.activateAccount(token)
        
        if (response.success) {
          setVerificationStatus('success')
          setMessage('Your account has been successfully verified!')
          toast({
            title: "Account Verified Successfully!",
            description: "Welcome! Your account is now active and ready to use.",
            variant: "default",
          })
        } else {
          setVerificationStatus('error')
          setMessage(response.errors.detail || 'Verification failed. Please try again.')
          toast({
            title: "Verification Failed",
            description: response.message || "Unable to verify your account. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        setVerificationStatus('error')
        setMessage('A network error occurred. Please check your connection and try again.')
        toast({
          title: "Verification Error",
          description: "A network error occurred. Please check your connection and try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    verifyAccount()
  }, [searchParams, toast])

  const handleContinue = () => {
    navigate('/login')
  }


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-black rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black">
                Account Verification
              </h1>
            </div>
            <p className="text-gray-600">
              {isLoading ? 'Verifying your account...' : 'Account verification status'}
            </p>
          </div>

          {/* Content */}
          <div className="text-center">
            {isLoading && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-16 w-16 text-black animate-spin" />
                <p className="text-gray-600">Please wait while we verify your account...</p>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
                <h2 className="text-xl font-semibold text-black">Verification Successful!</h2>
                <p className="text-gray-600">{message}</p>
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-black text-white hover:bg-gray-800 font-medium py-3 rounded-lg transition-all duration-200"
                >
                  Continue to Login
                </Button>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-16 w-16 text-red-600" />
                <h2 className="text-xl font-semibold text-black">Verification Failed</h2>
                <p className="text-gray-600">{message}</p>
                <div className="flex flex-col space-y-2 w-full">
                 
                  <Button 
                    onClick={handleContinue}
                    className="w-full bg-black text-white hover:bg-gray-800 font-medium py-3 rounded-lg transition-all duration-200"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Having trouble? Contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Verify
