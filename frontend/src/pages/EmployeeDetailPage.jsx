import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { format } from 'date-fns';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const data = await userService.getUser(id);
      setEmployee(data);
      setFormData(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employee details",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(id, formData);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      setEditing(false);
      fetchEmployee();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to update employee",
      });
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
        <Button variant="ghost" onClick={() => navigate('/employees')}>
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
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName || ''}
                  onChange={handleChange}
                  disabled={!isAdmin}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="programmingLanguage">Programming Language</Label>
                  <Input
                    id="programmingLanguage"
                    name="programmingLanguage"
                    value={formData.programmingLanguage || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {isAdmin && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mentorName">Mentor Name</Label>
                      <Input
                        id="mentorName"
                        name="mentorName"
                        value={formData.mentorName || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="englishLevel">English Level</Label>
                      <Input
                        id="englishLevel"
                        name="englishLevel"
                        value={formData.englishLevel || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentProject">Current Project</Label>
                      <Input
                        id="currentProject"
                        name="currentProject"
                        value={formData.currentProject || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingHoursPerWeek">Working Hours/Week</Label>
                      <Input
                        id="workingHoursPerWeek"
                        name="workingHoursPerWeek"
                        type="number"
                        value={formData.workingHoursPerWeek || ''}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminNote">Admin Note</Label>
                    <textarea
                      id="adminNote"
                      name="adminNote"
                      value={formData.adminNote || ''}
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
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                  <p>{employee.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                  <p>{employee.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Birth Date</h3>
                  <p>{employee.birthDate ? format(new Date(employee.birthDate), 'PPP') : 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Programming Language</h3>
                  <p>{employee.programmingLanguage}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Country</h3>
                  <p>{employee.country || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Position</h3>
                  <p>{employee.position || 'N/A'}</p>
                </div>
                {isAdmin && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Salary</h3>
                      <p>${employee.salary || 0}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Mentor</h3>
                      <p>{employee.mentorName || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">English Level</h3>
                      <p>{employee.englishLevel || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Project</h3>
                      <p>{employee.currentProject || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Working Hours/Week</h3>
                      <p>{employee.workingHoursPerWeek || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Hire Date</h3>
                      <p>{employee.hireDate ? format(new Date(employee.hireDate), 'PPP') : 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
              {isAdmin && employee.adminNote && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Admin Note</h3>
                  <p className="text-sm bg-muted p-4 rounded-md">{employee.adminNote}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
