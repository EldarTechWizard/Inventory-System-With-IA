from rest_framework.permissions import IsAuthenticated,BasePermission

class ManagerPermissions(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Manager').exists()

