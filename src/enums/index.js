// enums
/** @enum {number} */
const SortValue = {
  asc: 1,
  desc: -1,
};

/** @enum {string} */
const ResponseStatus = {
  SUCCESS: "success",
  FAILED: "failed",
};

/** @enum {string} */
const STACKHOLDER = {
  USER: "user",
  ADMIN: "admin",
  MANAGER: 'manager',
  SUPER_ADMIN: 'super-admin'
};

/** @enum {string} */
const ORDER_STAT = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CANCELED: "canceled"
};

module.exports = {
  SortValue,
  ResponseStatus,
  STACKHOLDER,
  ORDER_STAT
};