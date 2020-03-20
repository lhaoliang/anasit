import httpConfig from "../../http.config";
export default {
  data() {
    return {
      roleId: 0,
      companyId: 0,
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      importLoading: false,
      exportDisable: false,
      loading: false,
      currentPage: 1,
      type: 'add',
      id: 0,
      productTypeList: {},
      productCatList: [],
      productList: {},
      search: {
        companyId: '',
        limit: 10,
        offset: 0,
        keyWord: ''
      },
      index: '',
      isShow: '1',
      total: 0,
      showDetail: false,
      formLabelWidth: '100px',
      company: [],
      blacklist: [],
      type: '',
      windows: {
        name: '',
        idno: '',
        companyId: '',
        projectName: '',
        reason: '',
        productCatId: ''
      },
      flag: false
    }
  },

  methods: {
    //获取个人信息
    getUserInfo() {
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.roleId = res.datas.roleId;
        if (res.datas.roleId == 3) {
          // this.search.companyId = res.datas.companyId
          // this.companyId = res.datas.companyId
        this.getblackList()

        }
        // this.search.companyId = res.datas.companyId
      })
    },
    //分公司下拉
    getCompanyDown() {
      this.$axios.get('/managerapi/custome/company/get').then(res => {
        this.company = res.datas;
        // let item = {
        //   id:'',
        //   name:'全部分公司'
        // }
        // this.company.unshift(item)
      })
    },
    //获取表格数据
    getblackList() {
      this.loading = true;
      let params = this.search
      this.$axios.get('/managerapi/custome/blacklist/list', {
        params
      }).then(res => {
        console.log(132)
        console.log(res);
        this.blacklist = res.datas.rows;
        this.total = res.datas.total;
      })
      this.loading = false
    },
    //删除公司
    toDel(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/managerapi/custome/blacklist/delete', {
          params: {
            id: scope,
          }
        }).then((res) => {
          this.$notify({
            title: '删除成功',
            message: `删除成功`,
            type: 'success'
          })
          this.getblackList()
        }).catch(() => {})
      })
    },
    onRest() {
      this.search = {
          limit: 10,
          offset: 0,
          keyWord: '',
          companyId: '',
        },
        this.getblackList();

    },
    onSubmitSearch() {
      this.getblackList();
    },
    forBlack(scope, type) {
      this.flag = type
      this.isShow = "2";
      this.getProductType();
      if (scope == 'add') {
        this.windows = {
          name: '',
          idNum: '',
          company: '',
          item: '',
          reason: ''
        }
        this.type = 'add'
      }
      if (scope.row) {
        this.type = 'edit'
        let params = {
          'id': scope.row.id
        }
        this.$axios.get('/managerapi/custome/blacklist/detail', {
          params
        }).then((res) => {
          console.log('37', res)
          this.windows = res.datas
          this.windows.productTypeId = res.datas.windowGenerId
          this.windows.productCatId = [res.datas.projectGenerId, res.datas.projectId]
          this.windows.productId = res.datas.projectId
          console.log('38', this.windows.productCatId)
        })
        this.id = scope.row.id
        this.index = scope.$index
      }
    },
    onEdit() {
      if (!this.windows.name ||
        !this.windows.idno ||
        !this.windows.companyId ||
        !this.windows.productTypeId ||
        !this.windows.productCatId ||
        !this.windows.reason) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.put('/managerapi/custome/blacklist/update', {
        id: this.id,
        name: this.windows.name,
        idno: this.windows.idno,
        companyId: this.windows.companyId,
        projectId: this.windows.productCatId[1],
        reason: this.windows.reason,
      }).then((res) => {
        if (res.result) {
          this.$notify({
            title: '黑名单信息修改成功',
            message: `黑名单信息修改成功`,
            type: 'success'
          })
          this.getblackList();
          this.isShow = '1'

        }
      })

    },
    onAdd() {
      if (!this.windows.name ||
        !this.windows.idno ||
        !this.windows.companyId ||
        !this.windows.productTypeId ||
        !this.windows.productCatId ||
        !this.windows.reason) {
        this.$notify({
          title: '请完善要添加的信息',
          message: '请检查是否完善添加信息，完善要添加的信息',
          type: 'warning'
        });
        return
      }
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(this.windows.idno) === false) {
        this.$message({
          message: '请输入正确的身份证号码',
          type: 'error'
        });
        return
      }
      for (let i in this.blacklist) {
        if (this.blacklist[i].idno == this.windows.idno) {
          this.$message({
            message: '该用户已经是黑名单成员，请勿重复添加',
            type: 'error'
          });
          return
        }
      }

      this.$axios.post('/managerapi/custome/blacklist/add', {
        name: this.windows.name,
        idno: this.windows.idno,
        companyId: this.windows.companyId,
        projectId: this.windows.productCatId[1],
        reason: this.windows.reason,
      }).then(res => {
        this.$message({
          message: "黑名单添加成功",
          type: 'success'
        });
        this.windows = {}
        this.isShow = 1
        this.getblackList();
      })
    },
    returnMain() {
      this.getblackList();
      this.isShow = 1
    },

    // 导入模板下载
    templateDownload() {
      window.location.href = this.server + "export_template/黑名单导入模板.xls";
    },

    // 模板导入
    beforeExcelUpload(file) {
      // console.log(file.type)
      // this.importLoading = true;
      // const isExcel = file.type == 'application/vnd.ms-excel';

      // if (!isExcel) {
      //   this.$message.error('文件导入只能是xlsx格式!');
      //   this.importLoading = false;
      // }

      // return isExcel;
    },
    excelUploadSuccess(res, file) {
      if (res.result) {
        this.$message.success('导入成功');
        this.getblackList();
      } else {
        this.$message.success(res.message);
      }
      this.importLoading = false;
    },

    // 导出表格
    exportExcel() {
      this.exportDisable = true;
      let params = this.search
      this.$axios.get('/managerapi/custome/window/blacklist/export', {
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
    },

    // 获取项目类型下拉
    getProductType() {
      this.$axios.get('/managerapi/custome/window/type/get').then(res => {
        this.productTypeList = res.datas;
        this.getProductCat();
      })
    },
    // 获取项目类型下拉
    getProductCat() {
      this.$axios.get('/managerapi/custome/data/statistics/project/genre/select').then(res => {
        this.productCatList = res.datas;
        //this.getProduct();
        console.log('333', res)
      })
    },
    // 获取项目类型下拉
    /*getProduct() {
       let params = {
         'windowGenreId': this.windows.productTypeId,
         'productGenreId': this.windows.productCatId
       }
       this.$axios.get('/managerapi/custome/window/project/get', {
         params
       }).then(res => {
         this.productList = res.datas;
       })
     },*/
    typeChange() {
      this.windows.productId = '';
      this.windows.productCatId = '';
      this.getProductCat();
    },
    catChange() {
      this.windows.productId = '';
      //this.getProduct();
    },
    productChange() {
      //this.getProduct();
    },
    // 分页
    handleSizeChange(val) {
      this.search.limit = val;
      this.getblackList();
    },
    // 分页
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit;
      this.getblackList();
    },
  },
  created() {
    this.getUserInfo();
    this.getCompanyDown();
    this.getblackList();
    this.getProductCat();
  },
};