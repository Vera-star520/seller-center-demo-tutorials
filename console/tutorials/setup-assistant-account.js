/* ============================================================
   Tutorial: Set Up an Assistant Account - User Permissions flow.
   Requires console/tutorials/_shared.js (loaded first).
   ============================================================ */
(function () {
  const { register } = window.TutorialKit;

  const clearChrome = {
    openNav: null,
    menuOpen: false,
    menuExpand: null,
    groupOpen: false,
    recommendedOpen: null,
    settingsOpen: false,
    assistantInviteActionsOpen: false,
    modal: null,
  };

  const home = (extra) => Object.assign({}, clearChrome, {
    page: "home",
    assistantInviteCreated: false,
    assistantPermissionsTouched: false,
    assistantPermissionsSaved: false,
  }, extra || {});

  const userPermissions = (extra) => Object.assign({}, clearChrome, {
    page: "userPermissions",
    userPermissionsTopTab: "management",
    userManagementTab: "employees",
    openInvitationsTab: "authorisedPartners",
    assistantInviteCreated: false,
  }, extra || {});

  const permissionPage = (permissions, touched) => Object.assign({}, clearChrome, {
    page: "assistantPermissions",
    assistantInviteCreated: true,
    assistantPermissions: permissions || {},
    assistantPermissionsTouched: !!touched,
    assistantPermissionsSaved: false,
  });

  const copiedInvite = userPermissions({
    userPermissionsTopTab: "management",
    userManagementTab: "authorisedPartners",
    assistantInviteCreated: true,
  });

  register({
    id: "setup-assistant-account",
    title: "Set Up an Assistant Account",
    category: "Account Access",
    level: "Account setup",
    summary: "Invite FBABEE as an authorized partner and grant limited shipment-support permissions.",
    est: "5-7 min",
    url: "sellercentral.amazon.example/user-permissions",
    libraryOrder: 3,
    rail: {
      order: ["start", "1", "2", "3", "4", "done"],
      label: { start: "Start", "1": "User Permissions", "2": "Send Link", "3": "Accept Invitation", "4": "Grant Permissions", done: "Done" },
      glyph: { start: "▸", done: "✓" },
    },
    doneTitle: "Assistant account setup complete",
    doneBody: "You have completed the demo setup flow. In your real Seller Central account, send the copied invitation link and store name to FBABEE, then approve the invitation and grant only the permissions needed for shipment support.",
    steps: [
      {
        mkey: "start", chip: "FBABEE · Guided tutorial", target: "", side: "center",
        scenario: { reset: true },
        title: "Set up an Assistant Account",
        body: "This tutorial shows how to invite FBABEE as an authorized partner and grant limited permissions for shipment support. Before you start, make sure you are using the Primary/Admin Seller Central account.",
        tip: "This demo does not connect to a real Amazon account or create real access.",
        action: "next",
      },
      {
        mkey: "1", chip: "Step 1 · Open User Permissions", target: '[data-tour="settings-gear-button"]', side: "left",
        scenario: home({ settingsOpen: false }),
        title: "Open Settings",
        body: "Click the <b>Settings</b> icon to open the Seller Central settings menu.",
        action: "click",
      },
      {
        mkey: "1", chip: "Step 1 · Open User Permissions", target: '[data-tour="settings-user-permissions-menu-item"]', side: "left",
        scenario: home({ settingsOpen: true }),
        title: "Open User Permissions",
        body: "Click <b>User Permissions</b> to manage users and authorized partners for this account.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Send invitation link", target: '[data-tour="authorised-partners-tab"]', side: "bottom",
        scenario: userPermissions({ userPermissionsTopTab: "management", userManagementTab: "employees" }),
        title: "Open Authorised Partners",
        body: "Select <b>Authorised Partners</b> to create a partner invitation instead of adding an employee user.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Send invitation link", target: '[data-tour="add-authorised-partner-button"]', side: "left",
        scenario: userPermissions({ userPermissionsTopTab: "management", userManagementTab: "authorisedPartners" }),
        title: "Add Authorised Partner",
        body: "Click <b>Add Authorised Partner</b> to generate a one-time invitation link.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Send invitation link", target: '[data-tour="copy-invitation-link-button"]', side: "left",
        scenario: userPermissions({
          userPermissionsTopTab: "management",
          userManagementTab: "authorisedPartners",
          assistantInviteModal: true,
        }),
        title: "Copy invitation link",
        body: "Click <b>Copy link</b> to copy the one-time invitation link.",
        tip: "In Seller Central, this link should be shared only with the partner you want to authorize.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Send invitation link", target: '[data-tour="close-invitation-modal-button"]', side: "left",
        scenario: userPermissions({
          userPermissionsTopTab: "management",
          userManagementTab: "authorisedPartners",
          assistantInviteCreated: true,
          assistantInviteModal: true,
        }),
        title: "Close the invitation window",
        body: "Close the invitation window after copying the link.",
        action: "click",
      },
      {
        mkey: "2", chip: "Step 2 · Send invitation link", target: "", side: "center",
        scenario: copiedInvite,
        title: "Send the link to FBABEE",
        body: "Send the <b>copied invitation link</b> and <b>your store name</b> to FBABEE. After FBABEE accepts the link, return to User Permissions to approve the invitation.",
        tip: "<b>You can find your store name from Settings &rarr; Account Info &rarr; Business Information.</b>",
        action: "next",
      },
      {
        mkey: "3", chip: "Step 3 · Accept FBABEE invitation", target: '[data-tour="open-invitations-tab"]', side: "bottom",
        scenario: copiedInvite,
        title: "Open Invitations",
        body: "After FBABEE accepts your invitation link, click <b>Open Invitations</b> to review the partner invitation waiting for your approval.",
        action: "click",
      },
      {
        mkey: "3", chip: "Step 3 · Accept FBABEE invitation", target: '[data-tour="authorised-partners-tab"]', side: "bottom",
        scenario: userPermissions({
          userPermissionsTopTab: "openInvitations",
          openInvitationsTab: "users",
          assistantInviteCreated: true,
        }),
        title: "Choose Authorised Partners",
        body: "Select <b>Authorised Partners</b> to view the FBABEE invitation.",
        action: "click",
      },
      {
        mkey: "3", chip: "Step 3 · Accept FBABEE invitation", target: '[data-tour="fbabee-invitation-actions-button"]', side: "left",
        scenario: userPermissions({
          userPermissionsTopTab: "openInvitations",
          openInvitationsTab: "authorisedPartners",
          assistantInviteCreated: true,
          assistantInviteActionsOpen: false,
        }),
        title: "Open Actions",
        body: "Find <b>FBABEE</b> and click <b>Actions</b>.",
        action: "click",
      },
      {
        mkey: "3", chip: "Step 3 · Accept FBABEE invitation", target: '[data-tour="accept-fbabee-invitation-menu-item"]', side: "left",
        scenario: userPermissions({
          userPermissionsTopTab: "openInvitations",
          openInvitationsTab: "authorisedPartners",
          assistantInviteCreated: true,
          assistantInviteActionsOpen: true,
        }),
        title: "Accept invitation",
        body: "Click <b>Accept invitation</b> to continue to the permission settings page.",
        action: "click",
      },
      {
        mkey: "4", chip: "Step 4 · Grant permissions", target: '[data-tour="permission-awd-secondary-user-access-edit"]', side: "left",
        scenario: permissionPage({}, false),
        title: "Set AWD Secondary User Access",
        body: "Set <b>Amazon Warehousing and Distribution - Secondary User Access</b> to <b>Edit</b> to avoid re-authorization if AWD shipments are needed later.",
        action: "click",
      },
      {
        mkey: "4", chip: "Step 4 · Grant permissions", target: '[data-tour="permission-fulfillment-programs-edit"]', side: "left",
        scenario: permissionPage({ awdSecondaryUserAccess: "edit" }, true),
        title: "Set Fulfillment Programs",
        body: "Set <b>Fulfillment Programs</b> to <b>Edit</b> so FBABEE can support FBA fulfillment-related shipment settings.",
        action: "click",
      },
      {
        mkey: "4", chip: "Step 4 · Grant permissions", target: '[data-tour="permission-inventory-planning-edit"]', side: "left",
        scenario: permissionPage({
          awdSecondaryUserAccess: "edit",
          fulfillmentPrograms: "edit",
        }, true),
        title: "Set Inventory Planning",
        body: "Set <b>Inventory Planning</b> to <b>Edit</b> so FBABEE can help review shipment preparation and replenishment information.",
        action: "click",
      },
      {
        mkey: "4", chip: "Step 4 · Grant permissions", target: '[data-tour="permission-inventory-performance-edit"]', side: "left",
        scenario: permissionPage({
          awdSecondaryUserAccess: "edit",
          fulfillmentPrograms: "edit",
          inventoryPlanning: "edit",
        }, true),
        title: "Set Inventory performance",
        body: "Set <b>Inventory performance</b> to <b>Edit</b> so FBABEE can help check shipment-related inventory issues.",
        action: "click",
      },
      {
        mkey: "4", chip: "Step 4 · Grant permissions", target: '[data-tour="permission-manage-fba-inventory-shipments-edit"]', side: "left",
        scenario: permissionPage({
          awdSecondaryUserAccess: "edit",
          fulfillmentPrograms: "edit",
          inventoryPlanning: "edit",
          inventoryPerformance: "edit",
        }, true),
        title: "Set Manage FBA Inventory/Shipments",
        body: "Set <b>Manage FBA Inventory/Shipments</b> to <b>Edit</b> so FBABEE can help with shipment-related tasks.",
        action: "click",
      },
      {
        mkey: "4", chip: "Step 4 · Grant permissions", target: '[data-tour="permissions-save-changes-button"]', side: "top",
        scenario: permissionPage({
          awdSecondaryUserAccess: "edit",
          fulfillmentPrograms: "edit",
          inventoryPlanning: "edit",
          inventoryPerformance: "edit",
          manageFbaInventoryShipments: "edit",
        }, true),
        title: "Save Changes",
        body: "Click <b>Save Changes</b> to finish the permission setup.",
        action: "click",
      },
    ],
  });
})();
