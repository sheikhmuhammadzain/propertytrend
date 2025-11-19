import { useLocation, useNavigate } from 'react-router-dom'
import { MenuBar } from '../ui/glow-menu'
import { BarChart3, LogOut, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Auth from '@/components/auth/Auth'

const Navbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState<string>("")
  const [openLogin, setOpenLogin] = useState(false)
  const [openSignup, setOpenSignup] = useState(false)
  const { getToken, getStoredUser, logout } = useAuth()

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname
    if (path === '/charts') setActiveItem("Charts")
    else if (path === '/users') setActiveItem("Users")
    else setActiveItem("")
  }, [location])

  const menuItems = [
    ...(getToken() ? [
      {
        icon: BarChart3,
        label: "Charts",
        href: "/charts",
        gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
        iconColor: "text-green-500",
      },
      ...(getStoredUser()?.role === 'admin' ? [
        {
          icon: Users,
          label: "Users",
          href: "/users",
          gradient: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(79,70,229,0.06) 50%, rgba(67,56,202,0) 100%)",
          iconColor: "text-indigo-500",
        },
      ] : []),
      {
        icon: LogOut,
        label: "Logout",
        href: null as unknown as string, // No href for logout
        gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
        iconColor: "text-red-500",
        isLogout: true as unknown as boolean, // Flag to identify logout action
      },
    ] : []),
  ] as any

  const handleItemClick = (label: string) => {
    setActiveItem(label)
    const item = menuItems.find(item => item.label === label)
    if (item) {
      if (item.isLogout) {
        // Handle logout
        logout()
        navigate('/')
      } else if (item.href) {
        // Handle navigation
        navigate(item.href)
      }
    }
  }

  return (
    <nav className="bg-[#F1EFED] backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 md:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-2 sm:py-0 sm:h-16">
          {/* Logo - Full width on mobile, left-aligned on desktop */}
          <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start">
          </div>
          
          {/* Navigation Menu / CTA - Right-aligned on desktop */}
          <div className="flex items-center justify-center">
            {getToken() ? (
              <MenuBar
                items={menuItems}
                activeItem={activeItem}
                onItemClick={handleItemClick}
                className="bg-white/60 backdrop-blur-md border border-gray-200/50 w-full sm:w-auto"
              />
            ) : (
              <>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white/70 backdrop-blur-md border border-gray-200/60 text-[#3A3B40] font-light uppercase tracking-[0.2em] px-4 py-2 rounded-lg"
                    >
                      Complimentary Membership
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent align="end" className="bg-white/90 backdrop-blur-md border border-gray-200/60">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setOpenLogin(true)}
                        className="justify-start font-light uppercase tracking-[0.2em]"
                      >
                        Log in
                      </Button>
                      <Button
                        onClick={() => setOpenSignup(true)}
                        className="justify-start font-light uppercase tracking-[0.2em]"
                      >
                        Create account
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <Dialog open={openLogin} onOpenChange={setOpenLogin}>
                  <DialogContent className="bg-white/90 backdrop-blur-sm border border-white/20">
                    <Auth mode="signin" />
                  </DialogContent>
                </Dialog>
                <Dialog open={openSignup} onOpenChange={setOpenSignup}>
                  <DialogContent className="bg-white/90 backdrop-blur-sm border border-white/20">
                    <Auth mode="signup" />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
