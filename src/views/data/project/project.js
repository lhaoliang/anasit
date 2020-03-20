import httpConfig from "../../../http.config";
export default {

  data() {
    return {
      search: {
        windowGenreId: '',
        companyId: '',
        termId: [1],
        shopId: ''
      },
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      exportDisable: false,
      loading: false,
      currentPage: 1,
      termOne: '',
      termTwo: '',
      roleId: 0,
      date: '',
      activeName: '1',
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
      key1:1,
      key2:2,
      key3:3,
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
          this.search.termId[0] = res.datas[0].id
        }
      })
    },
    changeGood(value) {
      let choosenItem = this.goodsList.filter(item => item.goodsName === value)[0]
      this.goods.goodsId = choosenItem.id
    },
    termChange() {
      this.termList.forEach(item => {
        if (item.id == this.search.termId[0]) {
          this.termOne = item.name
        }
        if (item.id == this.search.termId[1]) {
          this.termTwo = item.name
        }
      })
      if (this.search.termId.length == 0) {
        this.$message({
          message: '至少选择一个学期',
          type: 'error'
        });
        return
      }
      if (this.search.termId.length > 2) {
        this.$message({
          message: '最多只能添加两项',
          type: 'error'
        });
        return
      }
      this.getList()
    },
    detail(row) {
      console.log(row.id)
      this.search.companyId = row.id
      console.log(this.search.companyId)
      this.getList()
    },
    toFilist(row) {

      this.$router.push({
        path: '/inside-admin/file',
        query: {
          company: row.companyId,
          shop: row.id,
          termId:this.search.termId[0]
        }
      })
    },

    getCompanyList(val){
      this.search.shopId = ''
      this.search.companyId = val
      let params = {
        companyId:val
      };
      this.$axios.get('/managerapi/custome/shop/get', {
        params
      }).then(res => {
        this.shopList = res.datas;
        this.getList();
      })
    },
    getList() {
      //获取分公司所有门店项目数
      if (this.search.companyId > 0 && this.search.termId.length < 2) {
        this.loading = true;
        // let params = this.search;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]

        this.$axios.get('/managerapi/custome/term/company/shop/window/projects/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas;
            this.total = res.datas.total;
          }
        });
      }
      //获取所有分公司项目数
      if (this.search.companyId == '' && this.search.termId.length < 2) {
        this.loading = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        this.$axios.get('/managerapi/custome/term/company/window/projects/get', {
          params
        }).then(res => {
          this.loading = false;
          if (res.result) {
            this.tableData = res.datas;
            this.total = res.datas.total;
          }
        });
      }
      //分公司两个周期项目数统计比较
      if (this.search.termId.length == 2 && this.search.companyId == '') {
        this.loading = true;
        // let params = this.search;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termTwoId = this.search.termId[1]
        this.$axios.get('/managerapi/custome/term/company/term/window/projects/get', {
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

    onRest() {
      if(this.roleId !=3){
        this.search = {
          windowGenreId: '',
          companyId: '',
          termId: [2],
          shopId: ''
        },
        this.activeName = '1'
        this.getList()
      }else{
        this.search = {
          windowGenreId: '',
          companyId: this.search.companyId,
          termId: [2],
          shopId: ''
        },
        this.activeName = '1'
        this.getList()
      }

    },

    // 导出表格
    exportExcel() {
      //获取所有分公司项目数
      if (this.search.companyId=='' && this.search.termId.length < 2){
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        this.$axios.get('/managerapi/custome/get/company/projects/export', {
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
      }else if(this.search.companyId > 0 && this.search.termId.length < 2){
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        console.log('222',params)
        this.$axios.get('/managerapi/custome/get/shop/projects/export', {
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
      }else if(this.search.termId.length == 2){
        this.exportDisable = true;
        let params = Object.assign({}, this.search);
        params.termId = this.search.termId[0]
        params.termTwoId = this.search.termId[1]
        console.log('222',params)
        this.$axios.get('/managerapi/custome/get/company/term/projects/export', {
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
  },
  created() {
    this.getTermList()
    this.getWindowList()
    this.getUserInfo()
  },
  mounted() {

  }

};