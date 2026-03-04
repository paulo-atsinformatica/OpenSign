/**
 * Create or update a team for the current user's organization.
 * Used by the Teams settings page (custom fork feature).
 * Params: { objectId?, name, parentId?, isActive }
 */
export default async function saveTeam(request) {
  if (!request?.user) {
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User is not authenticated.');
  }
  const { objectId, name, parentId, isActive } = request.params;
  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new Parse.Error(400, 'Team name is required.');
  }
  try {
    const extUserQuery = new Parse.Query('contracts_Users');
    extUserQuery.equalTo('UserId', {
      __type: 'Pointer',
      className: '_User',
      objectId: request.user.id,
    });
    extUserQuery.notEqualTo('IsDisabled', true);
    const resExt = await extUserQuery.first({ useMasterKey: true });
    if (!resExt) {
      throw new Parse.Error(403, 'User not found or disabled.');
    }
    const extUser = JSON.parse(JSON.stringify(resExt));
    const orgId = extUser?.OrganizationId?.objectId;
    if (!orgId) {
      throw new Parse.Error(403, 'User has no organization.');
    }
    const orgPtr = {
      __type: 'Pointer',
      className: 'contracts_Organizations',
      objectId: orgId,
    };

    if (objectId) {
      // Update existing team
      const teamQuery = new Parse.Query('contracts_Teams');
      const team = await teamQuery.get(objectId, { useMasterKey: true });
      if (!team) {
        throw new Parse.Error(404, 'Team not found.');
      }
      const teamOrgId = team.get('OrganizationId')?.id || team.get('OrganizationId')?.objectId;
      if (teamOrgId !== orgId) {
        throw new Parse.Error(403, 'Cannot update team from another organization.');
      }
      team.set('Name', name.trim());
      team.set('IsActive', isActive !== false);
      if (parentId) {
        const parentQuery = new Parse.Query('contracts_Teams');
        const parent = await parentQuery.get(parentId, { useMasterKey: true });
        if (parent && (parent.get('OrganizationId')?.id || parent.get('OrganizationId')?.objectId) === orgId) {
          team.set('ParentId', { __type: 'Pointer', className: 'contracts_Teams', objectId: parentId });
        }
      } else {
        team.unset('ParentId');
      }
      await team.save(null, { useMasterKey: true });
      return team;
    }

    // Create new team
    const teamCls = new Parse.Object('contracts_Teams');
    teamCls.set('Name', name.trim());
    teamCls.set('IsActive', isActive !== false);
    teamCls.set('OrganizationId', orgPtr);
    if (parentId) {
      const parentQuery = new Parse.Query('contracts_Teams');
      const parent = await parentQuery.get(parentId, { useMasterKey: true });
      if (parent && (parent.get('OrganizationId')?.id || parent.get('OrganizationId')?.objectId) === orgId) {
        teamCls.set('ParentId', { __type: 'Pointer', className: 'contracts_Teams', objectId: parentId });
      }
    }
    await teamCls.save(null, { useMasterKey: true });
    return teamCls;
  } catch (err) {
    if (err instanceof Parse.Error) throw err;
    console.log('err in saveTeam', err);
    throw new Parse.Error(err?.code || 400, err?.message || 'Something went wrong.');
  }
}
