import httpConfig from "../../../http.config";
export default {

  data() {
    return {
      time: [],
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      exportDisable: false,
      statisSearch: {
        yearMonth: '',
        yearMonthTwo: '',
        companyId: '',
        shopId: '',
        windowGenreId: '',
        projectId: ''
      },
      loading: false,
      currentPage: 1,
      date: '',
      activeName: '1',
      total: [],
      roleId: 0,
      termList: [{
        value: '选项1',
        label: '2014年下学期'
      }, {
        value: '选项2',
        label: '2015年下学期'
      }],
      term: '2018年下学期',
      companyList: [],
      company: '江西分公司',
      shopList: [{
        value: '选项1',
        label: '高新店'
      }, {
        value: '选项2',
        label: '与何明珠店'
      }],
      shopId: '紫阳明珠店',
      //公司数值
      companyTotalActualMoney: '',
      companyTotalRate: '',
      companyTotalTurnover: '',
      companyNumerical: [],
      searchCompanyId: '',
      companyForm: {
        branchName: '江西分公司',
        name: '张三',
        phone: '13135613',
        account: 'josida',
        password: '123153'
      },
      tableData: [],
      itemTypeDown: [],
      termSelect: '201907',
      termSelectList: [{
        value: 1,
        label: '2019年下学期',
        children: [{
            value: '201907',
            label: '2019.7'
          },
          {
            value: '201908',
            label: '2019.8'
          },
          {
            value: '201911',
            label: '2019.11'
          },
          {
            value: '201912',
            label: '2019.12'
          },
        ]
      }, {
        value: 2,
        label: '2019年上学期',
        children: [{
            value: '201903',
            label: '2019.3'
          },
          {
            value: '201904',
            label: '2019.4'
          },
          {
            value: '201905',
            label: '2019.5'
          },
          {
            value: '201906',
            label: '2019.6'
          },
        ]
      }],
      typeList: [{
        value: 1,
        label: '学期'
      }, {
        value: 2,
        label: '月份'
      }],
      typeValue: 1,
      //两个月比较
      monthCompareList: [],
      mouthOne: '',
      mouthTwo: '',
      termOne: '',
      termTwo: '',
      terms:[1]
    }
  },

  methods: {
    //获取个人信息
    getUserInfo() {
      this.loading = true
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.loading = false
        this.roleId = res.datas.roleId;
        if (this.roleId == 3) {
          this.statisSearch.companyId = res.datas.companyId

        }
        this.getList()
        this.getshopDown()
      })
    },
    changeType(val) {
      this.statisSearch.windowGenreId = ''
      if (val == 1) {
        this.time = [],
          this.statisSearch.yearMonth = '';
        this.statisSearch.yearMonthTwo = '';
        // this.statisSearch.termId = 2
        // this.getList()
      } else {
        this.terms = []
      }
      // this.getList()
    },
    text(val) {
      console.log(val)
    },
    //门店下拉
    getshopDown() {
      let params = {
        companyId: this.statisSearch.companyId
      }
      this.$axios.get('/managerapi/custome/shop/get', {
        params
      }).then(res => {
        console.log(888)
        console.log(res)
        this.shopList = res.datas;
        let item = {
          id: '',
          name: '全部分店'
        }
        this.shopList.unshift(item)
        this.getList();
      })
    },
    timeChange(val) {
      this.mouthOne = val[0]
      this.mouthTwo = val[1]
    },
    termChange(val) {
      this.termOne = this.termList.filter(item => {
        return item.id == val[0]
      })[0].name
      if(val.length==2){
        this.termTwo = this.termList.filter(item => {
          return item.id == val[1]
        })[0].name
      }

      this.terms = val
      this.getList()
    },
    //档口类型下拉
    getTypeDown() {
      this.$axios.get('/managerapi/custome/window/type/get').then(res => {
        this.itemTypeDown = res.datas;
      })
    },
    limitTwo() {
      if (this.termSelect.length > 2) {
        this.$message({
          message: '最多只能添加两项',
          type: 'error'
        });
      }
    },

    openEdit(scope) {
      if (scope.operation == 5) {
        this.$router.push({
          path: `/data/project-detail/${scope.id}`
        })
      }
    },
    // 构造多个参数的command
    commandValue(operation = '', id = '', status = '', row = {}) {
      return {
        "status": status,
        "id": id,
        "operation": operation,
        "row": row
      }
    },
    getCompanyList() {
      this.$axios.get('/managerapi/custome/company/get').then(res => {
        if (res.result) {
          this.companyList = res.datas
        }
        // let item = {
        //   id: '',
        //   name: '全部分公司'
        // }
        // this.companyList.unshift(item)
        this.getshopDown()
      })
    },
    getTermList() {
      this.$axios.get('/managerapi/custome/term/get').then(res => {
        if (res.result) {
          this.termList = res.datas
        }
        // let item = {
        //   id: '',
        //   name: '全部学期'
        // }
        // this.termList.unshift(item)
      })
    },
    getList() {
      // this.loading = true;
      //分公司数值按周期统计
      if (this.time.length == 0 && this.terms.length == 1 && this.statisSearch.companyId >= 0 && this.statisSearch.shopId == '') {
        let params = this.statisSearch;
        params.termId = this.terms[0]
        this.$axios.get('/managerapi/custome/data/numerical/statistics/company/term/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            res.datas.companys.forEach(item=>{
               item.turnover = Number(item.turnover).toFixed(2);
               item.actualMoney = Number(item.actualMoney).toFixed(2);
               item.rate = Number(item.rate).toFixed(2);
            })
            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
            this.total = res.datas.total;
            this.tableData = res.datas.companys;
          }
        });
      }
      //分公司数值按两个周期统计
      if (this.time.length == 0 && this.terms.length == 2 && this.statisSearch.companyId >= 0 && this.statisSearch.shopId == '') {
        let params = this.statisSearch;
        params.termId = this.terms[0]
        params.termIdTwo = this.terms[1]
        this.$axios.get('/managerapi/custome/data/numerical/statistics/company/two/term/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            res.datas.companys.forEach(item=>{
              item.actualMoneyOne = Number(item.actualMoneyOne).toFixed(2);
              item.actualMoneyTwo = Number(item.actualMoneyTwo).toFixed(2);
              item.turnoverOne = Number(item.turnoverOne).toFixed(2);
              item.turnoverTwo = Number(item.turnoverTwo).toFixed(2);
              item.rateOne = Number(item.rateOne).toFixed(2);
              item.rateTwo = Number(item.rateTwo).toFixed(2);
            })
            res.datas.total.totalActualMoneyOne = Number(res.datas.total.totalActualMoneyOne).toFixed(2);
            res.datas.total.totalActualMoneyTwo = Number(res.datas.total.totalActualMoneyTwo).toFixed(2);
            res.datas.total.totalRateOne = Number(res.datas.total.totalRateOne).toFixed(2);
            res.datas.total.totalRateTwo = Number(res.datas.total.totalRateTwo).toFixed(2);
            res.datas.total.totalTurnoverOne = Number(res.datas.total.totalTurnoverOne).toFixed(2);
            res.datas.total.totalTurnoverTwo = Number(res.datas.total.totalTurnoverTwo).toFixed(2);

            this.tableData = res.datas.companys;
            this.total = res.datas.total;
          }
        });
      }
      // 分公司数值按单月统计
      if (this.time[0] == this.time[1] && this.terms&&this.terms.length == 0 && this.statisSearch.companyId >= 0 && this.statisSearch.shopId == '') {
        let params = this.statisSearch;
        params.yearMonth = this.time[0];
        params.yearMonthTwo = this.time[1];
        if (params.yearMonth == params.yearMonthTwo) {
          delete params.termId
          delete params.termIdTwo
          delete params.yearMonthTwo
          this.$axios.get('/managerapi/custome/data/numerical/statistics/company/get', {
            params
          }).then(res => {
            this.loading = false;
            if (res.result) {
              res.datas.companys.forEach(item=>{
                item.turnover = Number(item.turnover).toFixed(2);
                item.actualMoney = Number(item.actualMoney).toFixed(2);
               item.rate = Number(item.rate).toFixed(2);
             })
             res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
             res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
             res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
             this.total = res.datas.total;
             this.tableData = res.datas.companys;
            }
          });
        }

      }
      //两个月分公司数值统计
      if (this.time && this.time[0] != this.time[1] && this.terms.length == 0 && this.statisSearch.companyId >= 0 && this.statisSearch.shopId == '') {
        let params = this.statisSearch;
        params.yearMonth = this.time[0];
        params.yearMonthTwo = this.time[1];
        delete params.termId
        this.$axios.get('/managerapi/custome/data/numerical/statistics/company/month/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            res.datas.companys.forEach(item=>{
              item.actualMoneyOne = Number(item.actualMoneyOne).toFixed(2);
              item.actualMoneyTwo = Number(item.actualMoneyTwo).toFixed(2);
              item.turnoverOne = Number(item.turnoverOne).toFixed(2);
              item.turnoverTwo = Number(item.turnoverTwo).toFixed(2);
              item.rate = Number(item.rate).toFixed(2);
              item.rateTwo = Number(item.rateTwo).toFixed(2);
            })
            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
            res.datas.total.totalActualMoneyTwo = Number(res.datas.total.totalActualMoneyTwo).toFixed(2);
            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
            res.datas.total.totalRateTwo = Number(res.datas.total.totalRateTwo).toFixed(2);
            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
            res.datas.total.totalTurnoverTwo = Number(res.datas.total.totalTurnoverTwo).toFixed(2);

            this.tableData = res.datas.companys;
            this.total = res.datas.total;
          }
        });
      }
      // // 分公司门店数值统计
      // if (this.time && this.time[0] == this.time[1] && this.terms.length == 0 && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
      //   let params = this.statisSearch;
      //   params.yearMonth = this.time[0];
      //   params.yearMonthTwo = this.time[1];
      //   if (params.yearMonth == params.yearMonthTwo) {
      //     delete params.yearMonthTwo
      //     delete params.termId
      //     this.$axios.get('/managerapi/custome/data/numerical/statistics/company/shop/get', {
      //       params
      //     }).then(res => {
      //       this.loading = false;
      //       if (res.result) {
      //         this.tableData = res.datas.companys;
      //         this.total = res.datas.total;
      //       }
      //     });
      //   }

      // }
      // //两个月分公司门店数值统计
      // if (this.time && this.time[0] != this.time[1] && this.terms.length == 0 && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
      //   let params = this.statisSearch;
      //   params.yearMonth = this.time[0];
      //   params.yearMonthTwo = this.time[1];

      //   this.$axios.get('/managerapi/custome/data/numerical/statistics/company/shop/month/get', {
      //     params
      //   }).then(res => {
      //     this.loading = false;
      //     if (res.result) {
      //       this.tableData = res.datas.companys;
      //       this.total = res.datas.total;
      //     }
      //   });

      // }

    },
    handleClick(tab) {
      if (tab.name == 1) {
        this.$router.push('/data/number')
      }
      if (tab.name == 2) {
        this.$router.push('/data/number-single')
      }
      if (tab.name == 3) {
        this.$router.push('/data/number-area')
      }
    },
    onRest() {
      this.statisSearch = {
          yearMonth: '',
          yearMonthTwo: '',
          companyId: '',
          shopId: '',
          windowGenreId: '',
          termId: '',
          projectId: ''
        },
        this.time = [];
      this.activeName = '1'
      this.getUserInfo();
      // this.getList()
    },
    // 导出表格
    exportExcel() {
      if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
        this.exportDisable = true;
        let params = this.statisSearch;
        params.yearMonth = this.time[0];
        params.yearMonthTwo = this.time[1];
        if (params.yearMonth == params.yearMonthTwo) {
          delete params.yearMonthTwo
          this.$axios.get('/managerapi/custome/company/numerical/value/export', {
            params
          }).then(res => {
            if (res.result) {
              this.$message({
                message: "导出成功",
                type: 'success'
              });
              window.location.href = this.server + res.message;
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
            this.exportDisable = false;
          })
        }
      }
      //单月全部门店
      if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId > 0 && this.statisSearch.shopId == '') {
        this.exportDisable = true;
        let params = this.statisSearch;
        params.yearMonth = this.time[0];
        params.yearMonthTwo = this.time[1];
        if (params.yearMonth == params.yearMonthTwo) {
          delete params.yearMonthTwo
          this.$axios.get('/managerapi/custome/shop/numerical/value/export', {
            params
          }).then(res => {
            if (res.result) {
              this.$message({
                message: "导出成功",
                type: 'success'
              });
              window.location.href = this.server + res.message;
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
            this.exportDisable = false;
          })
        }
      }
      //单月单个门店
      if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
        this.exportDisable = true;
        let params = this.statisSearch;
        params.yearMonth = this.time[0];
        params.yearMonthTwo = this.time[1];
        if (params.yearMonth == params.yearMonthTwo) {
          delete params.yearMonthTwo
          this.$axios.get('/managerapi/custome/window/numerical/value/export', {
            params
          }).then(res => {
            if (res.result) {
              this.$message({
                message: "导出成功",
                type: 'success'
              });
              window.location.href = this.server + res.message;
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
            this.exportDisable = false;
          })
        }
      }
      //两个月分公司数值比较
      if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
        let params = this.statisSearch;
        params.yearMonth = this.time[0];
        params.yearMonthTwo = this.time[1];
        this.$axios.get('/managerapi/custome/company/two/numerical/value/export', {
          params
        }).then(res => {
          if (res.result) {
            this.$message({
              message: "导出成功",
              type: 'success'
            });
            window.location.href = this.server + res.message;
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
          this.exportDisable = false;
        })
      }
      //两个月分公司门店
      if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId > 0 && this.statisSearch.shopId == '') {
        let params = this.statisSearch;
        params.yearMonth = this.time[0];
        params.yearMonthTwo = this.time[1];
        this.$axios.get('/managerapi/custome/shop/two/numerical/value/export', {
          params
        }).then(res => {
          if (res.result) {
            this.$message({
              message: "导出成功",
              type: 'success'
            });
            window.location.href = this.server + res.message;
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
          this.exportDisable = false;
        })
      }
      //两个月单个门店
      if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
        let params = this.statisSearch;
        params.yearMonth = this.time[0];
        params.yearMonthTwo = this.time[1];
        this.$axios.get('/managerapi/custome/window/two/numerical/value/export', {
          params
        }).then(res => {
          if (res.result) {
            this.$message({
              message: "导出成功",
              type: 'success'
            });
            window.location.href = this.server + res.message;
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
          this.exportDisable = false;
        })
      }
      //分公司数值按周期统计
      if (this.time.length == 0 && this.statisSearch.termId > 0 && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
        let params = this.statisSearch;
        this.$axios.get('/managerapi/custome/company/term/numerical/statics/export', {
          params
        }).then(res => {
          if (res.result) {
            this.$message({
              message: "导出成功",
              type: 'success'
            });
            window.location.href = this.server + res.message;
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
          this.exportDisable = false;
        })
      }
    },
  },
  created() {
    this.getCompanyList()
    this.getTermList()
    // this.getList()
    this.getTypeDown()
    this.getshopDown()
    this.getUserInfo()
  },


  mounted() {}

};