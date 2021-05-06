// 账户管理
/* 用户管理 */
const UserMgt = () => import("@/views/userMgt/index");
/* 共有云应账户*/
const PublicCloud = () => import("@/views/userMgt/publicCloud");
/* 共有云应账户详情*/
const PublicCloudDetail = () => import("@/views/userMgt/publicCloudDetail");
/* 共有云应用详情*/
const PublicAppDetail = () => import("@/views/userMgt/publicAppDetail");
/* 私有云应账户*/
const PersonalCloud = () => import("@/views/userMgt/personalCloud");
/* 私有云应账户添加*/
const PraviteAdd = () => import("@/views/userMgt/addPrivateUser");
/* 私有云应账户详情*/
const PraviteUserDetail = () => import("@/views/userMgt/praviteCloudDetail");
const userMgtMap = [
  {
    path: "/user-mgt",
    component: UserMgt,
    meta: {
      name: "用户管理"
    },
    children: [
      {
        path: "/",
        redirect: "public-cloud"
      },
      {
        path: "public-cloud",
        component: PublicCloud,
        name: "publicCloud",
        meta: {
          name: "公有云",
          basePath: "/user-mgt",
          tabActiveIndex: 1
        }
      },
      {
        path: "personal-cloud",
        component: PersonalCloud,
        name: "personalCloud",
        meta: {
          name: "私有云",
          basePath: "/user-mgt",
          tabActiveIndex: 1
        }
      }
    ]
  },
  {
    path: "/public-cloud-detail",
    component: PublicCloudDetail,
    name: "publicCloudDetail",
    meta: {
      name: "用户详情",
      basePath: "/user-mgt",
      tabActiveIndex: 1
    }
  },
  {
    path: "/public-app-detail",
    component: PublicAppDetail,
    name: "publicAppDetail",
    meta: {
      name: "应用详情",
      basePath: "/user-mgt",
      tabActiveIndex: 1
    }
  },
  {
    path: "/pravite-add",
    component: PraviteAdd,
    name: "praviteAdd",
    meta: {
      name: "添加私有云用户",
      basePath: "/user-mgt",
      tabActiveIndex: 1
    }
  },
  {
    path: "/pravite-user-detail",
    component: PraviteUserDetail,
    name: "praviteUserDetail",
    meta: {
      name: "私有云用户详情",
      basePath: "/user-mgt",
      tabActiveIndex: 1
    }
  }
];
export default userMgtMap;
