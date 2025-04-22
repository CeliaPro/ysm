import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  SearchIcon, 
  PlusIcon, 
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  UserIcon,
  CheckIcon,
  XIcon,
  MailIcon
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, User, UserRole } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

interface UserWithStatus extends User {
  status: 'active' | 'invited' | 'inactive';
  lastActive?: Date;
}

const mockProjects = [
  { id: '1', name: 'Finance Portal' },
  { id: '2', name: 'Product Development' },
  { id: '3', name: 'Marketing' },
  { id: '4', name: 'HR Policies' },
];

const mockUsers: UserWithStatus[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 11, 15),
    projects: ['1', '2', '3'],
    status: 'active',
    lastActive: new Date(2023, 11, 15)
  },
  {
    id: '2',
    name: 'Project Manager',
    email: 'manager@example.com',
    role: 'project_manager',
    createdAt: new Date(2023, 5, 16),
    updatedAt: new Date(2023, 11, 14),
    projects: ['1', '2'],
    status: 'active',
    lastActive: new Date(2023, 11, 14)
  },
  {
    id: '3',
    name: 'Employee User',
    email: 'employee@example.com',
    role: 'employee',
    createdAt: new Date(2023, 5, 17),
    updatedAt: new Date(2023, 11, 13),
    projects: ['1'],
    status: 'active',
    lastActive: new Date(2023, 11, 13)
  },
  {
    id: '4',
    name: 'New User',
    email: 'newuser@example.com',
    role: 'employee',
    createdAt: new Date(2023, 5, 18),
    updatedAt: new Date(2023, 5, 18),
    projects: [],
    status: 'invited',
  },
  {
    id: '5',
    name: 'Inactive User',
    email: 'inactive@example.com',
    role: 'employee',
    createdAt: new Date(2023, 5, 19),
    updatedAt: new Date(2023, 10, 20),
    projects: ['3'],
    status: 'inactive',
    lastActive: new Date(2023, 10, 20)
  }
];

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserWithStatus[]>(mockUsers);
  
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('employee');
  const [newUserProjects, setNewUserProjects] = useState<string[]>([]);
  
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithStatus | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('employee');
  const [editUserProjects, setEditUserProjects] = useState<string[]>([]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }
    
    if (!newUserEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    const newUser: UserWithStatus = {
      id: `user-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      projects: newUserProjects,
      status: 'invited',
    };
    
    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('employee');
    setNewUserProjects([]);
    setIsNewUserDialogOpen(false);
    
    toast.success(`Invitation sent to ${newUserEmail}`);
  };
  
  const handleEditUser = () => {
    if (!editingUser) return;
    
    if (!editUserName.trim() || !editUserEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }
    
    if (!editUserEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    const updatedUsers = users.map(user => 
      user.id === editingUser.id
        ? {
            ...user,
            name: editUserName,
            email: editUserEmail,
            role: editUserRole,
            projects: editUserProjects,
          }
        : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    toast.success(`User updated successfully`);
  };
  
  const handleDeleteUser = (user: UserWithStatus) => {
    if (user.id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    
    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers);
    toast.success(`User ${user.name} deleted successfully`);
  };
  
  const toggleUserStatus = (user: UserWithStatus) => {
    if (user.id === currentUser?.id) {
      toast.error("You cannot change your own status");
      return;
    }
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    const updatedUsers = users.map(u => 
      u.id === user.id
        ? { ...u, status: newStatus as 'active' | 'inactive' | 'invited' }
        : u
    );
    
    setUsers(updatedUsers);
    toast.success(`User ${user.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };
  
  const openEditUserDialog = (user: UserWithStatus) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setEditUserProjects(user.projects);
    setIsEditUserDialogOpen(true);
  };
  
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Admin</Badge>;
      case 'project_manager':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Project Manager</Badge>;
      case 'employee':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Employee</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };
  
  const getStatusBadge = (status: 'active' | 'invited' | 'inactive') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'invited':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Invited</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const toggleProjectSelection = (projectId: string, selectedProjects: string[], setSelectedProjects: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage access and permissions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          
          <Button onClick={() => setIsNewUserDialogOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}`} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.lastActive && `Last active ${format(user.lastActive, 'MMM dd, yyyy')}`}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.projects && user.projects.length > 0 ? (
                        <Badge variant="outline" className="whitespace-nowrap">
                          {user.projects.length} projects
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No projects</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{format(user.createdAt, 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      {user.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleUserStatus(user)}
                          className={user.status === 'active' ? 'text-red-500' : 'text-green-500'}
                        >
                          {user.status === 'active' ? <XIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditUserDialog(user)}>
                            <EditIcon className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          
                          {user.status === 'invited' && (
                            <DropdownMenuItem 
                              onClick={() => {
                                toast.success(`Invitation resent to ${user.email}`);
                              }}
                            >
                              <MailIcon className="h-4 w-4 mr-2" />
                              Resend Invitation
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          {user.id !== currentUser?.id && (
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user)}
                              className="text-destructive focus:text-destructive"
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <UserIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No users found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? `No users match "${searchQuery}"`
                        : 'Invite users to get started'}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                placeholder="Enter user name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="Enter user email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as UserRole)}>
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Assign to Projects</Label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {mockProjects.map((project) => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`project-${project.id}`}
                        checked={newUserProjects.includes(project.id)}
                        onCheckedChange={() => toggleProjectSelection(project.id, newUserProjects, setNewUserProjects)}
                      />
                      <label 
                        htmlFor={`project-${project.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {project.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-user-name">Name</Label>
              <Input
                id="edit-user-name"
                placeholder="Enter user name"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-user-email">Email</Label>
              <Input
                id="edit-user-email"
                type="email"
                placeholder="Enter user email"
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-user-role">Role</Label>
              <Select value={editUserRole} onValueChange={(value) => setEditUserRole(value as UserRole)}>
                <SelectTrigger id="edit-user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Assign to Projects</Label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {mockProjects.map((project) => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`edit-project-${project.id}`}
                        checked={editUserProjects.includes(project.id)}
                        onCheckedChange={() => toggleProjectSelection(project.id, editUserProjects, setEditUserProjects)}
                      />
                      <label 
                        htmlFor={`edit-project-${project.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {project.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
