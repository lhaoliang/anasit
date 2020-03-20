export default {

  data() {
    return {
      loading: false,
      currentPage: 1,
      title: true,
      total: 0,
      id: '',
      search: {
        offset: 0,
        limit: 10,
        keyWord: '',
      },
      index: '',
      showDetail: false,
      formLabelWidth: '100px',
      branchList: [],
      multipleSelection: [],
      type: '',

      companyForm: {
        name: '',
        manager: '',
        phone: '',
        account: '',
        password: ''
      },
    }
  },

  methods: {
    //获取表格数据
    getBranchList() {
      let params = this.search
      this.$axios.get('/managerapi/custome/company/list', { params }
      ).then(res => {
        this.branchList = res.datas.rows;
        this.total = res.datas.total;
      })
    },
    // 分页
    handleSizeChange(val) {
      this.search.limit = val;
      this.getBranchList();
    },
    // 分页
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit;
      this.getBranchList();
    },
    //删除公司
    toDel(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/managerapi/custome/company/delete', {
          params: {
            id: scope,
          }
        }).then((res) => {
          this.$notify({
            title: '删除成功',
            message: `删除成功`,
            type: 'success'
          })
          this.getBranchList();
        }).catch(() => { })
      })
    },
    goShopList(scope) {
      console.log(scope)
      this.$router.push(
        { path: '/inside-admin/shop', query: { keyWord: scope } }
      )
    },

    onRest() {
      this.search = {
        limit: 10,
        offset: 0,
        keyWord: '',
      };
      this.getBranchList();
    },
    onEdit() {
      if (!this.companyForm.name
        || !this.companyForm.manager
        || !this.companyForm.phone
        || !this.companyForm.account
        || !this.companyForm.password) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      if(!(/^1[3456789]\d{9}$/.test(this.companyForm.phone))){ 
        this.$message({
          message: '请输入正确的手机号码',
          type: 'error'
        });
        return
      } 
      this.$axios.put('/managerapi/custome/company/update', {
        id: this.id,
        name: this.companyForm.name,
        manager: this.companyForm.manager,
        phone: this.companyForm.phone,
        account: this.companyForm.account,
        password: this.companyForm.password,
      }).then((res) => {
        if (res.result) {
          this.$notify({
            title: '分公司信息修改成功',
            message: `分公司信息修改成功`,
            type: 'success'
          })
          this.getBranchList();
          this.showDetail = false;

        }
      })

    },
    onAdd() {
      if (!this.companyForm.name
        || !this.companyForm.manager
        || !this.companyForm.phone
        || !this.companyForm.account
        || !this.companyForm.password) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      if(!(/^1[3456789]\d{9}$/.test(this.companyForm.phone))){ 
        this.$message({
          message: '请输入正确的手机号码',
          type: 'error'
        });
        return
      } 
      this.$axios.post('/managerapi/custome/company/add', {
        name: this.companyForm.name,
        manager: this.companyForm.manager,
        phone: this.companyForm.phone,
        account: this.companyForm.account,
        password: this.companyForm.password,
      }).then(res => {
        this.$message({
          message: "分公司信息添加成功",
          type: 'success'
        });
        this.showDetail = false
        this.getBranchList()
      })


    },
    onSubmitSearch() {
      // console.log(this.search);
      this.getBranchList();
    },
    forBranch(scope) {
      this.showDetail = true;
      if (scope == 'add') {
        this.title = true;
        this.companyForm = {
          name: '',
          manager: '',
          phone: '',
          account: '',
          password: ''
        }
        this.type = 'add'
      }
      if (scope.row) {
        console.log(scope)
        this.type = 'edit'
        this.title = false
        this.id = scope.row.id
        this.companyForm = {
          name: scope.row.name,
          manager: scope.row.manager,
          phone: scope.row.phone,
          account: scope.row.user.account,
          password: scope.row.user.realPassowrd
        }
      }
    },
    returnMain() {
      this.getBranchList();
      this.showDetail = false
    }

  },
  created() {
    this.getBranchList();
  },

};