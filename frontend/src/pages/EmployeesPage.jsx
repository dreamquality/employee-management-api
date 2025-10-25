import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
} from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const limit = 10;

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
        ...(searchTerm && { firstName: searchTerm }),
      };
      const data = await userService.getUsers(params);
      setEmployees(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employees",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await userService.deleteUser(id);
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      fetchEmployees();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete employee",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        {isAdmin && (
          <Button onClick={() => navigate("/employees/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : employees.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No employees found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {employees.map((employee) => (
              <Card
                key={employee.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">
                          {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            employee.role === "admin"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {employee.role === "admin" ? "Admin" : "Employee"}
                        </span>
                      </div>
                      <CardDescription className="mt-1">
                        {employee.email} • {employee.position || "No position"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/employees/${employee.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        Programming Language
                      </p>
                      <p className="font-medium">
                        {employee.programmingLanguage}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                    {employee.country && (
                      <div>
                        <p className="text-muted-foreground">Country</p>
                        <p className="font-medium">{employee.country}</p>
                      </div>
                    )}
                    {employee.englishLevel && (
                      <div>
                        <p className="text-muted-foreground">English Level</p>
                        <p className="font-medium">{employee.englishLevel}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {employees.length} of {total} employees
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
