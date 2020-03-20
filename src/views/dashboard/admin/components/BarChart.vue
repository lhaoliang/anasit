<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

const animationDuration = 1000;

export default {
  props: {
    termId: {
      type: Number,
      default: 2
    },
    companyId: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      chart: null,
      term: "",
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true
          // feature: {
          //   mark: { show: true },
          //   dataView: { show: true, readOnly: false },
          //   magicType: { show: true, type: ["line", "bar"] },
          //   restore: { show: true },
          //   saveAsImage: { show: true }
          // }
        },
        calculable: true,
        legend: {
          data: ["营业额", "实收平均比例"]
        },
        xAxis: [
          {
            type: "category",
            data: [
              "2019-06",
              "2019-07",
              "2019-08",
              "2019-09",
              "2019-10",
              "2019-11",
              "2019-12"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            axisLabel: {
              formatter: "{value} 万元"
            }
          },
          {
            type: "value",
            name: "",
            axisLabel: {
              formatter: "{value} %"
            }
          }
        ],
        series: [
          {
            name: "营业额",
            type: "bar",
            data: [10000, 80000, 10000, 0, 0, 0, 0]
          },
          {
            name: "实收平均比例",
            type: "line",
            yAxisIndex: 1,
            data: [10, 2, 2.4, 0, 0, 0, 0]
          }
        ]
      },
      company: 99
    };
  },
  created() {
    this.$axios.get("/managerapi/sysuser/info").then(res => {
      if (res.datas.roleId == 3) {
        this.company = res.datas.companyId;
        console.log(this.company)
        this.getData(this.termId);
      } else {
        this.company = "";
        this.getData(this.termId);
      }
    });
  },
  mounted() {
    this.initChart();

    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption(this.option);
    },
    getData(val) {
      let params = {
        termId: val,
        companyId: this.company
      };
      var arr = [];
      var timeArr = [];
      var xArr = [];
      var yArr = [];
      this.$axios
        .get("/managerapi/custome/home/rate/statistics", {
          params
        })
        .then(res => {
          for (let i in res.datas) {
            timeArr.push(i);
            arr.push(res.datas[i]);
          }
          arr.forEach(item => {
            xArr.push(Number(item.charge) / 10000);
            yArr.push(item.rate.toFixed(2));
          });
          this.option.xAxis[0].data = timeArr;
          this.option.series[0].data = xArr;
          this.option.series[1].data = yArr;
          this.chart.setOption(this.option);
        });
    }
  },
  watch: {
    termId: {
      immediate: false,
      handler(val) {
        this.term = val;
        this.getData(val);
      }
    }
  }
};
</script>
