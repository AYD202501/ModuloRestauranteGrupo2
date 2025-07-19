// app/dashboard/usuarios/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, Edit, Shield, User, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface Usuario {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [newRole, setNewRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userRole = "ADMIN"; // Mock - después integrar con session

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: Usuario) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowEditDialog(true);
    setError('');
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || newRole === selectedUser.role) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: newRole
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar usuario');
      }

      const updatedUser = await response.json();
      
      // Actualizar la lista de usuarios
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      setShowEditDialog(false);
      setSelectedUser(null);
      setSuccess(`Rol actualizado exitosamente para ${updatedUser.email}`);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = (error instanceof Error) ? error.message : 'Error al actualizar usuario';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDialog = () => {
    setShowEditDialog(false);
    setSelectedUser(null);
    setNewRole('');
    setError('');
  };

  const getRoleIcon = (role: string) => {
    return role === "ADMIN" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const getRoleBadgeColor = (role: string) => {
    return role === "ADMIN" 
      ? "bg-purple-100 text-purple-800" 
      : "bg-blue-100 text-blue-800";
  };

  // Verificar si es ADMIN
  if (userRole !== "ADMIN") {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="text-center p-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600">Solo los administradores pueden acceder a esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2">Cargando usuarios...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra usuarios y sus roles en el sistema</p>
        </div>
        
        <Button 
          onClick={fetchUsers}
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Usuarios del Sistema ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay usuarios registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Nombre</th>
                    <th className="text-left p-4 font-semibold">Rol</th>
                    <th className="text-left p-4 font-semibold">Fecha de Creación</th>
                    <th className="text-left p-4 font-semibold">Última Actualización</th>
                    <th className="text-left p-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium">{user.email}</td>
                      <td className="p-4">{user.name || 'Sin nombre'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="flex items-center"
                          disabled={isSubmitting}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar Rol
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar usuario */}
      {showEditDialog && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label>Correo del Usuario</Label>
                <div className="p-2 bg-gray-100 rounded border text-gray-700">
                  {selectedUser.email}
                </div>
              </div>

              <div>
                <Label>Nombre</Label>
                <div className="p-2 bg-gray-100 rounded border text-gray-700">
                  {selectedUser.name || 'Sin nombre'}
                </div>
              </div>

              <div>
                <Label>Rol Actual</Label>
                <div className="p-2 bg-gray-100 rounded border">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                    {getRoleIcon(selectedUser.role)}
                    <span className="ml-1">{selectedUser.role}</span>
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="role">Nuevo Rol</Label>
                <select
                  id="role"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="USER">USER - Usuario Regular</option>
                  <option value="ADMIN">ADMIN - Administrador</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {newRole === "ADMIN" 
                    ? "Acceso completo a todas las funcionalidades"
                    : "Acceso limitado a transacciones y productos"
                  }
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={resetDialog}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpdateRole}
                  disabled={isSubmitting || newRole === selectedUser.role}
                  className="bg-[#6e1e1e] hover:bg-[#5a1818]"
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar Rol"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información sobre roles */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Información sobre Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-semibold text-purple-600">ADMIN</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Acceso completo a todas las funcionalidades</li>
                <li>• Gestión de usuarios y roles</li>
                <li>• Creación y edición de productos</li>
                <li>• Visualización de todas las transacciones</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-600">USER</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Acceso a gestión de transacciones</li>
                <li>• Visualización de productos</li>
                <li>• Registro de movimientos de inventario</li>
                <li>• Sin acceso a gestión de usuarios</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}