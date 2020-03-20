import httpConfig from "../../../http.config";
export default {

  data() {
    return {
      search: {
        windowGenreId: '',
        companyId: '',
        termId: [2],
        shopId: '',
        projectId:1
      },
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      exportDisable: false,
      loading: false,
      currentPage: 1,
      typeOptions: [],
      termOne: '',
      termTwo: '',
      date: '',
      roleId: 0,
      activeName: '3',
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
      typeList: [],
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
      // genres: [6, 11],
      winName: '',
      projectName: '',
      companyName: '',
      allCompany: '全部分公司',
      termName: '',
      itemCateId:'',
      gateItemSort:[],
      gateProject:[],
      numSingle:'',
      numTotal:''
    }
  },

  methods: {
    getWinName(val){
      this.winName = this.typeList.filter(el=>{
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
    getProjectName(val){
      this.projectName = this.gateProject.filter(el=>{
        return val == el.id
      })[0].name
      this.search.projectId = val;
    },
    getProductCat(){
      let params = {
        'windowGenreId': this.search.windowGenreId
      }
      this.$axios.get('/managerapi/custome/window/type/class/get', {
        params
      }).then(res => {
        this.gateItemSort = res.datas;
        this.itemCateId = res.datas[0].id
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
        this.search.projectId = res.datas[0].id
        this.getList()
      })
    },
    //档口类型、项目选择
    // getGenreList(){
    //   this.$axios.get('/managerapi/custome/data/statistics/project/genre/select').then(res => {
    //     this.genreList = res.datas;
    //   })
    // },
    // genreChange(val) {

    //   this.search.projectId = val[1]
    //   let wintype = this.genreList.filter(el=>{
    //     return (el.value == val[0])
    //   })
    //   let projectName = wintype[0].children.filter(j=>{
    //     return (j.value == val[1])
    //   })
    //   this.projectName = projectName[0].label
    // },
    //获取个人信息
    getUserInfo() {
      this.loading = true
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.loading = false
        this.roleId = res.datas.roleId;
        if (res.datas.roleId == 3) {
          this.search.companyId = res.datas.companyId
        this.companyName = res.datas.company.name;

          let params = {
            companyId: res.datas.companyId
          }
          this.$axios.get('/managerapi/custome/shop/get', {
            params
          }).then(res => {
            if (res.result) {
              this.shopList = res.datas
              this.getList()
            }
          })
        }else{
          this.$axios.get('/managerapi/custome/company/get').then(res => {
            this.companyList = res.datas;
            this.search.companyId = res.datas[0].id;
            let params = {
              companyId: res.datas[0].id
            }
            this.$axios.get('/managerapi/custome/shop/get', {
              params
            }).then(res => {
              this.shopList = res.datas;
              this.getList();
            })

        })
        }
    
      })
    },
    getTotal(param) {
      if (this.search.termId.length < 2) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (column.property == 'singleNums') {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          this.numSingle = sums[index];
      
          }else if(column.property == 'totalNums'){
            sums[index] = values.reduce((prev, curr) => {

              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.numTotal = sums[index];
          } else if(column.property == 'rate'){
            sums[index] = values.reduce((prev, curr) => {

              const value = Number(curr)
              // value = (value*100).toFixed(2)
              if (!isNaN(value)) {
                return (prev + curr) 
              } else {
                return prev;
              }
            }, 0);
            sums[index] = this.numTotal==0?'0.00%':((Number(this.numSingle)/Number(this.numTotal)*100).toFixed(2) + '%')
          } else {
            sums[index] = '--';
          }
        });

        return sums;
      } 

    },
    getTypeList() {
      this.$axios.get('/managerapi/custome/window/type/get').then(res => {
        if (res.result) {
          this.typeList = res.datas
          this.search.windowGenreId = res.datas[0].id
          this.winName = this.typeList.filter(el=>{
            return res.datas[0].id == el.id
          })[0].name
          this.getProductCat()
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
    getCompanyList(val) {
      this.search.shopId = '';
      if(val == ''){
        this.companyName = '全部分公司'
      }
      this.$axios.get('/managerapi/custome/company/get').then(res => {
        if (res.result) {
          this.companyList = res.datas
          this.companyName = res.datas.filter(item => {
            return item.id == val
          })[0].name
        }
      })
      let params = {
        companyId: val
      }
      this.$axios.get('/managerapi/custome/shop/get', {
        params
      }).then(res => {
        this.shopList = res.datas;
        this.getList();
      })
    },
    getWindowList() {
      this.$axios.get('/managerapi/custome/window/project/class/get').then(res => {
        if (res.result) {
          this.windowList = res.datas
        }
      })
    },
    getTermList() {
      this.$axios.get('/managerapi/custome/term/get').then(res => {
        if (res.result) {
          this.termList = res.datas
          this.search.termId[0] = res.datas[0].id
        }
      })
    },
    getTypeValue() {
      this.$axios.get('/managerapi/custome/data/statistics/project/genre/select').then(res => {
        if (res.result) {
          this.typeOptions = res.datas
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

      }
      if (this.search.termId.length <1) {
        this.$message({
          message: '最少要添加一项',
          type: 'error'
        });

      }
      this.getList()
    },
    detail(row) {
      this.search.companyId = row.id
      console.log(this.search.companyId)
      this.getList()
    },
    getList() {
      //门店单个项目数统计
      if (this.search.companyId > 0 && this.search.termId.length < 2) {
        this.loading = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.projectId = this.search.projectId
        this.$axios.get('/managerapi/custome/term/company/shop/window/single/projects/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            // res.datas.forEach(item=>{
            //   item.rate = (Number(item.rate)*10000/10000).toFixed(2)
            // })
            this.tableData = res.datas;
            
            this.total = res.datas.total;
          }
        });
      }
      //分公司单个项目数统计
      if (this.search.companyId == '' && this.search.termId.length < 2) {
        this.loading = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]

        params.projectId = this.search.projectId
        this.$axios.get('/managerapi/custome/term/company/window/single/projects/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas;
            this.total = res.datas.total;
          }
        });
      }
      //分公司两个周期单个项目数统计比较
      if (this.search.termId.length == 2 && this.search.companyId == '') {
        this.loading = true;
        // let params = this.search;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termTwoId = this.search.termId[1]
        this.$axios.get('/managerapi/custome/term/company/term/window/single/projects/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas;
            this.total = res.datas.total;
          }
        });
      }
      //分公司门店两个周期项目数统计比较
      if (this.search.termId.length == 2 && this.search.companyId > 0) {
        this.loading = true;
        // let params = this.search;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termTwoId = this.search.termId[1]
        this.$axios.get('/managerapi/custome/term/company/shop/term/window/projects/get', {
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
      this.search.shopId = '';
      
      this.getProduct()
      this.getWindowList()
      this.getTypeList()
      this.getTypeValue()
      this.getUserInfo()
      this.activeName = '3'
    },

    //导出
    exportExcel() {
      //分公司单个项目数统计
      if (this.search.companyId == '' && this.search.termId.length < 2) {
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        this.$axios.get('/managerapi/custome/get/company/single/projects/export', {
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
      if (this.search.companyId > 0 && this.search.termId.length < 2) {
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        this.$axios.get('/managerapi/custome/get/shop/single/projects/export', {
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
      if (this.search.termId.length == 2 && this.search.companyId == '') {
        this.exportDisable = true;
        // let params = this.search;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termTwoId = this.search.termId[1]
        this.$axios.get('/managerapi/custome/get/company/single/term/projects/export', {
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
    // handleChange(val){
    //   console.log(val)
    //   let params = Object.assign({},this.search);
    //   params.windowGenreId = val[val.length-1]
    //   this.getList()
    // }
  },
  created() {
    this.getUserInfo()
    this.getProduct()
    this.getTermList()
    this.getWindowList()
    this.getTypeList()
    this.getTypeValue()
    // this.getGenreList()
  },
  mounted() {

  }

};