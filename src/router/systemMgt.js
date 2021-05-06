/* 系统管理*/
const SystemIndex = () => import("@/views/systemMgt/index");
/* 系统设置*/
const SystemSet = () => import("@/views/systemMgt/systemSet");
/* 操作日志*/
const OperationLog = () => import("@/views/systemMgt/operationLog");
const systemMgtMap = [
  {
    path: "/system-mgt",
    component: SystemIndex,
    meta: {
      name: "系统管理"
    },
    children: [
      {
        path: "/",
        redirect: "system-set"
      },
      {
        path: "system-set",
        component: SystemSet,
        name: "systemSet",
        meta: {
          name: "系统设置",
          basePath: "/system-mgt",
          tabActiveIndex: 3
        }
      },
      {
        path: "operation-log",
        component: OperationLog,
        name: "operationLog",
        meta: {
          name: "操作日志",
          basePath: "/system-mgt",
          tabActiveIndex: 3
        }
      }
    ]
  }
];
export default systemMgtMap;
