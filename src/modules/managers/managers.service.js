import * as managerModel from "./managers.model.js";

/*===========================================================================
| CREATE MANAGER
===========================================================================*/

export async function createManager(payload) {
  const { name, email, password, phone, salary, joining_date, branch_id } = payload;

  if (!name || !email || !password || !phone || !branch_id) {
    const error = new Error("name, email, password, phone and branch_id are required");
    error.statusCode = 400;
    throw error;
  }

  const result = await managerModel.createManagerQuery({
    name,
    email,
    password,
    phone,
    salary,
    joining_date,
    branch_id,
  });

  return result;
}

/*===========================================================================
| GET MANAGERS (scoped to the requesting admin's assigned branches)
===========================================================================*/

export async function getManagers(user) {
  if (user.role === "super_admin") {
    return await managerModel.getAllManagersQuery();
  }

  return await managerModel.getManagersByUserBranchesQuery(user.user_id);
}

/*===========================================================================
| GET SINGLE MANAGER
===========================================================================*/

export async function getSingleManager(manager_id) {
  const manager = await managerModel.getSingleManagerQuery(manager_id);

  if (!manager) {
    const error = new Error("Manager not found");
    error.statusCode = 404;
    throw error;
  }

  return manager;
}

/*===========================================================================
| UPDATE MANAGER
===========================================================================*/

export async function updateManager(manager_id, payload) {
  const existing = await managerModel.getSingleManagerQuery(manager_id);

  if (!existing) {
    const error = new Error("Manager not found");
    error.statusCode = 404;
    throw error;
  }

  const phone = payload.phone ?? existing.phone;
  const salary = payload.salary ?? existing.salary;
  const joining_date = payload.joining_date ?? existing.joining_date;

  await managerModel.updateManagerQuery(manager_id, { phone, salary, joining_date });

  return await managerModel.getSingleManagerQuery(manager_id);
}

/*===========================================================================
| DELETE MANAGER
===========================================================================*/

export async function deleteManager(manager_id) {
  const existing = await managerModel.getSingleManagerQuery(manager_id);

  if (!existing) {
    const error = new Error("Manager not found");
    error.statusCode = 404;
    throw error;
  }

  await managerModel.deleteManagerQuery(manager_id);

  return existing;
}