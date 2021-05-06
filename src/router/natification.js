/* 通知公告*/
const NatifiIndex = () => import("@/views/natification/index");
/* 通知详情*/
const Detail = () => import("@/views/natification/detail");
/* 通知添加*/
const Add = () => import("@/views/natification/add");
const systemMgtMap = [
  {
    path: "/natification",
    component: NatifiIndex,
    name: "natifiIndex",
    meta: {
      name: "通知公告",
      basePath: "/natification",
      tabActiveIndex: 2
    }
  },
  {
    path: "/natifi-add",
    component: Add,
    name: "natifiAdd",
    meta: {
      name: "通知添加",
      basePath: "/natification",
      tabActiveIndex: 2
    }
  },
  {
    path: "/natifi-detail",
    component: Detail,
    name: "natifiDetail",
    meta: {
      name: "通知详情",
      basePath: "/natification",
      tabActiveIndex: 2
    }
  }
];
export default systemMgtMap;
