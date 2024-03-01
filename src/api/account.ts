import request from "~/axios";
// 用户管理
const customerAPI = {
  // 账户列表
  qryAccountList(data: any) {
    return request.post({ url: "/api/qryAccountList.do", data });
  },
  // 账户详情
  accountDetail(data: any) {
    return request.get({ url: "/api/accountDetail.do", data });
  },
  // 账户包含的菜单列表
  accountContainMenuList(data: any) {
    return request.post({ url: "/api/accountContainMenuList.do", data });
  },
  // 新增账户
  addAccount(data: any) {
    return request.post({ url: "/api/addAccount.do", data });
  },
  
  // 新增权限
  addRole(data: any) {
    return request.post({ url: "/api/addRole.do", data });
  },
  // 删除账户
  deleteAccount(data: any) {
    return request.delete({ url: "/api/deleteAccount.do", data });
  },
  // 删除权限
  deleteRole(data: any) {
    return request.post({ url: "/api/deleteRole.do", data });
  },
  login(data: any)  {
    return request.post({ url: "/api/login.do", data });
  },
  logout(data: any) {
    return request.post({ url: "/api/logout.do", data });
  },
  // 菜单列表
  qryMenuList(data: any) {
    return request.post({ url: "/api/qryMenuList.do", data });
  },
  // 权限列表
  qryRoleList(data: any) {
    return request.post({ url: "/api/qryRoleList.do", data });
  },
  // 权限详情
  roleDetail(data: any) {
    return request.get({ url: "/api/roleDetail.do", data });
  },
  // 更新账户
  updateAccount(data: any) {
    return request.put({ url: "/api/updateAccount.do", data });
  },
  // 更新权限
  updateRole(data: any) {
    return request.put({ url: "/api/updateRole.do", data });
  },
};

export default customerAPI;
