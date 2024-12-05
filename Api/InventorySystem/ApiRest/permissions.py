from rest_framework.permissions import IsAuthenticated,BasePermission

class ManagerPermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Admin').exists()

class WarehouseManagerPermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Warehouse').exists() or request.user.groups.filter(name='Admin').exists()


class EmployeePermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Sales').exists() or request.user.groups.filter(name='Admin').exists()
