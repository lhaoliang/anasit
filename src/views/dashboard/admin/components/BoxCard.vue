<template>
  <div>
    <div class="title">
      <span style="font-weight:bold">黑名单</span>
      <span class="more" @click="toMore">更多></span>
    </div>
    <el-table class="nobg" :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="原所在公司" align="center">
        <template slot-scope="scope">{{ scope.row.companyName }}</template>
      </el-table-column>
      <el-table-column label="经营项目" align="center">
        <template slot-scope="scope">{{ scope.row.projectName }}</template>
      </el-table-column>
      <el-table-column label="录入时间" align="center">
        <template slot-scope="scope">{{ scope.row.createdAt }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        offset: 0,
        limit: 10,
        companyId:''
      },
      list: [
        {
          name: "张三",
          company: "江西分公司",
          item: "拉面",
          time: "2019-6-20"
        },
        {
          name: "张三",
          company: "江西分公司",
          item: "拉面",
          time: "2019-6-20"
        },
        {
          name: "张三",
          company: "江西分公司",
          item: "拉面",
          time: "2019-6-20"
        },
        {
          name: "张三",
          company: "江西分公司",
          item: "拉面",
          time: "2019-6-20"
        },
        {
          name: "张三",
          company: "江西分公司",
          item: "拉面",
          time: "2019-6-20"
        },
        {
          name: "张三",
          company: "江西分公司",
          item: "拉面",
          time: "2019-6-20"
        }
      ],
      roleId: 0,
      loading: false
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.loading = true;
      this.$axios.get("/managerapi/sysuser/info", {}).then(res => {
        this.loading = false;
        this.roleId = res.datas.roleId;
        if (res.datas.roleId == 3) {
          // this.query.companyId = res.datas.companyId;
        }
        this.getList();
      });
    },
    getList() {
      let params = this.query;
      this.$axios
        .get("/managerapi/custome/blacklist/list", {
          params
        })
        .then(res => {
          if (res.result) {
            this.list = res.datas.rows;
          }
        });
    },
    toMore() {
      this.$router.push("/blacklist/blackAdmin");
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
</style>