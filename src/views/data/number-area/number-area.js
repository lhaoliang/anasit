import httpConfig from "../../../http.config";
export default {

  data() {
    var yyyy = new Date().getFullYear();
    var month = (new Date().getMonth()+1) > 10 ? (new Date().getMonth()+1) : '0'+ (new Date().getMonth()+1)
    return {
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      exportDisable: false,
      defaultTime: yyyy+'-'+month,
      search: {
        projectId: '',
        shopIds: [ ],
        windowGenreId:'',
        yearMonth: yyyy+'-'+month,
        yearMonthTwo: ''
      },
      loading: false,
      currentPage: 1,
      termOne: '',
      companyShop: [],
      termTwo: '',
      date: '',
      time: [ yyyy+'-'+month, yyyy+'-'+month],
      activeName: '3',
      mouthTwo: '',
      mouthTwo: '',
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
      genreList: [],
      itemTypeDown:[],
      winName:'',
      projectName:'',
      gateItemSort:[],
      itemCateId:'',
      gateProject:[],

    }
  },

  methods: {
    getWinName(val){
      this.winName = this.itemTypeDown.filter(el=>{
        return val == el.id
      })[0].name
      this.getProductCat();
      this.itemCateId = ''
      this.search.projectId = ''
    },
    getProductCat(){
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
    catChange() {
      this.search.projectId = '';
      this.getProduct();
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
    getProjectName(val){
      this.projectName = this.gateProject.filter(el=>{
        return val == el.id
      })[0].name
    },
    getCompanyShop() {
      this.$axios.get('/managerapi/custome/data/statistics/company/shop/select').then(res => {
        if (res.result) {
          this.companyShop = res.datas
          let shopArr = [];
          let areas = [];
          areas[0] = res.datas[0].value;
          areas[1] = res.datas[0].children[0].value;
          shopArr[0] = areas;
          this.search.shopIds = shopArr;
          this.loading = true;
          let params = Object.assign({}, this.search);
          var arrs = []
          params.shopIds.forEach(el => {
            arrs.push(el[el.length - 1])
          });
          params.shopIds = arrs.join()
          params.yearMonth = this.time[0]
          params.yearMonthTwo = this.time[1]
          if (params.yearMonth == params.yearMonthTwo) {
            delete params.yearMonthTwo
            this.$axios.get('/managerapi/custome/data/numerical/statistics/area/single/month/get', {
              params
            }).then(res => {
              this.loading = false;
              if (res.result) {
    
                this.tableData = res.datas;
                this.total = res.datas.total;
              }
            });
          } else {
            this.$axios.get('/managerapi/custome/data/numerical/statistics/area/double/month/get', {
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
      // this.getList()
    },
    timeChange(val) {
      this.mouthOne = val[0]
      this.mouthTwo = val[1]
      this.search.yearMonth = val[0]
      this.search.yearMonthTwo = val[1]
      this.getList()
    },
        //档口类型下拉
        getTypeDown() {
          this.$axios.get('/managerapi/custome/window/type/get').then(res => {
            this.itemTypeDown = res.datas;
          })
        },
    getWindowList() {
      this.$axios.get('/managerapi/custome/window/get').then(res => {
        if (res.result) {
          this.windowList = res.datas
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
      this.loading = true;
      let params = Object.assign({}, this.search);
      var arrs = []
      params.shopIds.forEach(el => {
        arrs.push(el[el.length - 1])
      });
      params.shopIds = arrs.join()
      params.yearMonth = this.time[0]
      params.yearMonthTwo = this.time[1]
      if (params.yearMonth == params.yearMonthTwo) {
        delete params.yearMonthTwo
        this.$axios.get('/managerapi/custome/data/numerical/statistics/area/single/month/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {

            this.tableData = res.datas;
            this.total = res.datas.total;
          }
        });
      } else {
        this.$axios.get('/managerapi/custome/data/numerical/statistics/area/double/month/get', {
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
        this.$router.push('/data/number')
      }
      if (tab.name == 2) {
        this.$router.push('/data/number-single')
      }
      if (tab.name == 3) {
        this.$router.push('/data/number-area')
      }
      // this.getList()
    },

    onRest() {
      this.winName = '';
      this.projectName = '';
      this.search = {
          windowGenreId: '',
        },
        this.time = [this.defaultTime,this.defaultTime]
        this.activeName = '3'
      this.getCompanyShop()
    },
//导出
    exportExcel() {
      let params = Object.assign({}, this.search);
      var arrs = []
      params.shopIds.forEach(el => {
        arrs.push(el[el.length - 1])
      });
      params.shopIds = arrs.join()
      params.yearMonth = this.time[0]
      params.yearMonthTwo = this.time[1]
      if (params.yearMonth == params.yearMonthTwo) {
        delete params.yearMonthTwo
        this.$axios.get('/managerapi/custome/get/area/numerical/statics/export', {
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
      }  else if(params.yearMonth != params.yearMonthTwo){
        this.$axios.get('/managerapi/custome/get/area/month/numerical/statics/export', {
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
    this.getCompanyShop()

    this.getCompanyList()
    this.getTermList()
    // this.getList()
    this.getWindowList()
    // this.getGenreList()
    this.getTypeDown()
  },
  mounted() {

  }

};