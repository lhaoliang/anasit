<template>
  <div>
    <div class="title">
      <span style="font-weight:bold">巡店检查排名</span>
      <span class="more" @click="toMore">更多></span>
    </div>
    <div style="background:#fff;">
      <el-select
        key="2"
        v-if="roleId!=3"
        @change="changeCompany"
        style="margin-left:20px;margin-top:10px;"
        v-model="search.companyId"
        placeholder="请选择分公司"
      >
        <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select
        key="3"
        v-else
        @change="changeCompany"
        style="margin-left:20px;margin-top:10px;"
        v-model="search.companyId"
        placeholder="请选择分公司"
      >
        <el-option label="全部分公司" :value="''"></el-option>
        <el-option :label="serCompanyName" :value="serCompanyId"></el-option>
      </el-select>
      <el-date-picker
        v-if="search.companyId==''"
        @change="getData"
        style="margin-left:20px;margin-top:10px;"
        v-model="month2"
        value-format="yyyy"
        type="year"
        placeholder="选择日期"
      ></el-date-picker>
      <el-date-picker
        v-else
        @change="getData"
        style="margin-left:20px;margin-top:10px;"
        v-model="search.month"
        value-format="yyyy-MM"
        type="month"
        placeholder="选择日期"
      ></el-date-picker>
    </div>
    <el-table class="nobg" :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column label="排名" align="center">
        <template slot-scope="scope">No.{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column key="1" v-if="search.companyId==''" label="分公司名称" align="center">
        <template slot-scope="scope">{{ scope.row.companyName }}</template>
      </el-table-column>
      <el-table-column key="2" v-else label="分店名称" align="center">
        <template slot-scope="scope">{{ scope.row.shopName || scope.row.shopId }}</template>
      </el-table-column>
      <el-table-column label="检查分数" align="center">
        <template slot-scope="scope">{{ scope.row.score }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          sort: "NO.1",
          shopName: "紫阳明珠店",
          score: 100
        },
        {
          sort: "NO.2",
          shopName: "瑶湖店",
          score: 90
        },
        {
          sort: "NO.2",
          shopName: "瑶湖店",
          score: 90
        },
        {
          sort: "NO.2",
          shopName: "瑶湖店",
          score: 90
        },
        {
          sort: "NO.2",
          shopName: "瑶湖店",
          score: 90
        }
      ],
      companyList: [
        {
          value: 1,
          label: "江西分公司"
        },
        {
          value: 2,
          label: "广东分公司"
        }
      ],
      search: {
        offset: 0,
        limit: 10,
        companyId: "",
        type:1,
        month:'2019-08'
      },
      month2:'2019',
      value1: "2019-08",
      value2:'2019',
      roleId: 0,
      loading: false,
      serCompanyId: 0,
      serCompanyName: ""
    };
  },
  methods: {
    // fetchData() {
    //   transactionList().then(response => {
    //     this.list = response.data.items.slice(0, 8);
    //   });
    // },
    getUserInfo() {
      this.loading = true;
      this.$axios.get("/managerapi/sysuser/info", {}).then(res => {
        this.loading = false;
        this.roleId = res.datas.roleId;
        if (res.datas.roleId == 3) {
          this.search.companyId = res.datas.companyId;
          this.companyList.forEach(item => {
            if (item.id == res.datas.companyId) {
              this.serCompanyId = item.id;
              this.serCompanyName = item.name;
            }
          });
        }
        this.getList();
      });
    },
    getData(val) {
      this.getList();
    },
    toMore() {
      this.$router.push("/check/sort");
    },
    getCompanyList() {
      this.$axios.get("/managerapi/custome/company/get", {}).then(res => {
        this.companyList = res.datas;
        let obj = {
          id: "",
          name: "全部分公司"
        };
        this.companyList.unshift(obj);
      });
    },
    getList() {
      this.list = [];
      let params = this.search;
      if(this.search.companyId==''){ 
        params.type = 2
        params.month = this.month2
        }
      this.$axios
        .get("/managerapi/custome/grade/table/ranking/list", { params })
        .then(res => {
          this.list = res.datas.ranks;
        });
    },
    changeCompany(val) {
      this.list = [];
      this.search.companyId = val;
      this.getList();
    }
  },
  created() {
    // this.fetchData()
    this.getCompanyList();
    // this.getList();
    this.getUserInfo();
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