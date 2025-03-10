/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { EmployeeForm } from "@/components/EmployeeForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "Admin" | "Staff";
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [companyName, setCompanyName] = useState("Josh Bakery Ventures");
  const [companyAddress, setCompanyAddress] = useState(
    "62, Bode Thomas, Surulere, Lagos"
  );
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("Change role");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Items per page
  const itemsPerPage = 5;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchEmployees();
    }
  }, [status, router]);

  async function fetchEmployees() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/employees");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      
      setError('Something went wrong');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete employee");
      }

      // Success notification
      alert("Employee deleted successfully");

      // Refresh the employee list
      await fetchEmployees();
    } catch (error) {
      setError('Something went wrong');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRoleChange() {
    if (!selectedEmployee || roleFilter === "Change role") return;

    try {
      const employee = employees.find((emp) => emp._id === selectedEmployee);
      if (!employee) return;

      const response = await fetch(`/api/employees/${selectedEmployee}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: roleFilter }),
      });

      if (!response.ok) throw new Error("Failed to update employee role");
      await fetchEmployees();
      setSelectedEmployee(null);
      setRoleFilter("Change role");
    } catch (error) {
      setError("Error updating employee role");
      console.error(error);
    }
  }

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (status === "loading") {
    return <LoadingSpinner size="lg" />;
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Header - Made more compact on mobile */}
      <header className="w-full bg-white border-b border-gray-200 py-2 sm:py-3 px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Getchange Logo"
            width={90}
            height={28}
            className="sm:w-[100px]"
          />
        </div>
        {/* User menu with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white">
              {session?.user?.name?.[0] || "U"}
            </div>
            <span className="hidden sm:inline">
              Hi, {session?.user?.name?.split(" ")[0]}
            </span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Sidebar - Collapsible on mobile */}
        <div className="w-12 sm:w-16 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="flex flex-col gap-6">
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-md">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Main content - Responsive padding and spacing */}
        <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-x-hidden">
          {/* Title section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Employees
            </h1>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 text-sm sm:text-base"
            >
              Add New
            </Button>
          </div>

          {/* Actions section - Stack on mobile */}
          <div className=" rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">
                {companyName}
              </h2>
              <p className="text-sm text-gray-600">{companyAddress}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between ">
              {/* Role filter and change button */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full text-gray-500 sm:w-auto border border-gray-200 bg-white rounded-lg px-2 sm:px-3 py-2 text-sm"
                >
                  <option>Change role</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                </select>
                <Button
                  onClick={handleRoleChange}
                  disabled={!selectedEmployee || roleFilter === "Change role"}
                  className="bg-green-500 hover:bg-green-600 text-white whitespace-nowrap "
                >
                  Change
                </Button>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none border-gray-200 bg-white text-gray-500"
                  />
                  <svg
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* pagination */}
              <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-white border rounded-md min-w-[2rem] text-center">
                    {currentPage}
                  </span>
                  <span>of</span>
                  <span className="px-2 py-1 bg-white border rounded-md min-w-[2rem] text-center">
                    {totalPages}
                  </span>
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table section with better mobile responsiveness */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="sticky left-0 bg-gray-50 px-2 py-2 sm:px-3 sm:py-3 w-8 sm:w-10">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm border-green-300 text-green-500 focus:ring-green-500"
                        />
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      First Name
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Last Name
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Phone
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Role
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee, index) => (
                    <tr
                      key={employee._id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className="sticky left-0 px-2 py-2 sm:px-3 sm:py-3 bg-inherit">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={selectedEmployee === employee._id}
                            onChange={() =>
                              setSelectedEmployee(
                                selectedEmployee === employee._id
                                  ? null
                                  : employee._id
                              )
                            }
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm border-gray-300 text-green-500 focus:ring-green-500"
                          />
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                        {employee.firstName}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                        {employee.lastName}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {employee.email}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        {employee.phone}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full
                          ${
                            employee.role === "Admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => {
                              setEditingEmployee(employee);
                              setShowForm(true);
                            }}
                            className="text-gray-400 hover:text-blue-600 p-1 sm:p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit employee"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="text-gray-400 hover:text-red-600 p-1 sm:p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete employee"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingEmployee(null);
        }}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
      >
        <EmployeeForm
          onClose={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingEmployee(null);
            fetchEmployees();
          }}
          employee={editingEmployee}
        />
      </Modal>
    </div>
  );
}
