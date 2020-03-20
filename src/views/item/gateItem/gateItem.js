import httpConfig from "../../../http.config";
export default {

  data() {
    return {
      server: process.env.VUE_APP_BASE_API,
      headers: httpConfig.getHeaders(),
      importLoading: false,
      exportDisable: false,
      loading: false,
      currentPage: 1,
      gateItemSearch: {
        limit: 10,
        offset: 0,
        keyWord: '',
        windowGenreId: '',
      },
      sortSearch: {
        limit: 10,
        offset: 0,
        keyWord: '',
        windowGenreId: '',
      },
      typeSearch: {
        limit: 10,
        offset: 0,
      },
      title: true,
      type: 'add',
      activeName: 'first',
      id: '',
      showItem: '1',
      total: 0,
      visible: false,
      showGate: false,
      showSort: false,
      showType: false,
      formLabelWidth: '100px',
      itemList: [],
      gateItemList: [],
      typeList: [],
      gateType: '全部',
      itemSortDown: [],
      itemTypeDown: [],
      forGateItem: {
        name: '',
        projectGenreId: '',
      },
      //档口项目分类
      sortList: [],
      forSortItem: {
        name: '',
        windowGenreId: '',
      },
      gateSortList: [],

      forGateType: {
        name: ''
      },
      projectTotal: 0,
      projectCurrentPage: 1,
      itemTotal: 0,
      itemCurrentPage: 1,
      typeTotal: 0,
      typeCurrentPage: 1,

    }

  },

  methods: {
    //档口类型下拉
    getTypeDown() {
      this.$axios.get('/managerapi/custome/window/type/get'
      ).then(res => {
        this.itemTypeDown = res.datas;
      })
    },
    //档口项目下拉
    getItemDown() {
      this.$axios.get('/managerapi/custome/window/get'
      ).then(res => {
        this.gateItemList = res.datas;
      })
    },
    //档口项目分类下拉
    getSortDown() {
      this.$axios.get('/managerapi/custome/window/type/class/get'
      ).then(res => {
        this.itemSortDown = res.datas;
      })
    },
    //获取档口项目列表
    getItemList() {
      this.loading = true;
      let params = this.gateItemSearch
      this.$axios.get('/managerapi/custome/window/project/list', { params }
      ).then(res => {
        console.log('33',res)
        this.itemList = res.datas.rows;
        this.projectTotal = res.datas.total;
      })
      this.loading = false;
    },
    //获取档口项目分类列表
    getSortList() {
      this.loading = true;
      let params = this.sortSearch
      this.$axios.get('/managerapi/custome/window/project/class/list', { params }
      ).then(res => {
        console.log('44',res)
        this.sortList = res.datas.rows;
        this.itemTotal = res.datas.total;
      })
      this.loading = false;
    },
    //获取档口类型列表
    getTypeList() {
      this.loading = true;
      let params = this.typeSearch
      this.$axios.get('/managerapi/custome/window/class/list', { params }
      ).then(res => {
        this.typeList = res.datas.rows;
        this.typeTotal = res.datas.total;
      })
      this.loading = false;
    },
 
    toDelGate(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/managerapi/custome/window/project/delete', {
          params: {
            id: scope,
          }
        }).then((res) => {
          this.$notify({
            title: '删除成功',
            message: `删除成功`,
            type: 'success'
          })
          this.getItemList();
        }).catch(() => { })
      })
    },
    toDelSort(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/managerapi/custome/window/project/class/delete', {
          params: {
            id: scope,
          }
        }).then((res) => {
          this.$notify({
            title: '删除成功',
            message: `删除成功`,
            type: 'success'
          })
          this.getSortList();
        }).catch(() => { })
      })
    },
    toDelType(scope) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$axios.delete('/managerapi/custome/window/class/delete', {
          params: {
            id: scope,
          }
        }).then((res) => {
          this.$notify({
            title: '删除成功',
            message: `删除成功`,
            type: 'success'
          })
          this.getTypeList();
        }).catch(() => { })
      })
    },
    handleClick(tab) {
      this.activeName = tab.name
    },

    onRestItem() {
      this.gateItemSearch = {
        limit: 10,
        offset: 0,
        keyWord: '',
        windowGenreId: '',
      },
        this.getItemList();
    },
    onRestSort() {
      this.sortSearch = {
        limit: 10,
        offset: 0,
        keyWord: '',
        windowGenreId: '',
      },
        this.getSortList();
    },
    searchItem() {
      this.getItemList();
    },
    onSortSearch() {
      this.getSortList();
    },
    // 增加编辑档口项目
    forGate(scope) {
      this.showGate = true;
      if (scope == 'add') {
        this.forGateItem = {}
        this.title = true;
        this.type = 'add'
      }
      if (scope.row) {
        this.type = 'edit'
        this.title = false
        this.id = scope.row.id
        this.forGateItem = {
          name: scope.row.name,
          projectGenreId: scope.row.projectGenreId,
        }
      }
    },
    onEditGate() {
      if (!this.forGateItem.name
        || !this.forGateItem.projectGenreId) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.put('/managerapi/custome/window/project/update', {
        id: this.id,
        name: this.forGateItem.name,
        projectGenreId: this.forGateItem.projectGenreId,
      }).then((res) => {
      
       
        if (res.result) {
          this.$notify({
            title: '档口项目修改成功',
            message: `档口项目信息修改成功`,
            type: 'success'
          })
        }
        this.getItemList();
        this.getItemDown();
      })
      this.showGate = false

    },
    onAddGate() {
      if (!this.forGateItem.name
        || !this.forGateItem.projectGenreId
      ) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.post('/managerapi/custome/window/project/add', {
        name: this.forGateItem.name,
        projectGenreId: this.forGateItem.projectGenreId,

      }).then(res => {
        this.$message({
          message: "档口项目添加成功",
          type: 'success'
        });
        this.getItemList();
        this.getItemDown();
        this.showGate = false
      })

    },
    // 增加编辑档口项目分类
    forSort(scope) {
      this.showSort = true;
      this.forSortItem = {}
      if (scope == 'add') {
        this.title = true;
        this.type = 'add'
      }
      if (scope.row) {
        this.type = 'edit'
        this.title = false
        this.id = scope.row.id
        this.forSortItem = {
          name: scope.row.name,
          windowGenreId: scope.row.windowGenreId,
        }
      }
    },
    onAddSort() {
      if (!this.forSortItem.name
        || !this.forSortItem.windowGenreId
      ) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.post('/managerapi/custome/window/project/class/add', {
        name: this.forSortItem.name,
        windowGenreId: this.forSortItem.windowGenreId,
        isActive: 1,
      }).then(res => {
        this.$message({
          message: "档口项目分类添加成功",
          type: 'success'
        });
        this.getSortList();
        this.getSortDown();
        this.showSort = false
      })

    },
    onEditSort() {
      if (!this.forSortItem.name
        || !this.forSortItem.windowGenreId) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.put('/managerapi/custome/window/project/class/update', {
        id: this.id,
        name: this.forSortItem.name,
        windowGenreId: this.forSortItem.windowGenreId,
        isActive: 1,
      }).then((res) => {
        if (res.result) {
          this.$notify({
            title: '档口项目分类修改成功',
            message: `档口项目分类修改成功`,
            type: 'success'
          })
          this.getSortList();
          this.getSortDown()
        }
      })
      this.showSort = false
    },

    //档口类型
    forType(scope) {
      this.showType = true;
      if (scope == 'add') {
        this.forGateType = {}
        this.title = true;
        this.type = 'add'
      }
      if (scope.row) {
        this.type = 'edit'
        this.title = false
        this.id = scope.row.id
        this.forGateType = {
          name: scope.row.name
        }
      }
    },
    onEditType() {
      if (!this.forGateType.name) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.put('/managerapi/custome/window/class/update', {
        id: this.id,
        name: this.forGateType.name,
        isActive: 1,
      }).then((res) => {
        if (res.result) {
          this.$notify({
            title: '项目类型修改成功',
            message: `项目类型修改成功`,
            type: 'success'
          })
          this.getTypeList();
          this.getTypeDown()
        }
      })
      this.showType = false

    },

    onAddType() {
      if (!this.forGateType.name) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      this.$axios.post('/managerapi/custome/window/class/add', {
        name: this.forGateType.name,
        isActive: 1,
      }).then(res => {
        this.$message({
          message: "项目类型添加成功",
          type: 'success'
        });
        this.getTypeList();
        this.getTypeDown();
        this.showType = false
      })
    },
    ItemCancel() {
      this.getItemList();
      this.showGate = false
    },
    sortCancel() {
      this.getSortList();
      this.showSort = false
    },
    typeCancel() {
      this.getTypeList()
      this.showType = false
    },
    // 导出档口项目表格
    exportExcel() {
      this.exportDisable = true;
      let params = this.gateItemSearch
      this.$axios.get('/managerapi/custome/window/project/export', {
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
    exportExcelSort() {
      this.exportDisable = true;
      let params = this.sortSearch
      this.$axios.get('/managerapi/custome/window/project/genre/export', {
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
    handleProjectSizeChange(val) {
      this.gateItemSearch.limit = val;
      this.getItemList();
    },
    // 分页
    handleProjectCurrentChange(val) {
      this.gateItemSearch.offset = (val - 1) * this.gateItemSearch.limit;
      this.getItemList();
    },

    // 分页
    handleItemSizeChange(val) {
      this.sortSearch.limit = val;
      this.getSortList();
    },
    // 分页
    handleItemCurrentChange(val) {
      this.sortSearch.offset = (val - 1) * this.sortSearch.limit;
      this.getSortList();
    },
    // 分页
    handleTypeSizeChange(val) {
      this.typeSearch.limit = val;
      this.getTypeList();
    },
    // 分页
    handleTypeCurrentChange(val) {
      this.typeSearch.offset = (val - 1) * this.typeSearch.limit;
      this.getTypeList();
    },
  },
  created() {
    this.getItemDown();
    this.getItemList();
    this.getSortDown();
    this.getSortList();
    this.getTypeDown();
    this.getTypeList();
  },
};
