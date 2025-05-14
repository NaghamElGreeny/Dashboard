// Get permissions from localStorage

// Helper function to check permissions or return true if no permissions are set
function hasPermission(permissionName: any) {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    if (permissions.length === 0) {
        // If permissions array is empty, allow access to all items
        return true;
    }
    // Otherwise, check for the specific permission
    return permissions.some((permission: any) => permission.name === permissionName);
}

export { hasPermission };
