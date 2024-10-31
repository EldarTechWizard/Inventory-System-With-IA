from rest_framework.permissions import IsAuthenticated,BasePermission

class ManagerPermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Manager').exists()

class WarehouseManagerPermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='WarehouseManager').exists() or request.user.groups.filter(name='Manager').exists()


class EmployeePermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='EmployeeManager').exists() or request.user.groups.filter(name='Manager').exists()
