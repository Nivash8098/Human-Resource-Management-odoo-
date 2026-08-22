import React, { useState, useEffect } from 'react';
import { employeeService } from '../../services/api';
import { User, UserRole } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { AddEmployeeModal } from '../../components/features/AddEmployeeModal';
import { formatDate } from '../../lib/utils';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  Eye, 
  ExternalLink,
  Building2 
} from 'lucide-react';

interface EmployeeDirectoryPageProps {
  onNavigate: (route: string) => void;
}

export const EmployeeDirectoryPage: React.FC<EmployeeDirectoryPageProps> = ({ onNavigate }) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadEmployees = async () => {
    try {
      const list = await employeeService.getEmployees();
      setEmployees(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.job_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-sky-400 uppercase">
              People & Organization
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">Global Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Workforce Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your organization's employees, roles, departments, and employment statuses.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Employee
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search by name, ID, job title, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />

          <Select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product Design">Product Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="People Operations">People Operations</option>
          </Select>

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Employment Statuses</option>
            <option value="active">Active Members</option>
            <option value="inactive">Inactive / On Leave</option>
          </Select>
        </div>
      </Card>

      {/* Comprehensive Workforce Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
          </div>
          <span className="text-xs text-slate-400 font-medium">Sorted by joining date</span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1c] border-y border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Employee</th>
                  <th className="py-3 px-4 sm:px-6">Employee ID</th>
                  <th className="py-3 px-4 sm:px-6">Department & Title</th>
                  <th className="py-3 px-4 sm:px-6">Work Mode</th>
                  <th className="py-3 px-4 sm:px-6">Role</th>
                  <th className="py-3 px-4 sm:px-6">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No employees match your search query or filters.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() => onNavigate(`/employees/${emp.id}`)}
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {emp.avatar_url ? (
                            <img
                              src={emp.avatar_url}
                              alt={emp.full_name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-950/80 text-sky-400 border border-blue-800/40 flex items-center justify-center font-bold text-xs">
                              {emp.full_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-white block hover:text-sky-400 transition-colors">
                              {emp.full_name}
                            </span>
                            <span className="text-[11px] text-slate-400">{emp.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-300 font-bold">
                        {emp.employee_id}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="text-white font-semibold">{emp.job_title}</div>
                        <div className="text-[11px] text-slate-400">{emp.department}</div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-semibold">
                          {emp.work_mode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="text-[11px] font-mono uppercase font-bold text-slate-300">
                          {emp.role === 'hr_admin' ? 'HR ADMIN' : 'EMPLOYEE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <Badge
                          variant={emp.status === 'active' ? 'success' : 'neutral'}
                          size="sm"
                          dot
                        >
                          {emp.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigate(`/employees/${emp.id}`)}
                          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadEmployees}
      />
    </div>
  );
};
