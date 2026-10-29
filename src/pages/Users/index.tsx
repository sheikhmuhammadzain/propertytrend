import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context'
import { apiService } from '@/services/apiServices'
import Navbar from '@/components/containers/Navbar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Filter, Users as UsersIcon, Mail, Calendar, Shield, CheckCircle, XCircle, RefreshCw, Table, ArrowLeft } from 'lucide-react'

interface User {
  id: number
  user_email: string
  user_full_name: string
  is_verified: boolean
  role: string
  timestamp: string
}

const Users = () => {
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [verificationFilter, setVerificationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('timestamp')

  useEffect(() => {
    if (!getToken()) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await apiService.getUsers()
      if (response.success) {
        setUsers(response.data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...users]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.user_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Verification filter
    if (verificationFilter !== 'all') {
      filtered = filtered.filter(user =>
        verificationFilter === 'verified' ? user.is_verified : !user.is_verified
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.user_full_name.localeCompare(b.user_full_name)
        case 'email':
          return a.user_email.localeCompare(b.user_email)
        case 'timestamp':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case 'verified':
          return b.is_verified ? 1 : -1
        default:
          return 0
      }
    })

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, verificationFilter, sortBy])

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading users...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F1EF] text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-light uppercase tracking-[0.1em]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Table className="h-12 w-12 text-black mr-4" />
            <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.2em] text-black">
              User Management
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light tracking-[0.05em]">
            Manage and monitor all registered users with advanced filtering and search capabilities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white border-2 border-black hover:bg-gray-50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-light uppercase tracking-[0.1em]">Total Users</p>
                  <p className="text-3xl font-light tracking-[0.05em] text-black">{users.length}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-black" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-black hover:bg-gray-50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-light uppercase tracking-[0.1em]">Verified</p>
                  <p className="text-3xl font-light tracking-[0.05em] text-black">
                    {users.filter(user => user.is_verified).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-black hover:bg-gray-50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-light uppercase tracking-[0.1em]">Pending</p>
                  <p className="text-3xl font-light tracking-[0.05em] text-black">
                    {users.filter(user => !user.is_verified).length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-black hover:bg-gray-50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-light uppercase tracking-[0.1em]">Filtered</p>
                  <p className="text-3xl font-light tracking-[0.05em] text-black">{filteredUsers.length}</p>
                </div>
                <Filter className="h-8 w-8 text-black" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-2 border-black mb-8">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-light uppercase tracking-[0.1em] text-black">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-2 border-black text-black placeholder-gray-500 focus:border-black focus:ring-black"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-light uppercase tracking-[0.1em] text-black">Role</label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="shadow-lg">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-black">
                    <SelectItem value="all" className="text-black hover:bg-gray-100">All Roles</SelectItem>
                    <SelectItem value="user" className="text-black hover:bg-gray-100">User</SelectItem>
                    <SelectItem value="admin" className="text-black hover:bg-gray-100">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Verification Filter */}
              <div className="space-y-2">
                <label className="text-sm font-light uppercase tracking-[0.1em] text-black">Verification</label>
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger className="shadow-lg">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-black">
                    <SelectItem value="all" className="text-black hover:bg-gray-100">All Status</SelectItem>
                    <SelectItem value="verified" className="text-black hover:bg-gray-100">Verified</SelectItem>
                    <SelectItem value="unverified" className="text-black hover:bg-gray-100">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-light uppercase tracking-[0.1em] text-black">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="shadow-lg">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-black">
                    <SelectItem value="timestamp" className="text-black hover:bg-gray-100">Newest First</SelectItem>
                    <SelectItem value="name" className="text-black hover:bg-gray-100">Name A-Z</SelectItem>
                    <SelectItem value="email" className="text-black hover:bg-gray-100">Email A-Z</SelectItem>
                    <SelectItem value="verified" className="text-black hover:bg-gray-100">Verified First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white border-2 border-black">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Table className="h-5 w-5 mr-2" />
              Users Table
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-4 px-6 font-light uppercase tracking-[0.1em] text-black">Avatar</th>
                    <th className="text-left py-4 px-6 font-light uppercase tracking-[0.1em] text-black">Name</th>
                    <th className="text-left py-4 px-6 font-light uppercase tracking-[0.1em] text-black">Email</th>
                    <th className="text-left py-4 px-6 font-light uppercase tracking-[0.1em] text-black">Role</th>
                    <th className="text-left py-4 px-6 font-light uppercase tracking-[0.1em] text-black">Status</th>
                    <th className="text-left py-4 px-6 font-light uppercase tracking-[0.1em] text-black">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-300 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                    >
                      <td className="py-4 px-6">
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {getInitials(user.user_full_name)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-black font-light uppercase tracking-[0.1em]">
                        {user.user_full_name}
                      </td>
                      <td className="py-4 px-6 text-black font-light uppercase tracking-[0.1em]">
                        {user.user_email}
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant="outline"
                          className="border-black text-black bg-white font-light uppercase tracking-[0.1em]"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          variant={user.is_verified ? "default" : "secondary"}
                          className={user.is_verified ? "bg-green-600 text-white border-green-600 font-light uppercase tracking-[0.1em]" : "bg-gray-200 text-black border-gray-300 font-light uppercase tracking-[0.1em]"}
                        >
                          {user.is_verified ? "Verified" : "Pending"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-black font-light uppercase tracking-[0.1em]">
                        {formatDate(user.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* No Results */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Table className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-light uppercase tracking-[0.1em] text-gray-600 mb-2">No users found</h3>
                <p className="text-gray-500 font-light tracking-[0.05em]">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Refresh Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-black text-white hover:bg-gray-800 border-2 border-black transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Users
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Users
