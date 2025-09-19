"use client";
import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  UserCheck, 
  UserX, 
  ShieldOff,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "User" | "NGO" | "Corporate";
  status: "Active" | "Suspended" | "Inactive";
  joinDate: string;
}

const Usermanagementtable = () => {
  // Demo data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Ethan Harper",
      email: "ethan.harper@email.com",
      role: "User",
      status: "Active",
      joinDate: "2023-05-15",
    },
    {
      id: 2,
      name: "Olivia Bennett",
      email: "olivia.bennett@email.com",
      role: "NGO",
      status: "Active",
      joinDate: "2023-07-22",
    },
    {
      id: 3,
      name: "Liam Carter",
      email: "liam.carter@email.com",
      role: "Corporate",
      status: "Active",
      joinDate: "2023-09-10",
    },
    {
      id: 4,
      name: "Sophia Davis",
      email: "sophia.davis@email.com",
      role: "User",
      status: "Suspended",
      joinDate: "2023-11-05",
    },
    {
      id: 5,
      name: "Noah Evans",
      email: "noah.evans@email.com",
      role: "User",
      status: "Inactive",
      joinDate: "2023-12-18",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField as keyof User];
    const bValue = b[sortField as keyof User];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = (id: number, newStatus: "Active" | "Suspended" | "Inactive") => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status: newStatus } : user
    ));
    setActiveDropdown(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case "Suspended": return <div className="w-2 h-2 rounded-full bg-yellow-500"></div>;
      case "Inactive": return <div className="w-2 h-2 rounded-full bg-gray-400"></div>;
      default: return null;
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all users, NGOs, and corporate partners</p>
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Roles</option>
              <option value="User">User</option>
              <option value="NGO">NGO</option>
              <option value="Corporate">Corporate</option>
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-600 font-medium">
                <th 
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortField === "name" && (
                      sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4">Email</th>
                <th 
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Role
                    {sortField === "role" && (
                      sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === "status" && (
                      sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${user.role === "User" ? "bg-blue-100 text-blue-700" : 
                        user.role === "NGO" ? "bg-green-100 text-green-700" : 
                        "bg-purple-100 text-purple-700"}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                      ${user.status === "Active" ? "bg-green-100 text-green-700" : 
                        user.status === "Suspended" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-gray-100 text-gray-700"}`}
                    >
                      {getStatusIcon(user.status)}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <div className="relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {activeDropdown === user.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Eye size={16} />
                                View Details
                              </button>
                              
                              {user.status === "Active" && (
                                <button 
                                  onClick={() => handleStatusChange(user.id, "Suspended")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <ShieldOff size={16} />
                                  Suspend User
                                </button>
                              )}
                              
                              {user.status === "Suspended" && (
                                <button 
                                  onClick={() => handleStatusChange(user.id, "Active")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <UserCheck size={16} />
                                  Activate User
                                </button>
                              )}
                              
                              {user.status === "Inactive" && (
                                <button 
                                  onClick={() => handleStatusChange(user.id, "Active")}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <UserCheck size={16} />
                                  Activate User
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleStatusChange(user.id, "Inactive")}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <UserX size={16} />
                                Deactivate
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination would go here */}
      </div>
    </div>
  );
};

export default Usermanagementtable;