export enum Ifeatures {
  //catogry permision
  createCatogryHandler = 'create-category',
  updateCatogryHandler = 'update-category',
  deleteCatogryHandler = 'delete-category',

  //customers permission
  getCustomersHandler = 'get-customers',
  getCustomerHandler = 'get-customer',
  deleteCustomerHandler = 'delete-customer',

  //order permission
  getUserOrdersHandler = 'get-user-order',
  createCashOrderHandler = 'create-cash-order',
  updateIsPaidHandler = 'update-paid-order',
  removeOrderHandler = 'remove-order',
  getSpecificOrderHandler = 'show-specific-order',
  getAllOrderHandler = 'get-all-orders',
  updateOrderStatusHandler = 'update-order-satuts',
  updateOrderHandler = 'update-order',

  //product permission
  createProductHandler = 'create-product',
  updateProductHandler = 'update-product',
  deleteProductHandler = 'delete-product',

  //resturant permission
  updateResturantHandler = 'update-resturant',

  // role permission
  getAllPermissionHandler = 'get-all-permissions',
  createRoleHandler = 'create-role',
  getRolesHandler = 'get-all-roles',
  getRoleHandler = 'get-specific-role',
  updateRoleHandler = 'update-role',
  removeRoleHandler = 'delete-role',

  // stuff permission
  createUserHandler = 'create-new-member',
  getUsersHandler = 'get-all-members',
  updateUserHandler = 'update-member',
  getUserHandler = 'get-one-member',
  removeUserHandler = 'remove-member',

  // type permission
  createTypeHandler = 'create-type',
  getTypesHandler = 'get-all-types',
  getTypeHandler = 'get-one-type',
  updateTypeHandler = 'update-type',
  removeTypesHandler = 'remove-type',

  //tabels permission
  updateTableStatus = 'update-table-status',
  responseHelpHandler = 'response-help-handler',
  getHelpsHandler = 'get-all-helps',
  removeHelpHandler = 'remove-help-handler',

  //store permission
  createStore = 'create store',
  updateStore = 'update store',
  linkProductStore = 'link product to store',
  updateProductStore = 'update product to store',
  deleteStore = 'delete store',
  deleteProductStore = 'delete store product',
}
