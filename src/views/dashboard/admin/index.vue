<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData"/>

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>-->

    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div>
            <span v-if='roleId==3'>分公司营业额与实收比例统计</span>
            <span v-else>总公司营业额与实收比例统计</span>
            <el-select
              style="float:right"
              @change="changeTerm"
              v-model="search.termId"
              placeholder="请选择学期"
            >
              <el-option
                v-for="item in termList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <bar-chart v-bind:termId="search.termId" v-bind:companyId="companyId.toString()"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <raddar-chart/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="40">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <transaction-table/>
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <box-card/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
import TodoList from "./components/TodoList";
import BoxCard from "./components/BoxCard";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      termList: [
        {
          value: 1,
          label: "2018年下学期"
        },
        {
          value: 2,
          label: "2019年上学期"
        }
      ],
      search: {
        termId: 1
      },
      roleId:0,
      companyId:''
    };
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    changeTerm(val) {
      this.search.termId = val;
      console.log(val, "组件外");
    },
    getTermList() {
      // let params = this.search;
      this.$axios.get("/managerapi/custome/term/get", {}).then(res => {
        this.termList = res.datas;
        this.search.termId = res.datas[0].id;
      });
    },
    getUserInfo() {
      this.$axios.get("/managerapi/sysuser/info").then(res => {
        this.roleId = res.datas.roleId;
        if (res.datas.roleId == 3) {
          this.companyId = res.datas.companyId;
        }
      });
    }
  },
  created() {
    this.getTermList();
    this.getUserInfo();
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
