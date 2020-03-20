import httpConfig from "../../../http.config";
import { Loading } from "element-ui";
export default {
  data() {
    return {
      roleId: 0,
      companyId:0,
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      params: { //总部
        turnoverReportingTime: '',
        turnoverReportingEndtime: '',
        companyCheckEndtime: '',
        groupCheckEndtime: '',
        shopRankViewtime: '',
        companyRankViewtime: '',
        tel: ''
      },
      branchPhone: '',
      info: {},
      loading:false
    }
  },

  methods: {
    getUserInfo() {
      this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
        this.roleId = res.datas.roleId;
        if(res.datas.roleId==3){
          this.companyId = res.datas.companyId
        }
      })
    },
    getParams() {
      this.loading = true
      this.$axios.get('/managerapi/custome/parameters/get', {}).then(res => {
        this.loading = false
        this.params = res.datas
      })
    },
    addCompanyParams(){
      this.$axios.post('/managerapi/custome/parameters/company/tel/save', {
        companyId: this.companyId,
        tel: this.branchPhone,
      }).then(res => {
        if (res.result) {
          this.$message({
            message: '参数保存成功',
            type: 'success'
          });
        }
      })
    },
    addParams() {
      if(!this.params.turnoverReportingTime ||
        !this.params.turnoverReportingEndtime ||
        !this.params.companyCheckEndtime ||
        !this.params.groupCheckEndtime ||
        !this.params.shopRankViewtime ||
        !this.params.companyRankViewtime ||
        !this.params.tel){
        this.$message({
          message: '请填写完整信息',
          type: 'error'
        });
        return
      }
      this.$axios.post('/managerapi/custome/parameters/save', {
        turnoverReportingTime: this.params.turnoverReportingTime,
        turnoverReportingEndtime: this.params.turnoverReportingEndtime,
        companyCheckEndtime: this.params.companyCheckEndtime,
        groupCheckEndtime: this.params.groupCheckEndtime,
        shopRankViewtime: this.params.shopRankViewtime,
        companyRankViewtime: this.params.companyRankViewtime,
        tel: this.params.tel,
      }).then(res => {
        if (res.result) {
          this.$message({
            message: '参数保存成功',
            type: 'success'
          });
          this.getParams()
        }
      })
    }
  },
  created() {
    this.getParams()
  },
};