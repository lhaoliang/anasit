import httpConfig from "../../http.config";
export default {

  data() {
    return {
      showDialog: false,
      importLoading: false,
      exportDisable: false,
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      loading: false,
      currentPage: 1,
      showPhoto: false,
      type: 'add',
      index: '',
      isShow: '1',
      total: 0,
      id: 0,
      companyId: '',
      showDetail: false,
      formLabelWidth: '100px',
      imgUrl: '',
      search: {
        limit: 10,
        offset: 0,
        keyWord: '',
        companyId: "",
        shopId: "",
        termId: "",
      },

      termList: [],

      companyList: [],

      shopList: [],

      priceList: [],
      multipleSelection: [],
      type: '',
      restaurants: [],
      state: '',
      gateProject: [],
      companyForm: {
        branchName: '江西分公司',
        name: '张三',
        phone: '13135613',
        account: 'josida',
        password: '123153'
      },

      //档口列表 
      gateType: [],

      windows: {
        termId: '',
        companyId: '',
        shopId: '',
        projectId: '',
        projectGenreId: '',
        sn: '',
        deposit: '',
        rental: '',
        waterEleRate: '',
        cleanRate: '',
        sanitationRate: '',
        shareMoney: '',
        otherMoney: '',
      },
      roleId: 0,
      file: {},
      imgFile: {},
      fileList: [],
      imgfileList: []
    }
  },

  methods: {

    // 选取图片后自动回调，里面可以获取到文件
    imgSaveToUrl(event, filelist2) { // 也可以用file
      console.log(filelist2)

      this.fileList = []
      this.fileList[0] = filelist2.pop()
      this.file = this.fileList[0].raw
      console.log(this.file)
    },
    getPhoto(e, filelist3) {
      console.log(filelist3)
      this.imgfileList = []
      this.imgfileList[0] = filelist3.pop()
      this.imgFile = this.imgfileList[0].raw
      console.log(this.imgFile)
    },
    submit() {

      let url = 'managerapi/custome/window/layout/price/import'
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
          if (res.result) {
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
    //获取个人信息
    getUserInfo() {
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.roleId = res.datas.roleId;
        if (this.roleId == 3) {
          this.search.companyId = res.datas.companyId;
          this.companyId = res.datas.companyId;
          let params = {
            companyId: this.search.companyId
          }
          this.$axios.get('/managerapi/custome/shop/get', {
            params
          }).then(res => {
            this.shopList = res.datas
            if(res.datas&&res.datas.length>0){
              this.search.shopId = res.datas[0].id;
            }else{
              this.search.shopId = '';
            }
            this.getPriceList();
          })
        }else{
          this.$axios.get('/managerapi/custome/company/get').then(res => {
            this.companyList = res.datas;
            this.search.companyId = res.datas[0].id
            let params = {
              companyId: this.search.companyId
            }
            this.$axios.get('/managerapi/custome/shop/get', {
              params
            }).then(res => {
              this.shopList = res.datas
              if(res.datas&&res.datas.length>0){
                this.search.shopId = res.datas[0].id;
              }else{
                this.search.shopId = '';
              }
              this.getPriceList();
            })
          })
        }
        



      })
    },
    //档口类型下拉
    getTypeDown() {
      this.$axios.get('/managerapi/custome/window/type/get').then(res => {
        this.gateType = res.datas;
      })
    },
    getCompanyId(val) {
      this.companyId = this.search.companyId
      this.search.shopId = ''
      if (val != 0) {
        this.getshopDown()
      }
    },
    getEditCompanyId() {
      this.companyId = this.windows.companyId
      this.windows.shopId = ''
      this.getshopDown()
    },
    //门店下拉
    getshopDown() {
      let params = {
        companyId: this.companyId
      }
      this.$axios.get('/managerapi/custome/shop/get', {
        params
      }).then(res => {
        this.shopList = res.datas;
        if(res.datas&&res.datas.length>0){
          this.search.shopId = res.datas[0].id
        }else{
          this.search.shopId = '';
        }
      })
    },
    //学期下拉
    getTermDown() {
      this.$axios.get('/managerapi/custome/term/get').then(res => {
        this.termList = res.datas;
        this.search.termId = res.datas[0].id;
      })
    },
    //档口名称下拉
    getProduct() {
      let params = {
        'windowGenreId': this.windows.projectGenreId,
      }
      this.$axios.get('/managerapi/custome/window/project/get', {
        params
      })
        .then(res => {
          this.gateProject = res.datas;
        })
    },
    typeChange() {
      this.windows.name = ''
      this.getProduct()
    },
    //获取表格数据
    getPriceList() {
      let params = this.search
      this.$axios.get('/managerapi/custome/window/layout/price/list', {
        params
      }).then(res => {
        console.log(res);
        res.datas.rows.forEach(item=>{
          if(Number(item.deposit)){
            item.deposit = Number(item.deposit).toFixed(2) 
          }
          if(Number(item.rental)){
            item.rental = Number(item.rental).toFixed(2) 
          }
          if(Number(item.waterEleRate)){
            item.waterEleRate = Number(item.waterEleRate).toFixed(2) 
          }
          if(Number(item.cleanRate)){
            item.cleanRate = Number(item.cleanRate).toFixed(3) 
          }
          if(Number(item.sanitationRate)){
            item.sanitationRate = Number(item.sanitationRate).toFixed(3) 
          }
          if(Number(item.shareMoney)){
            item.shareMoney = Number(item.shareMoney).toFixed(2) 
          }
          if(Number(item.otherMoney)){
            item.otherMoney = Number(item.otherMoney).toFixed(2) 
          }
        })
        this.priceList = res.datas.rows;
        this.total = res.datas.total
      })
    },
    // 分页
    handleSizeChange(val) {
      this.search.limit = val;
      this.getPriceList();
    },
    // 分页
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit;
      this.getPriceList();
    },
    //删除公司
    toDel(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/managerapi/custome/window/layout/price/delete', {
          params: {
            id: scope,
          }
        }).then((res) => {
          this.$notify({
            title: '删除成功',
            message: `删除成功`,
            type: 'success'
          })
          this.getPriceList();
        }).catch(() => { })
      })
    },
    onSubmitSearch() {
      this.getPriceList();
    },
    onRest() {
      if (this.roleId != 3) {
        this.$axios.get('/managerapi/custome/company/get').then(res => {
          this.search.companyId = res.datas[0].id
          let params = {
            companyId: this.search.companyId
          }
          this.$axios.get('/managerapi/custome/shop/get', {
            params
          }).then(res => {
            this.shopList = res.datas
            if(res.datas&&res.datas.length>0){
              this.search.shopId = res.datas[0].id;
              this.search = {
                limit: 10,
                offset: 0,
                keyWord: '',
                companyId: this.search.companyId,
                shopId: res.datas[0].id,
                termId: 2,
              }
              this.getPriceList();
            }else{
              this.search.shopId = '';
            }
          })
        })
      } else {
        this.search = {
          limit: 10,
          offset: 0,
          keyWord: '',
          companyId: this.search.companyId,
          shopId: this.search.shopId,
          termId: this.search.termId,
        }
      }

      this.getPriceList();

    },
    forGate(scope) {
      console.log(scope.$index);
      this.isShow = "2";
      if (scope == 'add') {
        this.windows = {
          termId: '',
          companyId: '',
          shopId: '',
          name: '',
          projectGenreId: '',
          sn: '',
          deposit: '',
          rental: '',
          waterEleRate: '',
          cleanRate: '',
          sanitationRate: '',
          shareMoney: '',
          otherMoney: '',
        }
        this.type = 'add'
      }
      if (scope.row) {
        this.type = 'edit'
        // this.imgUrl = scope.row.image
        this.id = scope.row.id
        let params = {
          id: this.id
        }
        this.$axios.get('/managerapi/custome/window/layout/price/detail', {
          params
        }).then(res => {
          // this.priceList = res.datas.rows;
          this.total = res.datas.total
          this.windows = {
            termId: res.datas.termId,
            companyId: res.datas.companyId,
            shopId: res.datas.shopId,
            projectGenreId: res.datas.windowGenreId,
            projectId: res.datas.projectId,
            sn: res.datas.sn,
            deposit: res.datas.deposit,
            rental: res.datas.rental,
            waterEleRate: res.datas.waterEleRate,
            cleanRate: res.datas.cleanRate,
            sanitationRate: res.datas.sanitationRate,
            shareMoney: res.datas.shareMoney,
            otherMoney: res.datas.otherMoney,
          }
          this.getProduct();
        })

      }
    },

    onEdit() {
      if (!this.windows.termId ||
        !this.windows.projectGenreId ||
        !this.windows.companyId ||
        !this.windows.shopId ||
        !this.windows.sn ||
        !this.windows.deposit ||
        !this.windows.waterEleRate ||
        !this.windows.cleanRate ||
        !this.windows.sanitationRate ||
        !this.windows.rental ||
        !this.windows.projectId) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.put('/managerapi/custome/window/layout/price/update', {
        id: this.id,
        termId: this.windows.termId,
        windowGenreId: parseInt(this.windows.projectGenreId),
        projectId: this.windows.projectId,
        companyId: this.windows.companyId,
        shopId: this.windows.shopId,
        sn: this.windows.sn,
        deposit: this.windows.deposit,
        rental: this.windows.rental,
        waterEleRate: this.windows.waterEleRate + "",
        cleanRate: this.windows.cleanRate + "",
        sanitationRate: this.windows.sanitationRate + "",
        shareMoney: this.windows.shareMoney,
        otherMoney: this.windows.otherMoney
      }).then((res) => {
        if (res.result) {
          this.$notify({
            title: '布局定价修改成功',
            message: `布局定价修改成功`,
            type: 'success'
          })
          this.getPriceList()
        }
      })
      this.isShow = 1

    },
    returnMain() {
      this.getPriceList();
      this.isShow = 1
    },
    //导入模板下载
    templateDownload() {
      window.location.href = this.server + "export_template/布局定价导入模板.xls";
    },
    // 模板导入
    beforeExcelUpload(file) {
      // console.log(file.type)
      // this.importLoading = true;
      // const isExcel = file.type == 'application/vnd.ms-excel';

      // return isExcel;
    },
    excelUploadSuccess(res, file) {
      this.importLoading = false;
      if (res.result) {
        this.$message.success('导入成功');
        this.getshopList();
      } else {
        this.$message.success(res.message);
      }


      console.log(res);
    },
    // 导出表格
    exportExcel() {
      this.exportDisable = true;
      let params = this.search
      this.$axios.get('/managerapi/custome/window/layout/price/export', {
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
  created() {
    this.getTermDown();
    this.getUserInfo();
    this.getTypeDown();
  },

};