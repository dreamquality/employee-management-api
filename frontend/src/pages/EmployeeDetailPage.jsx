import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { userProjectService } from "../services/userProjectService";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { format } from "date-fns";
import MultiProjectSelect from "@/components/MultiProjectSelect";
import MultiProjectDisplay from "@/components/MultiProjectDisplay";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [primaryProjectId, setPrimaryProjectId] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUser(id);
      setEmployee(data);
      setFormData(data);
      
      // Fetch user projects
      try {
        const projects = await userProjectService.getUserProjects(id);
        setUserProjects(projects.projects || []);
        
        // Set selected projects for editing
        const projectsArray = (projects.projects || []).map(up => up.project);
        setSelectedProjects(projectsArray);
        
        // Set primary project
        const primary = (projects.projects || []).find(up => up.isPrimary);
        if (primary) {
          setPrimaryProjectId(primary.projectId);
        }
      } catch (projectError) {
        // If user has no projects or error fetching, just continue
        console.log("No projects or error fetching projects", projectError);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employee details",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up data before sending
      const dataToSend = { ...formData };
      
      // Remove password field if it's empty (don't update password)
      if (!dataToSend.password || dataToSend.password.trim() === '') {
        delete dataToSend.password;
      }
      
      await userService.updateUser(id, dataToSend);
      
      // Update user projects if any are selected
      if (selectedProjects.length > 0) {
        const projectIds = selectedProjects.map(p => p.id);
        await userProjectService.setUserProjects(id, projectIds, primaryProjectId);
      } else {
        // If no projects selected, clear all projects
        await userProjectService.setUserProjects(id, [], null);
      }
      
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      setEditing(false);
      fetchEmployee();
    } catch (error) {
      // Handle validation errors array from backend
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const errorMessages = error.response.data.errors
          .map((err) => `${err.param}: ${err.msg}`)
          .join("\n");
        toast({
          variant: "destructive",
          title: "Validation Errors",
          description: errorMessages,
          duration: 8000, // Show longer for multiple errors
        });
      } else {
        // Single error message
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.error || "Failed to update employee",
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!employee) {
    return <div className="text-center py-12">Employee not found</div>;
  }

  const canEdit = isAdmin || user?.id === employee.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/employees")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
        {canEdit && !editing && (
          <Button onClick={() => setEditing(true)}>Edit</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {employee.firstName} {employee.lastName}
          </CardTitle>
          <CardDescription>Employee Details</CardDescription>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={
                      formData.birthDate
                        ? formData.birthDate.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="programmingLanguage">
                    Programming Language
                  </Label>
                  <Input
                    id="programmingLanguage"
                    name="programmingLanguage"
                    value={formData.programmingLanguage || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankCard">Bank Card</Label>
                  <Input
                    id="bankCard"
                    name="bankCard"
                    value={formData.bankCard || ""}
                    onChange={handleChange}
                    placeholder="1234-5678-9012-3456"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input
                    id="githubLink"
                    name="githubLink"
                    value={formData.githubLink || ""}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedinLink">LinkedIn Link</Label>
                  <Input
                    id="linkedinLink"
                    name="linkedinLink"
                    value={formData.linkedinLink || ""}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
              {isAdmin && (
                <>
                  <hr className="my-6" />
                  <h3 className="text-lg font-semibold mb-4">
                    Admin-Only Fields
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role || "employee"}
                        onChange={handleChange}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mentorName">Mentor Name</Label>
                      <Input
                        id="mentorName"
                        name="mentorName"
                        value={formData.mentorName || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="englishLevel">English Level</Label>
                      <Input
                        id="englishLevel"
                        name="englishLevel"
                        value={formData.englishLevel || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hireDate">Hire Date</Label>
                      <Input
                        id="hireDate"
                        name="hireDate"
                        type="date"
                        value={
                          formData.hireDate
                            ? formData.hireDate.split("T")[0]
                            : ""
                        }
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursPerWeek">
                        Working Hours/Week
                      </Label>
                      <Input
                        id="workingHoursPerWeek"
                        name="workingHoursPerWeek"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.workingHoursPerWeek || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projects">Projects</Label>
                    <MultiProjectSelect
                      value={selectedProjects}
                      onChange={setSelectedProjects}
                      primaryProjectId={primaryProjectId}
                      onPrimaryChange={setPrimaryProjectId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      New Password (leave empty to keep current)
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password || ""}
                      onChange={handleChange}
                      placeholder="Enter new password to change"
                    />
                    <p className="text-xs text-muted-foreground">
                      Password will be automatically hashed for security
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacationDates">
                      Vacation Dates (comma-separated: YYYY-MM-DD)
                    </Label>
                    <Input
                      id="vacationDates"
                      name="vacationDates"
                      value={
                        Array.isArray(formData.vacationDates)
                          ? formData.vacationDates.join(", ")
                          : formData.vacationDates || ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        const datesArray = value
                          ? value
                              .split(",")
                              .map((d) => d.trim())
                              .filter((d) => d)
                          : [];
                        setFormData({ ...formData, vacationDates: datesArray });
                      }}
                      placeholder="2024-12-25, 2024-12-26"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminNote">Admin Note</Label>
                    <textarea
                      id="adminNote"
                      name="adminNote"
                      value={formData.adminNote || ""}
                      onChange={handleChange}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setFormData(employee);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </h3>
                  <p>{employee.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Phone
                  </h3>
                  <p>{employee.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Birth Date
                  </h3>
                  <p>
                    {employee.birthDate
                      ? format(new Date(employee.birthDate), "PPP")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Programming Language
                  </h3>
                  <p>{employee.programmingLanguage}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Country
                  </h3>
                  <p>{employee.country || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Bank Card
                  </h3>
                  <p>{employee.bankCard || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    GitHub
                  </h3>
                  <p>
                    {employee.githubLink ? (
                      <a
                        href={employee.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {employee.githubLink}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    LinkedIn
                  </h3>
                  <p>
                    {employee.linkedinLink ? (
                      <a
                        href={employee.linkedinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {employee.linkedinLink}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Position
                  </h3>
                  <p>{employee.position || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Role
                  </h3>
                  <p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.role === "admin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {employee.role === "admin" ? "Admin" : "Employee"}
                    </span>
                  </p>
                </div>
                {isAdmin && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Salary
                      </h3>
                      <p>${employee.salary || 0}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Mentor
                      </h3>
                      <p>{employee.mentorName || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        English Level
                      </h3>
                      <p>{employee.englishLevel || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Projects
                      </h3>
                      <MultiProjectDisplay projects={userProjects} displayLimit={5} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Working Hours/Week
                      </h3>
                      <p>{employee.workingHoursPerWeek || "N/A"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Hire Date
                      </h3>
                      <p>
                        {employee.hireDate
                          ? format(new Date(employee.hireDate), "PPP")
                          : "N/A"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Vacation Dates
                      </h3>
                      <p>
                        {employee.vacationDates &&
                        Array.isArray(employee.vacationDates) &&
                        employee.vacationDates.length > 0
                          ? employee.vacationDates
                              .map((date) => format(new Date(date), "PPP"))
                              .join(", ")
                          : "N/A"}
                      </p>
                    </div>
                  </>
                )}
              </div>
              {isAdmin && employee.adminNote && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Admin Note
                  </h3>
                  <p className="text-sm bg-muted p-4 rounded-md">
                    {employee.adminNote}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
