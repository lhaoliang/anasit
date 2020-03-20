import httpConfig from "../../../http.config";
export default {
  data() {
    return {
      search: {
        windowGenreId: '',
        companyId: '',
        termId: [2, 4],
        shopId: ''
      },
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      exportDisable: false,
      loading: false,
      currentPage: 1,
      termOne: '2019下学期',
      termTwo: '2018上学期',
      roleId: 0,
      key4: 4,
      key2: 2,
      key3: 3,
      key1: 1,
      date: '',
      activeName: '2',
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
      pickerOptions1: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pickerOptions2: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
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
      termName:'',
      termNameTwo:'',
      companyForm: {
        branchName: '江西分公司',
        name: '张三',
        phone: '13135613',
        account: 'josida',
        password: '123153'
      },


    }
  },

  methods: {
    //获取个人信息
    getUserInfo() {
      this.loading = true
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.loading = false
        this.roleId = res.datas.roleId;

        if (res.datas.roleId == 3) {
          this.search.companyId = res.datas.companyId
          let params = {
            companyId: res.datas.companyId
          }
          this.$axios.get('/managerapi/custome/shop/get', {
            params
          }).then(res => {
            this.shopList = res.datas;
            this.getList();
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
    // getTotal(param) {
    //   if(this.search.termId.length<2){
    //     const {
    //       columns,
    //       data
    //     } = param;
    //     const sums = [];
    //     columns.forEach((column, index) => {
    //       if (index === 0) {
    //         sums[index] = '合计';
    //         return;
    //       }
    //       const values = data.map(item => Number(item[column.property]));
    //       if (column.property == 'nums') {
    //         sums[index] = values.reduce((prev, curr) => {
    //           const value = Number(curr);
    //           if (!isNaN(value)) {
    //             return prev + curr;
    //           } else {
    //             return prev;
    //           }
    //         }, 0);
    //         sums[index];
    //       } else {
    //         sums[index] = '--';
    //       }
    //     });

    //     return sums;
    //   }else{
    //     const {
    //       columns,
    //       data
    //     } = param;
    //     const sums = [];
    //     columns.forEach((column, index) => {
    //       if (index === 0) {
    //         sums[index] = '合计';
    //         return;
    //       }
    //       const values = data.map(item => Number(item[column.property]));
    //       if (column.property == 'nums2' || column.property == 'nums1') {
    //         sums[index] = values.reduce((prev, curr) => {
    //           const value = Number(curr);
    //           if (!isNaN(value)) {
    //             return prev + curr;
    //           } else {
    //             return prev;
    //           }
    //         }, 0);
    //         sums[index];
    //       } else {
    //         sums[index] = '--';
    //       }
    //     });

    //     return sums;
    //   }

    // },

    // openEdit(scope) {
    //   if (scope.operation == 5) {
    //     this.$router.push({
    //       path: `/data/project-detail/${scope.id}`
    //     })

    //   }


    // },
    // 构造多个参数的command
    commandValue(operation = '', id = '', status = '', row = {}) {
      return {
        "status": status,
        "id": id,
        "operation": operation,
        "row": row
      }
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

      getCompanyList(val){
        this.search.shopId = ''
        this.search.companyId = val
        let params = {
          companyId:val
        }
        this.$axios.get('/managerapi/custome/shop/get', {
          params
        }).then(res => {
          this.shopList = res.datas;
          this.getList();
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
          this.search.termId[0] = res.datas[0].id
          this.search.termId[1] = res.datas[1].id
          this.termChange()

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
          message: '只能添加两项',
          type: 'error'
        });
        return
      }
      if (this.search.termId.length != 2) {
        this.$message({
          message: '请选择两个学期',
          type: 'error'
        });
        return
      }

    },
    detail(row) {
      this.$router.push({
        path: '/data/project-detail',
        query: {
          termId: this.search.termId[0],
          termIdTwo: this.search.termId[1],
          shopId: row.id
        }
      })
    },
    getList() {
      //获取分公司项目流失数
      if (this.search.termId.length == 2 && this.search.companyId == '') {
        this.loading = true;
        // let params = this.search;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termIdTwo = this.search.termId[1]
        this.$axios.get('/managerapi/custome/term/company/project/loss/nums', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas.companys;
            this.termName = res.datas.termName;
            this.termNameTwo = res.datas.termTwoName;
            // this.total = res.datas.total;
          }
        });
      }
      //获取分公司门店项目流失数
      if (this.search.termId.length == 2 && this.search.companyId > 0) {
        this.loading = true;
        // let params = this.search;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termIdTwo = this.search.termId[1]
        this.$axios.get('/managerapi/custome/term/company/shop/project/loss/nums', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas.shops;
            this.termName = res.datas.termName;
            this.termNameTwo = res.datas.termTwoName;
            // this.total = res.datas.total;
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
      if(this.roleId == 3){
        this.search.shopId = '';
        this.search.windowGenreId = ''
        this.$axios.get('/managerapi/custome/term/get').then(res => {
          if (res.result) {
            this.search.termId[0] = res.datas[0].id
            this.search.termId[1] = res.datas[1].id
            this.getList()
          }
        })
      }else{
        this.search.shopId = '';
        this.search.windowGenreId = ''
        this.$axios.get('/managerapi/custome/term/get').then(res => {
          if (res.result) {
            this.search.termId[0] = res.datas[0].id
            this.search.termId[1] = res.datas[1].id
            this.$axios.get('/managerapi/custome/company/get').then(result => {
              this.search.companyId = result.datas[0].id;
              this.getList()
            })
          }
        })
      }


      this.activeName = '2'

    },
    //导出
    exportExcel() {
      //分公司项目流失数
      if (this.search.termId.length == 2 && this.search.companyId == '') {
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termIdTwo = this.search.termId[1]
        this.$axios.get('/managerapi/custome/term/company/project/loss/nums/export', {
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
      if (this.search.termId.length == 2 && this.search.companyId > 0) {
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termIdTwo = this.search.termId[1]
        this.$axios.get('/managerapi/custome/term/company/shop/project/loss/nums/export', {
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
 
    this.getTermList()
  
    this.getWindowList()
    this.getUserInfo()
  },
  mounted() {

  }

};