<template>
  <el-dropdown trigger="click" :hide-on-click="false">
    <div>
      <el-tooltip :content="$t('navbar.setting')" effect="dark" placement="bottom">
        <svg-icon class-name="setting-icon" icon-class="setting"/>
      </el-tooltip>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>
        <div class="drawer-item">
          <span>{{ $t('settings.theme') }}</span>
          <theme-picker
            style="float: right;height: 26px;margin: 2px 8px 0 0;"
            @change="themeChange"
          />
        </div>
      </el-dropdown-item>
      <el-dropdown-item divided>
        <div class="drawer-item">
          <span>{{ $t('settings.tagsView') }}</span>
          <el-switch v-model="tagsView" class="drawer-switch"/>
        </div>
      </el-dropdown-item>
      <el-dropdown-item divided>
        <div class="drawer-item">
          <span>{{ $t('settings.fixedHeader') }}</span>
          <el-switch v-model="fixedHeader" class="drawer-switch"/>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  components: { ThemePicker },
  data() {
    return {};
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val
        });
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val
        });
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val
        });
      }
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: val
      });
    }
  }
};
</script>
