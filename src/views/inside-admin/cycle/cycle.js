export default {

  data() {
    return {
      currentPage: 1,
      total: 0,
      search: {
        offset: 0,
        limit: 10,
        keyWord: '',
      },
      showDetail: false,
      showCycle: false,
      formLabelWidth: '100px',
      index: '',
      id: '1',
      termList: [],
      multipleSelection: [],
      restaurants: [],
      companyForm: {
        name: '',
        time: '',
      },
      addItem: {
        name: '',
        time: []
      },


    }
  },

  methods: {
    //获取表格数据
    getTermList() {
      let params = this.search
      this.$axios.get('/managerapi/custome/term/list', { params }
      ).then(res => {
        console.log(111)
        console.log(res);
        this.termList = res.datas.rows;
        this.total = res.datas.total;
      })
    },
    // 分页
    handleSizeChange(val) {
      this.search.limit = val;
      this.getTermList();
    },
    // 分页
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit;
      this.getTermList();
    },
    goGateList() {
      this.$router.push(
        '/inside-admin/file'
      )
    },
    //搜索
    onSubmitSearch() {

      this.getTermList();
    },
    //重置
    onRest() {
      this.search = {
        offset: 0,
        limit: 10,
        keyWord: '',
      },
        this.getTermList();

    },
    loadAll() {
      return this.termList
    },
    //删除公司
    toDel(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/managerapi/custome/term/delete', {
          params: {
            id: scope,
          }
        }).then((res) => {
          this.$notify({
            title: '删除成功',
            message: `删除成功`,
            type: 'success'
          })
          this.getTermList();
        }).catch(() => { })

      })
    },
    //添加公司
    addCycle() {
      this.showDetail = true;
      companyForm = {
        name: '',
        time: '',
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    /*   toShowDetail(index, row) {
            console.log(row)
             this.title=false;
             this.showDetail = true;
             this.companyForm = row;
             this.companyForm.branchName=row.branchName
             // console.log(this.companyForm);
         },*/
    toEdit(scope) {
      console.log(scope)
      this.id = scope.row.id
      this.addItem = {
        name: scope.row.name,
        time: [scope.row.startDate, scope.row.endDate]
      }
      this.showCycle = true;
    },
    onEdit() {
      if (!this.addItem.name
        || !this.addItem.time
      ) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.put('/managerapi/custome/term/update', {
        id: this.id + "",
        name: this.addItem.name,
        startDate: this.addItem.time[0],
        endDate: this.addItem.time[1],
      }).then((res) => {
        if (res.result) {
          this.$notify({
            title: '周期信息修改成功',
            message: `周期信息修改成功`,
            type: 'success'
          })
          this.getTermList();
          this.showCycle = false;

        }
      })

    },
    onAdd() {
      if (!this.companyForm.name
        || !this.companyForm.time) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.post('/managerapi/custome/term/add', {
        name: this.companyForm.name,
        startDate: this.companyForm.time[0],
        endDate: this.companyForm.time[1],
      }).then(res => {
        this.$message({
          message: "添加周期成功",
          type: 'success'
        });
        this.showDetail = false
        this.getTermList()
      })
    },
    onSumbitUpdate() {
      if (!this.addItem.cycleName
        || !this.addItem.time) {
        this.$notify({
          title: '请完善要修改的信息',
          message: '请检查是否完善修改信息，完善要修改的信息',
          type: 'warning'
        });
        return
      }
      this.tableData[this.index].cycleName = this.addItem.cycleName
      this.tableData[this.index].time = this.addItem.time
      this.showCycle = false
    },
    returnMain() {
      this.getTermList();
      this.showCycle = false
    },
  },
  created() {
    this.getTermList();
  },
  mounted() {
    this.restaurants = this.loadAll();

  }

};