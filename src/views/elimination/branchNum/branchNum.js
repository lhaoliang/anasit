import httpConfig from "../../../http.config";
export default {
  data() {
    return {
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      importLoading: false,
      loading: false,
      currentPage: 1,
      limit: 10,
      offset: 0,
      total: '2',
      companyId: 0,

      termId: 2,
      isShow: '1',
      shopId: '',
      imgUrl: '',
      id: '',
      companySearch: {
        termId: 2,
        keyWord: ''
      },
      importBranch: {
        termId: '',
        companyName: ''
      },

      importShop: {
        termId: '',
        companyId: '',
        shopName: '',
      },
      importGate: {
        companyId: '',
        termId: '',
        shopId: '',
        windowName: '',
      },
      gateSearch: {
        companyId: '',
        termId: '',
        shopId: '',
        keyWord: '',
      },
      shopSearch: {
        companyId: '',
        termId: '',
        keyWord: ''
      },

      type: 'edit',
      showTip: false,
      showPhoto: false,
      formLabelWidth: '100px',
      termList: [],
      companyList: [],
      shopList: [],
      gateItemList: [],

      company: [],
      gateList: [],

      multipleSelection: [],
      restaurants: [],
      state: '',
      shopState: '',
      editPlan: {
        termId: '',
        companyId: '',
        shopId: '',
        shopName: '',
        companyName: '',
        windowId:'',
        windowGenreId: '',
        sn: '',
        cooperatorName: '',
        cooperatorIdno: '',
        outReason: '',
      },
      roleId: 0,
      file: {},
      imgFile: {},
      fileList: [],
      imgfileList: [],
      showDialog: false,
      gateProject:[],
      shopList2:[],
      gateProject2:[]
    }

  },

  methods: {
    getWindowList() {
      let params = {
        shopId: this.editPlan.shopId
      }
      this.$axios.get('/managerapi/custome/cost/window/list', {
        params
      }).then(res => {
        this.gateProject = res.datas
      })
    },
    getWindowInfo(val) {
      var res = this.gateProject.filter(item => {
        return val == item.id
      })[0]
      console.log(val)
      this.editPlan.windowId = val
      this.editPlan.sn = res.sn
      this.editPlan.cooperatorName = res.cooperatorName
      this.editPlan.cooperatorIdno = res.cooperatorIdno
      this.editPlan.cooperatorPhone = res.cooperatorPhone
    },
    // 选取图片后自动回调，里面可以获取到文件
    imgSaveToUrl(event, filelist2) { // 也可以用file
      this.fileList = []
      this.fileList[0] = filelist2.pop()
      this.file = this.fileList[0].raw
    },
    getPhoto(e, filelist3) {
      this.imgfileList = []
      this.imgfileList[0] = filelist3.pop()
      this.imgFile = this.imgfileList[0].raw
    },
    submit() {

      let url = '/managerapi/custome/window/out/import'
      let formData = new FormData();
      formData.append("upload", this.file);
      formData.append("image", this.imgFile);
      this.headers = {
        "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary1O2d0EjsxfkeAK7f"
      };
      this.$axios
        .post(url, formData, {
          headers: this.headers
        })
        .then(res => {
          this.showDialog = false
          this.fileList = []
          this.imgfileList = []
          if(res.result){
            this.$notify({
              title: '导入成功',
              message: `导入成功`,
              type: 'success'
            })
          }
        })
        .catch(err => {
          alert(err);
        });
    },
    cancel() {
      this.fileList = []
      this.imgfileList = []
      this.showDialog = false
    },
    getImg(res) {
      console.log(res)
    },
    getFile(res) {
      console.log(res)
    },
    beforeAvatarUpload(res, file) {
      console.log(file, '文件')
      // console.log(res, 111)
    },
    objectSpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      /*  console.log(111)
        console.log(row)
        console.log(rowIndex)
        console.log(column)
        console.log(columnIndex)
        if (columnIndex === 2) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }*/
    },
    //档口项目下拉
    getItemDown() {
      this.$axios.get('/managerapi/custome/window/project/get').then(res => {
        this.gateItemList = res.datas;
      })
    },
    //获取用户信息
    getUserInfo() {
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.roleId = res.datas.roleId;
        if (this.roleId == 3) {
          this.shopSearch.companyId = res.datas.companyId
          this.companyId = res.datas.companyId
          this.isShow = 2
        }
        // this.termId = this.termId
        // this.getblackList()
        this.getshopList()
      })
    },
    //门店下拉
    getshopDown() {
      let params = {
        companyId: this.editPlan.companyId
      }
      this.$axios.get('/managerapi/custome/shop/get', {
        params
      }).then(res => {
        console.log(11111111)
        console.log(res)
        this.shopList = res.datas;

      })
     
    },
    changeShopDown(){
      this.getshopDown()
      // this.getWindowList()
    },
    //学期下拉
    getTermDown() {
      this.$axios.get('/managerapi/custome/term/get').then(res => {
        console.log('22', res)
        this.termList = res.datas;
        // this.companySearch.termId = this.termList[0].id
        this.getCompanyList();
      })
    },
    //分公司下拉
    getCompanyDown() {
      this.$axios.get('/managerapi/custome/company/get').then(res => {
        this.company = res.datas;
      })
    },
    //分公司淘汰数值
    getCompanyList() {
      let params = this.companySearch
      this.$axios.get('/managerapi/custome/company/outplan/total', {
        params
      }).then(res => {
        this.companyList = res.datas;
      })
    },
    //分店淘汰数值
    getshopList() {
      let params = this.shopSearch
      params.companyId = this.companyId
      params.termId = this.companySearch.termId
      this.$axios.get('/managerapi/custome/shop/outplan/total', {
        params
      }).then(res => {
        this.shopList = res.datas;
      })
    },
    //档口淘汰列表
    getgateList() {
      let params = this.gateSearch
      params.companyId = this.companyId
      params.termId = this.termId
      params.shopId = this.shopId
      this.$axios.get('/managerapi/custome/window/outplan/total', {
        params
      }).then(res => {
        console.log(136)
        console.log(res)
        console.log(136)
        this.gateList = res.datas;
      })
    },
    getCompanyId() {
      this.companyID = this.editPlan.companyId
      this.editPlan.shopId = ''
      this.getshopDown()
    },
    //淘汰详情
    toEdit(scope, type) {
      this.type = type
      this.id = scope.row.id
      console.log(scope.row.shopId)
      this.editPlan = {
        termId: scope.row.termId,
        companyId: scope.row.companyId,
        shopId: scope.row.shopId,
        shopName: scope.row.shopName,
        companyName: scope.row.companyName,
        windowGenreId: scope.row.windowGenreId,
        projectId:scope.row.projectId,
        windowId:scope.row.windowId,
        sn: scope.row.sn,
        cooperatorName: scope.row.cooperatorName,
        cooperatorIdno: scope.row.cooperatorIdno,
        outReason: scope.row.outReason,
      }
      let params2 = {
        companyId: scope.row.companyId
      }
      this.$axios.get('/managerapi/custome/shop/get', {
        params2
      }).then(res => {
        this.shopList2 = res.datas;
        let params = {
          shopId: scope.row.shopId
        }
        this.$axios.get('/managerapi/custome/cost/window/list', {
          params
        }).then(res => {
          this.gateProject2 = res.datas;
        })
  
      })



      // this.getshopDown()
      // this.getWindowList()
      // this.shopId = scope.row.shopId
      this.isShow = 4
    },
    toDetail(scope, type) {
      this.isShow = 4
      this.type = type
      this.id = scope.row.id
      this.$axios.get('/managerapi/custome/outplan/detail?id=' + this.id)
        .then(res => {
          this.editPlan = res.datas;
          this.editPlan.shopName = res.datas.shopName
          this.editPlan.companyName = res.datas.companyName
        })
    },

    onSearchCompany() {
      this.getCompanyList();
    },
    onRestCompany() {
      this.companySearch = {
          termId: this.termList[0].id,
          keyWord: ''
        },
        this.getCompanyList();

    },
    onSearchShop() {
      this.getshopList();
    },
    onRestShop() {
      this.shopSearch.keyWord = '';
        this.getshopList();

    },
    onSearchGate() {
      this.getgateList();
    },
    onRestGate() {
        this.gateSearch.keyWord = '';
        this.getgateList();
    },
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    totals() {

    },
    toNext(scope) {

      if (scope.total == 0) {
        this.showTip = true
      } else {
        this.companyId = scope.row.companyId
        this.termId = this.companySearch.termId
        // this.shopId = scope.row.outwindow.shopId
        let params = this.shopSearch
        params.companyId = this.companyId
        params.termId = this.termId
        this.$axios.get('/managerapi/custome/shop/outplan/total', {
          params
        }).then(res => {
  
          this.shopList = res.datas;
        })

        this.isShow = 2
      }
    },
    onSubmit() {
      if (!this.editPlan.termId ||
        !this.editPlan.windowGenreId ||
        !this.editPlan.companyId ||
        !this.editPlan.shopId ||
        !this.editPlan.sn ||
        !this.editPlan.cooperatorName ||
        !this.editPlan.cooperatorIdno ||
        !this.editPlan.outReason) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(this.editPlan.cooperatorIdno) === false) {
        this.$message({
          message: '请输入正确的身份证号码',
          type: 'error'
        });
        return
      }
      this.$axios.put('/managerapi/custome/outplan/update', {
        id: this.id,
        termId: this.editPlan.termId,
        companyId: this.editPlan.companyId,
        shopId: this.editPlan.shopId,
        windowId: this.editPlan.windowId,
        sn: this.editPlan.sn,
        cooperatorName: this.editPlan.cooperatorName,
        cooperatorIdno: this.editPlan.cooperatorIdno,
        outReason: this.editPlan.outReason,
      }).then((res) => {
        if (res.result) {
          this.$notify({
            title: '信息修改成功',
            message: `信息修改成功`,
            type: 'success'
          })
          this.getgateList();
        }
      })
      this.isShow = 3

    },
    toLast(scope) {
      this.shopId = scope.row.shopId
      let params = this.gateSearch
      params.companyId = this.companyId
      params.termId = this.companySearch.termId
      params.shopId = scope.row.shopId
      this.id = scope.row.id

      this.$axios.get('/managerapi/custome/window/outplan/total', {
        params
      }).then(res => {

        this.gateList = res.datas;
        this.imgUrl = res.datas.image
      })
      this.isShow = 3
    },
    //导入模板下载
    templateDownload() {
      window.location.href = this.server + "export_template/淘汰计划导入模板.xls";
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
        this.$message({
          message: '导入成功',
          type: 'success'
        });
        this.getCompanyList();
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        });
      }
      this.importLoading = false;

      console.log(res);
    },
    // 导出公司表格
    exportExcelBranch() {
      let params = this.importBranch
      params.termId = this.companySearch.termId
      params.companyName = this.companySearch.keyWord
      this.$axios.get('/managerapi/custome/company/total/export', {
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
      })
    },
    // 导出分店表格
    exportExcelShop() {
      let params = this.importShop
      params.companyId = this.companyId
      params.termId = this.termId
      params.shopName = this.shopSearch.keyWord
      this.$axios.get('/managerapi/custome/shop/total/export', {
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
      })
    },
    // 导出档口表格
    exportExcelGate() {
      let params = this.importGate
      params.companyId = this.companyId
      params.termId = this.termId
      params.shopId = this.shopId
      params.windowName = this.gateSearch.keyWord
      console.log(params.companyId)
      console.log(params.shopId)
      console.log('33', params.termId)
      this.$axios.get('/managerapi/custome/window/out/export', {
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
      })
    },
  },
  created() {
    this.getTermDown();
    this.getCompanyDown();
    this.getItemDown();
    // this.getshopDown();
    this.getCompanyList();
    this.getUserInfo();
  },
  mounted() {}

};