<template>
  <div>
    <el-badge is-dot class="item">
      <el-tooltip :content="$t('navbar.notice')" effect="dark" placement="bottom">
        <svg-icon @click="toNotice" class-name="international-icon" icon-class="notice"/>
      </el-tooltip>
    </el-badge>
  </div>
</template>

<script>
export default {
  computed: {},
  methods: {
    toNotice(){
      this.$router.push(`/message`);
    }
  }
};
</script>

<style>
.el-badge__content.is-fixed.is-dot {
  right: 5px;
  top: 18px;
}
</style>

