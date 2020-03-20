import httpConfig from "../../http.config";
export default {

  data() {
    return {
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      importLoading: false,
      exportDisable: false,
      loading: false,
      currentPage: 1,
      isShow: '1',
      total: 0,
      status:'',
      search: {
        limit: 10,
        offset: 0,
        startTime:'',
        endTime:'',
        status:'',
      },
      valueTime: '',
      showDetail: false,
      formLabelWidth: '100px',
      
      stateList: [
        {
          value: '',
          label: '全部状态'
        },
        {
          value: '1',
          label: '待处理'
        }, {
          value: '2',
          label: '处理中'
        }, {
          value: '3',
          label: '已完成'
        }],



      complainList: [],

      //档口列表


      branchTwo: [{
        value: '江西分公司',
        label: '江西分公司'
      }],
      shopTwo: [{
        value: '湖北分公司',
        label: '湖北分公司'
      }, {
        value: '湖南分公司',
        label: '湖南分公司'
      }
      ],

      windows: {
        phone: '',
        company: '',
        shop:'',
        status:'',
        content: '',
        createdAt: ''
      },
      images: []
    }
  },

  methods: {
    getComplainList(){
      let params = this.search
      params.startTime = this.valueTime[0]
      params.endTime = this.valueTime[1]
      this.$axios.get('/managerapi/custome/record/list', { params }
      ).then(res => {
        console.log(111)
        console.log(res);
        this.complainList = res.datas.rows;
        this.total = res.datas.total;
      })
    },
    toReset(){
      this.search = {
        limit: 10,
        offset: 0,
        startTime:'',
        endTime:'',
        status:'',
      }
      this.valueTime = [];
      this.getComplainList()
    },
    forComplain(scope) {
      console.log(scope);
      this.isShow = "2";
      if (scope.row) {
        this.$axios.get('/managerapi/custome/record/detail?id='+scope.row.id
      ).then(res => {
        console.log(2222222)
        console.log(res);
        this.windows = scope.row
        this.images = res.datas.images
        console.log(this.images)
      })
        this.index = scope.$index
        this.windows = scope.row
        this.status = scope.row.status
      }
    },
    dealComplain(scope) {
      this.$confirm('是否要处理该投诉?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$axios.put('/managerapi/custome/record/update?id='+scope.row.id
      ).then(res => {
        this.getComplainList();
        console.log(res)
         this.$message({
          type: 'success',
          message: '状态已更改为处理中，请及时处理'
        });
      })
      })
    },
    dealFinish(scope) {
      this.$confirm('是否已处理完该投诉?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$axios.put('/managerapi/custome/record/update?id='+scope.row.id
      ).then(res => {
        this.getComplainList();
        console.log(res)
         this.$message({
           
          type: 'success',
          message: '已处理完毕'
        });
      })
      })
    },
    returnMain(){
      this.getComplainList();
      this.isShow = 1
    },
    // 导出表格
    exportExcel() {
      this.exportDisable = true;
      let params = this.search
      params.startTime = this.valueTime[0]
      params.endTime = this.valueTime[1]
      this.$axios.get('/managerapi/custome/complaint/record/export', {
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
    // 分页
    handleSizeChange(val) {
      this.search.limit = val;
      this.getComplainList();
    },
    // 分页
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit;
      this.getComplainList();
    },
  },
  created(){
    this.getComplainList();
  },
  mounted() {
   
  }

};
