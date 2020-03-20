<template>
  <el-row :gutter="40" style="margin-left:0;margin-right:0;" class="panel-group">
    <h3 class="title">
      <span>数据统计</span>
      <el-select
        @change="termChange"
        style="float:right"
        v-model="search.termId"
        placeholder="请选择学期"
      >
        <el-option v-for="item in termList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </h3>
    <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
      <div class="card-panel">
        <p class="card-panel__item">分店总数(家)</p>
        <p class="card-panel__item color">{{detail.shopNumber}}</p>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
      <div class="card-panel">
        <p class="card-panel__item">档口总数(个)</p>
        <p class="card-panel__item color">{{detail.windowNumber}}</p>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
      <div class="card-panel">
        <p class="card-panel__item">单品档口总数(个)</p>
        <p class="card-panel__item color">{{detail.fengweiWindowNumber}}</p>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
      <div class="card-panel">
        <p class="card-panel__item">总营业额(元)</p>
        <p class="card-panel__item color">{{(detail.chargeTotal/10000)}}万</p>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
      <div class="card-panel">
        <p class="card-panel__item">实收比例</p>
        <p class="card-panel__item color">{{rate}}%</p>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  data() {
    return {
      search: {
        termId: 2,
        companyId:''
      },
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
      rate: 0,
      detail: {}
    };
  },
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
    getTermList() {
      this.$axios.get("/managerapi/custome/term/get", {}).then(res => {
        if (res.result) {
          this.termList = res.datas;
          this.search.termId = res.datas[0].id;
        }
      });
    },
    getData() {
      let params = this.search;
      this.$axios
        .get("/managerapi/custome/home/statistics", { params })
        .then(res => {
          if (res.result) {
            this.detail = res.datas;
            this.rate = res.datas.rate.toFixed(2);
          }
        });
    },
    termChange(val) {
      this.search.termId = val;
      this.getData();
    },
    getUserInfo() {
      this.$axios.get("/managerapi/sysuser/info", {}).then(res => {
        this.roleId = res.datas.roleId;
        if (res.datas.roleId == 3) {
          this.search.companyId = res.datas.companyId;
        }
        this.getData();
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
p {
  padding: 0;
  margin: 0;
}
.title {
  overflow: hidden;
  padding: 0 20px 10px;
  border-bottom: 1px solid #ccc;
}
.panel-group {
  margin: 18px 0 30px 0;
  background: #fff;
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    overflow: hidden;
    color: #aaa;
    background: #fff;
    padding: 20px;
    text-align: center;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &__item:first-child {
      margin-top: 10px;
    }
    &__item {
      line-height: 26px;
      .add {
        color: #04f21c;
      }
      .desc {
        color: #d9001b;
      }
    }
    &__item.color {
      color: #000;
      font-size: 20px;
    }
  }
}
@media only screen and (min-width: 1200px) {
  .el-col-lg-5 {
    width: 20%;
  }
}
</style>
