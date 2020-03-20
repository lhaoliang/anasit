import httpConfig from "../../../http.config";
export default {

  data() {
    return {
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      exportDisable: false,
      search: {
        limit: 10,
        offset: 0,
        month: '2018',
        type: 2,
        companyId: '',
      },
      month2: '2019',
      exportBranch: {
        companyId: '',
        date: '',
        termId: '',
        shopName: '',
      },
      roleId:0,
      companyType: 1,
      yearType: '1',
      loading: false,
      exportDisable: false,
      currentPage: 1,
      date: '',
      activeName: '2',
      total: 0,
      termList: [{
        value: '选项1',
        label: '2014年下学期'
      }, {
        value: '选项2',
        label: '2015年下学期'
      }],
      term: '2018年下学期',
      companyList: [{
        value: '选项1',
        label: '北京分公司'
      }, {
        value: '选项2',
        label: '湖南分公司'
      }],
      company: '江西分公司',

      shopList: [{
        value: '选项1',
        label: '高新店'
      }, {
        value: '选项2',
        label: '与何明珠店'
      }],
      shop: '紫阳明珠店',

      tableData: [{
          sort: '1',
          name: '紫阳明珠店',
          company: '江西分公司',
          time: '2018-5-10',
          score: '100',
          term: '2018上学期'
        },
        {
          sort: '2',
          name: '紫阳明珠店',
          company: '江西分公司',
          time: '2018-5-10',
          score: '100',
          term: '2018上学期'
        },
      ],


      companyForm: {
        branchName: '江西分公司',
        name: '张三',
        phone: '13135613',
        account: 'josida',
        password: '123153'
      },
      selectType: '2'

    }
  },

  methods: {
    yearTyeChange(val) {
      if (val == 1) {
        this.loading = true;
        let params = this.search;
        this.$axios.get('/managerapi/custome/grade/table/ranking/list', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas.ranks
            this.total = res.datas.total;
          }
        });
      }
      if (val == 2) {
        this.loading = true;
        let params = this.search;
        params.monthTwo = this.month2
        this.$axios.get('/managerapi/custome/grade/table/ranking/two', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas.ranks
            this.total = res.datas.total;
          }
        });
      }
    },
    //获取个人信息
    getUserInfo() {
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.roleId = res.datas.roleId;
        if (res.datas.roleId == 3) {
          this.search.companyId = res.datas.companyId;
        }

        this.getList();
      })
    },
    getCompanyList() {
      this.$axios.get('/managerapi/custome/company/get').then(res => {
        if (res.result) {
          this.companyList = res.datas
        }
      })
    },
    getTermList() {
      this.$axios.get('/managerapi/custome/term/get').then(res => {
        if (res.result) {
          this.termList = res.datas
        }
      })
    },
    changeGood(value) {
      let choosenItem = this.goodsList.filter(item => item.goodsName === value)[0]
      this.goods.goodsId = choosenItem.id
    },
    getList() {
      if (this.yearType == 1) {
        this.loading = true;
        let params = this.search;
        this.$axios.get('/managerapi/custome/grade/table/ranking/list', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas.ranks
            this.total = res.datas.total;
          }
        });
      } else {
        this.loading = true;
        let params = this.search;
        params.monthTwo = this.month2
        this.$axios.get('/managerapi/custome/grade/table/ranking/two', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas.ranks
            this.total = res.datas.total;
          }
        });
      }

    },
    handleClick(tab) {
      this.search.type = tab.name
      this.companyType = tab.name
      if (tab.name == 1) {
        this.$router.push(
          '/check/sort'
        )
      }
      if (tab.name == 2) {
        this.$router.push(
          '/check/sort-total'
        )
      }
      // this.getList()
    },
    handleSizeChange(val) {
      this.search.limit = val;

      this.getList();
    },
    // 分页
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit;
      this.getList();
    },
    onRest() {
      this.search = {
          limit: 10,
          offset: 0,
          month: '2019',
          type: 2,
          companyId: '',
        },
        this.time2 = ''
      this.time = [];
      this.activeName = '2'
      this.getList()
    },
    //导出表格
    exportExcel() {
      this.exportDisable = true;
      if (this.companyType == 1) {
        let params = this.exportBranch
        params.companyId = this.search.companyId
        params.termId = this.search.termId
        params.shopName = this.search.keyWord
        params.date = this.search.date
        this.$axios.get('/managerapi/custome/shop/inspection/top//export', {
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
    this.getUserInfo()
  },


  mounted() {

  }

};