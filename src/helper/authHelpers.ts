// src/helpers/authHelpers.js

function hasPermission(permissionName: any) {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    return permissions.some((permission: any) => permission.name === permissionName);
}

export { hasPermission };


