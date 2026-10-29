"use client"

import { useState } from "react"
import { Home, Settings, Bell, User } from "lucide-react"
import { MenuBar } from "./glow-menu"

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: User,
    label: "Profile",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "text-red-500",
  },
]

export function MenuBarDemo() {
  const [activeItem, setActiveItem] = useState<string>("Home")

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          Glow Menu Component Demo
        </h1>
        <div className="flex justify-center px-2 sm:px-0">
          <MenuBar
            items={menuItems}
            activeItem={activeItem}
            onItemClick={setActiveItem}
            className="bg-white/80 backdrop-blur-md border border-gray-200/50 w-full sm:w-auto"
          />
        </div>
        <div className="mt-6 sm:mt-8 text-center text-gray-600 px-4 sm:px-0">
          <p className="text-sm sm:text-base">Click on different menu items to see the glow effect and 3D rotation animation.</p>
          <p className="mt-2 text-sm sm:text-base">Current active item: <span className="font-semibold text-blue-600">{activeItem}</span></p>
        </div>
      </div>
    </div>
  )
}
