package com.thinkbuild.accounts.auth;

public record PermissionDto(
        boolean canView,
        boolean canCreate,
        boolean canEdit,
        boolean canDelete,
        boolean canApprove,
        boolean canPrint
) {
    public static PermissionDto none() {
        return new PermissionDto(false, false, false, false, false, false);
    }

    public static PermissionDto fromEntity(Permission permission) {
        if (permission == null) {
            return none();
        }
        return new PermissionDto(
                permission.isCanView(),
                permission.isCanCreate(),
                permission.isCanEdit(),
                permission.isCanDelete(),
                permission.isCanApprove(),
                permission.isCanPrint()
        );
    }
}
