import httpConfig from "../../../http.config";
export default {

  data() {
    return {
      search: {
        windowGenreId: '',
        shopIds: [
          [1, 4],
          [1, 6]
        ],
        termId: [55],
        projectId: ''
      },
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      exportDisable: false,
      loading: false,
      currentPage: 1,
      termOne: '',
      companyShop: [],
      termTwo: '',
      date: '',
      activeName: '4',
      total: 0,
      windowList: [],
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

      tableData: [],
      projectName: '',
      itemCateId: '',
      gateItemSort: [],
      gateProject: [],
      winName: ""
    }
  },

  methods: {
    getWinName(val) {
      this.winName = this.windowList.filter(el => {
        return val == el.id
      })[0].name
      this.getProductCat();
      this.itemCateId = ''
      this.search.projectId = ''
    },
    catChange() {
      this.search.projectId = '';
      this.getProduct();
    },
    getProjectName(val) {
      this.projectName = this.gateProject.filter(el => {
        return val == el.id
      })[0].name
    },
    getProductCat() {
      let params = {
        'windowGenreId': this.search.windowGenreId
      }
      this.$axios.get('/managerapi/custome/window/type/class/get', {
        params
      }).then(res => {
        this.gateItemSort = res.datas;
        this.getProduct();
      })
    },
    getProduct() {
      let params = {
        'windowGenreId': this.search.windowGenreId,
        'projectGenreId': this.itemCateId
      }
      this.$axios.get('/managerapi/custome/window/projects/down', {
        params
      }).then(res => {
        this.gateProject = res.datas;
      })
    },
    getCompanyShop() {
      this.search.termId = [];
      this.search.projectId = '';
      this.$axios.get('/managerapi/custome/data/statistics/company/shop/select').then(res => {
        this.$axios.get('/managerapi/custome/term/get').then(response => {

          if (response.result) {
            this.termList = response.datas;
            this.search.termId[0] = response.datas[0].id;
            this.termOne = response.datas[0].name;
          }
          if (res.result) {
            this.companyShop = res.datas;
            let shopArr = [];
            let areas = [];
            areas[0] = res.datas[0].value;
            areas[1] = res.datas[0].children[0].value;
            shopArr[0] = areas;
            this.search.shopIds = shopArr;
            if (this.search.termId.length == 2) {
              this.loading = true;
              let params = Object.assign({}, this.search);
              var arrs = []
              params.shopIds.forEach(el => {
                arrs.push(el[el.length - 1])
              });
              params.shopIds = arrs.join();
              params.termId = this.search.termId[0]
              params.termTwoId = this.search.termId[1]
              this.$axios.get('/managerapi/custome/area/window/term/projects/get', {
                params
              }).then(res => {
                this.loading = false;
                if (res.result) {
                  this.tableData = res.datas;
                  this.total = res.datas.total;
                }
              });
            } else {
              this.loading = true;
              let params = Object.assign({}, this.search);
              params.termId = response.datas[0].id
              var arrs = []
              params.shopIds.forEach(el => {
                arrs.push(el[el.length - 1])
              });
              params.shopIds = arrs.join()

              this.$axios.get('/managerapi/custome/area/window/projects/get', {
                params
              }).then(res => {
                this.loading = false;
                if (res.result) {
                  this.tableData = res.datas;
                  this.total = res.datas.total;
                }
              });
            }
          }
        })

      })
    },
    getShopList() {
      let params = {
        companyId: this.search.companyId
      }
      this.$axios.get('/managerapi/custome/shop/get', {
        params
      }).then(res => {
        if (res.result) {
          this.shopList = res.datas
        }
      })
    },
    getCompanyList() {
      this.$axios.get('/managerapi/custome/company/get').then(res => {
        if (res.result) {
          this.companyList = res.datas
        }
      })
      this.getShopList()
    },
    getWindowList() {
      this.$axios.get('/managerapi/custome/window/type/get').then(res => {
        if (res.result) {
          this.windowList = res.datas
        }
      })
    },
    getTermList() {
      this.$axios.get('/managerapi/custome/term/get').then(res => {
        if (res.result) {
          this.termList = res.datas
          this.termId[0] = res.datas[0].id
        }
      })
    },
    changeGood(value) {
      let choosenItem = this.goodsList.filter(item => item.goodsName === value)[0]
      this.goods.goodsId = choosenItem.id
    },
    termChange() {
      console.log(this.search.termId)
      this.termList.forEach(item => {
        if (item.id == this.search.termId[0]) {
          this.termOne = item.name
        }
        if (item.id == this.search.termId[1]) {
          this.termTwo = item.name
        }
      })
      if (this.search.termId.length > 2) {
        this.$message({
          message: '最多只能添加两项',
          type: 'error'
        });
        return
      }
      if (this.search.termId.length < 1) {
        this.$message({
          message: '请至少选择一个学期',
          type: 'error'
        });
        return
      }
      this.getList()
    },
    getList() {
      //获取分公司所有门店项目数
      if (this.search.termId.length == 2) {
        this.loading = true;
        let params = Object.assign({}, this.search);
        var arrs = []
        params.shopIds.forEach(el => {
          arrs.push(el[el.length - 1])
        });
        params.shopIds = arrs.join()
        params.termId = this.search.termId[0]
        params.termTwoId = this.search.termId[1]
        this.$axios.get('/managerapi/custome/area/window/term/projects/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas;
            this.total = res.datas.total;
          }
        });
      } else {
        this.loading = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        var arrs = []
        params.shopIds.forEach(el => {
          arrs.push(el[el.length - 1])
        });
        params.shopIds = arrs.join()
        console.log(params.shopIds)
        this.$axios.get('/managerapi/custome/area/window/projects/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas;
            this.total = res.datas.total;
          }
        });
      }
    },
    handleClick(tab) {
      this.search.type = tab.name
      console.log(tab.name)
      if (tab.name == 1) {
        this.$router.push('/data/project')
      }
      if (tab.name == 2) {
        this.$router.push('/data/flow')
      }
      if (tab.name == 3) {
        this.$router.push('/data/singleItem')
      }
      if (tab.name == 4) {
        this.$router.push('/data/area')
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
      this.winName = '';
      this.projectName = '';
      this.search.windowGenreId = '';
      this.activeName = '4';
      this.getCompanyShop()
    },
    //导出
    exportExcel() {
      if (this.search.termId.length < 2) {
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        var arrs = []
        params.shopIds.forEach(el => {
          arrs.push(el[el.length - 1])
        });
        params.shopIds = arrs.join()
        this.$axios.get('/managerapi/custome/get/area/projects/export', {
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
      if (this.search.termId.length == 2) {
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        var arrs = []
        params.shopIds.forEach(el => {
          arrs.push(el[el.length - 1])
        });
        params.shopIds = arrs.join()
        params.termId = this.search.termId[0]
        params.termTwoId = this.search.termId[1]
        this.$axios.get('/managerapi/custome/get/area/term/projects/export', {
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
    // this.getTermList()
    // this.getList()
    this.getWindowList()
    this.getCompanyShop()
  },
  mounted() {

  }

};