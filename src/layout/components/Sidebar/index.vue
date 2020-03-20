<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse"/>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      permission_routes: [
        {
          path: "",
          component: "layout/Layout",
          redirect: "dashboard",
          children: [
            {
              path: "dashboard",
              component: () => import("@/views/dashboard/index"),
              name: "Dashboard",
              meta: { title: "dashboard", icon: "dashboard", affix: true }
            },
            {
              path: "message",
              hidden: true,
              name: "消息通知",
              component: () => import("@/views/message/index")
            }
          ]
        },
        {
          path: "/permission",
          component: "layout/Layout",
          redirect: "/permission/index",
          alwaysShow: true,
          meta: {
            title: "permission",
            icon: "lock",
            roles: ["admin", "editor"]
          },
          children: [
            {
              path: "page",
              component: "views/permission/page",
              name: "PagePermission",
              meta: {
                title: "pagePermission",
                roles: ["admin"]
              }
            },
            {
              path: "directive",
              component: "views/permission/directive",
              name: "DirectivePermission",
              meta: {
                title: "directivePermission"
              }
            },
            {
              path: "menubar",
              component: "views/permission-setting/menu-bar",
              name: "RolePermission",
              meta: {
                title: "rolePermission",
                roles: ["admin"]
              }
            }
          ]
        },
        {
          path: "/i18n",
          component: "layout/Layout",
          children: [
            {
              path: "index",
              component: "views/i18n-demo/index",
              name: "I18n",
              meta: { title: "i18n", icon: "international" }
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    // 获取菜单栏
    getUserMenu() {
      this.$axios.get("managerapi/system/menu").then(res => {
        console.log(res);
        this.permission_routes = res.datas;
      });
    }
  },
  created() {
    // console.log(this.permission_routes);
    this.getUserMenu();
  }
};
</script>
