<template>
  <div>
    <div class="title">
      <span style="font-weight:bold">消息通知</span>
      <span class="more" @click='toList'>更多></span>
    </div>
    <div class="content">
      <p v-for="(item,index) in content" :key="index">
        <!-- <span class="dot"></span> -->
        {{index+1}}.{{item.title}}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: [
        "江西分公司已经上传了XXX分店的风味布局定价计划表",
        "江西分公司已经上传了XXX分店的风味布局定价计划表",
        "江西分公司已经上传了XXX分店的风味布局定价计划表",
        "江西分公司已经上传了XXX分店的风味布局定价计划表",
        "江西分公司已经上传了XXX分店的风味布局定价计划表"
      ],
      query: {
        offset: 0,
        limit: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      let params = this.query;
      this.$axios
        .get("/managerapi/custome/notice/list", { params })
        .then(res => {
          this.content = res.datas.rows;
        });
    },
    toList(){
      this.$router.push('/notice/list')
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  background: #fff;
  padding: 10px 20px 10px;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  font-size: 14px;
}
.el-table.nobg thead tr th {
  background: #fff;
}
.more {
  float: right;
  cursor: pointer;
}
.content {
  padding-left: 20px;
  padding-bottom: 30px;
}
.dot {
  width: 6px;
  height: 6px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
  margin-bottom: 3px;
  margin-right: 3px;
}
</style>