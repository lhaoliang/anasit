import httpConfig from "../../../http.config";
import area from "./area.js";
import { regionData,CodeToText,TextToCode} from 'element-china-area-data'
export default {

  data() {
    return {
      address:  regionData,
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      importLoading: false,
      exportDisable: false,
      loading: false,
      currentPage: 1,
      id: '',
      total: 0,
      index: '',
      search: {
        offset: 0,
        limit: 10,
        keyWord: '',
        companyId: '',
      },
      title: true,
      isShow: 1,
      formLabelWidth: '100px',
      shopList: [],
      multipleSelection: [],
      form: {
        name: '',
        area: '',
        companyId: '',
        province: '',
        city: '',
        region: '',
        address: '',
        manager: '',
        phone: '',
        account: '',
        password: '',
      },
      selectBranch: [{
        value: 1,
        label: '江西分公司'
      }, {
        value: 2,
        label: '安徽分公司'
      }, {
        value: 3,
        label: '湖南分公司'
      }, {
        value: 4,
        label: '湖北分公司'
      }, {
        value: 5,
        label: '广东分公司'
      }],

      selectProvince: [{
        value: '江西省',
        label: '江西省'
      }, {
        value: '湖南省',
        label: '湖南省'
      }, {
        value: '湖北省',
        label: '湖北省'
      }, {
        value: '安徽省',
        label: '安徽省'
      }, {
        value: '广东省',
        label: '广东省'
      }],



      selectCity: [{
        value: '南昌市',
        label: '南昌市'
      }, {
        value: '新余市',
        label: '新余市'
      }],
      selectRegion: [{
        value: '青山湖区',
        label: '青山湖区'
      },],
      company: [],
      roleId: 0
    }


  },

  methods: {
    changeArea(){
        console.log(this.form.area);

    },
    //获取个人信息
    getUserInfo() {
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.roleId = res.datas.roleId;
        if (this.roleId == 3) {
          this.search.companyId = res.datas.companyId;
        }
        this.getshopList();


      })
    },

    //获取公司下拉
    getcompanyDown() {
      this.$axios.get('/managerapi/custome/company/get'
      ).then(res => {
        this.company = res.datas;
      })
    },
    //获取表格数据
    getshopList() {
      let params = this.search
      this.$axios.get('/managerapi/custome/shop/list', { params }
      ).then(res => {
        this.shopList = res.datas.rows;
        this.shopList.company = []
        this.total = res.datas.total;
      })
    },
    // 分页
    handleSizeChange(val) {
      this.search.limit = val;
      this.getshopList();
    },
    // 分页
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit;
      this.getshopList();
    },
    goGateList(companyId, shopId) {
      this.$router.push(
        { path: '/inside-admin/file', query: { company: companyId, shop: shopId } }
      )
    },
    //搜索
    onSubmitSearch() {
      this.getshopList();
    },

    //重置
    onRest() {
      if(this.roleId!=3){
        this.search = {
          offset: 0,
          limit: 10,
          keyWord: '',
          companyId: '',
        }
      }else{
        this.search = {
          offset: 0,
          limit: 10,
          keyWord: '',
          companyId: this.search.companyId,
        }
      }
      this.getshopList();
    },
    //删除公司
    toDel(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/managerapi/custome/shop/delete', {
          params: {
            id: scope,
          }
        }).then((res) => {
          this.$notify({
            title: '删除成功',
            message: `删除成功`,
            type: 'success'
          })
          this.getshopList();
        }).catch(() => { })

      })
    },


    forShop(scope, index) {
      console.log(scope.row);
      console.log(index)
      this.isShow = 2;
      this.index = index
      if (scope == 'add') {
        this.title = true;

        this.form = {

        }
        if (this.roleId == 3) {
          this.form.companyId = this.search.companyId
        }

        this.type = 'add'
      }
      if (scope.row) {
        console.log('22',scope.row)
        this.type = 'edit'
        this.title = false
        this.id = scope.row.id
        if (scope.row.city == null && scope.row.region == null) {
          scope.row.area = [ TextToCode[scope.row.province].code ]
        } else if (scope.row.region == null) {
          scope.row.area = [TextToCode[scope.row.province].code, TextToCode[scope.row.province][scope.row.city].code]
        } else {
          scope.row.area = [TextToCode[scope.row.province].code, TextToCode[scope.row.province][scope.row.city].code, TextToCode[scope.row.province][scope.row.city][scope.row.region].code]
        }
        this.form = {
          name: scope.row.name,
          companyId: scope.row.companyId,
          province: scope.row.province,
          city: scope.row.city,
          region: scope.row.region,
          address: scope.row.address,
          area: scope.row.area,
          manager: scope.row.manager,
          phone: scope.row.phone,
          account: scope.row.user.account ? scope.row.user.account : '',
          password: scope.row.user.realPassowrd ? scope.row.user.realPassowrd : '',
        }
      }
    },
    onEdit() {
      if (!this.form.name
        || !this.form.address
        || !this.form.companyId
        || !this.form.manager
        || !this.form.area
        || !this.form.phone
        || !this.form.account
        || !this.form.password) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      if(!(/^1[3456789]\d{9}$/.test(this.form.phone))){ 
        this.$message({
          message: '请输入正确的手机号码',
          type: 'error'
        });
        return
      } 
      let params = this.form.area
      if (params.length == 1) {
        this.form.province = CodeToText[params[0]] ,
          this.form.city = "",
          this.form.region = ""
      } else if (params.length == 2) {
        this.form.province = CodeToText[params[0]],
          this.form.city = CodeToText[params[1]],
          this.form.region = ""

      } else {
        this.form.province = CodeToText[params[0]],
          this.form.city = CodeToText[params[1]],
          this.form.region = CodeToText[params[2]]
      }
      this.$axios.put('/managerapi/custome/shop/update', {
        id: this.id,
        companyId: this.form.companyId,
        name: this.form.name,
        province: this.form.province,
        city: this.form.city,
        region: this.form.region,
        manager: this.form.manager,
        phone: this.form.phone,
        address: this.form.address,
        password: this.form.password,
        account: this.form.account,
      }).then((res) => {
        if (res.result) {
          this.$notify({
            title: '信息修改成功',
            message: `${this.form.name}信息修改成功`,
            type: 'success'
          })
          this.getshopList();
          this.isShow = 1
        }
      })

    },
    onAdd() {
      if (!this.form.name
        || !this.form.address
        || !this.form.companyId
        || !this.form.area
        || !this.form.manager
        || !this.form.phone
        || !this.form.account
        || !this.form.password) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      if(!(/^1[3456789]\d{9}$/.test(this.form.phone))){ 
        this.$message({
          message: '请输入正确的手机号码',
          type: 'error'
        });
        return
      } 
      let params = this.form.area
      // this.form.area[0] =  CodeToText[this.form.area[0]];
      // this.form.area[1] =  CodeToText[this.form.area[1]];
      // this.form.area[2] =  CodeToText[this.form.area[2]];
      if (params.length == 1) {
        this.form.province = CodeToText[params[0]] ,
          this.form.city = "",
          this.form.region = ""
      } else if (params.length == 2) {
        this.form.province = CodeToText[params[0]],
          this.form.city = CodeToText[params[1]],
          this.form.region = ""

      } else {
        this.form.province = CodeToText[params[0]],
          this.form.city = CodeToText[params[1]],
          this.form.region = CodeToText[params[2]]
      }
      this.$axios.post('/managerapi/custome/shop/add', {
        companyId: this.form.companyId,
        name: this.form.name,
        province: this.form.province,
        city: this.form.city,
        region: this.form.region,
        manager: this.form.manager,
        phone: this.form.phone,
        address: this.form.address,
        password: this.form.password,
        account: this.form.account,

      }).then(res => {
        this.$message({
          message: "分店添加成功",
          type: 'success'
        });
        this.isShow = 1
        this.getshopList()
      })


    },
    returnMain() {
      this.getshopList();
      this.isShow = 1
    },
    //导入模板下载
    templateDownload() {
      window.location.href = this.server + "export_template/分店导入模板.xls";
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
        this.getshopList();
      } else {
        this.$message.success(res.message);
      }
      this.importLoading = false;

      console.log(res);
    },
    // 导出表格
    exportExcel() {
      this.exportDisable = true;
      let params = this.search
      this.$axios.get('/managerapi/custome/shop/export', {
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
    this.getUserInfo();
    this.getcompanyDown();
  },
  mounted() {
    this.search.companyId = this.$route.query.keyWord
  }

};