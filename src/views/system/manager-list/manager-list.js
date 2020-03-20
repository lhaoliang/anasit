export default {

    data() {
        return {
            loading: true,
            currentPage: 1,
            total: 0,
            showManager: false,
            formLabelWidth: '100px',
            search: {
                account: '',
                isActive: '',
                roleId: '',
                limit: 10,
                offset: 0,
                companyId: ''
            },
            roles: [{
                    id: 5,
                    name: '风味总监'
                },
                {
                    id: 6,
                    name: '风味经理'
                }
            ],
            status: [{
                    id: 1,
                    name: '已激活'
                },
                {
                    id: 0,
                    name: '未激活'
                }
            ],
            managerList: [{
                    id: 1,
                    account: 'turtle',
                    roleId: 6,
                    company: '江西分公司',
                    isActive: 1,
                },
                {
                    id: 2,
                    account: 'anasit',
                    roleId: 5,
                    company: '',
                    isActive: 0,
                }
            ],
            company: {},
            manager: {
                roleId: '',
                companyId: '',
                account: '',
                password: '',
                name: '',
                phone: ''
            },
            needCompany: true,
            isEdit: false,
            id: 0,
            roleId: 0,
            companyId: ''
        }
    },

    methods: {
        //获取个人信息
        getUserInfo() {
            this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
                this.roleId = res.datas.roleId;
                if (res.datas.roleId == 3) {
                    this.roles = [{
                            id: 6,
                            name: '风味经理'
                        }],
                        this.search.companyId = res.datas.companyId
                    this.manager.companyId = res.datas.companyId
                    this.companyId = res.datas.companyId
                    this.getData()

                } else {
                    this.getData()
                }
            })
        },
        // 添加管理员
        showManagerModal() {
            this.manager = {
                    roleId: '',
                    companyId: '',
                    account: '',
                    password: '',
                    name: '',
                    phone: ''
                },
                this.needCompany = true;
            this.showManager = true;
            this.isEdit = false;
        },
        showEditManager(scope) {

            this.manager = {
                roleId: scope.row.roleId,
                companyId: scope.row.companyId,
                account: scope.row.account,
                password: scope.row.password,
                name: scope.row.name,
                phone: scope.row.phone
            }
            this.id = scope.row.id;
            if (scope.row.roleId == 5) {
                this.needCompany = false;
            } else {
                this.needCompany = true;
            }
            this.isEdit = true;
            this.showManager = true;
        },
        addManager() {
            if (this.manager.roleId == '') {
                this.$message({
                    message: '请选择角色',
                    type: 'error'
                });
                return
            }
            if (this.manager.roleId == 5 && this.roleId == 3 && this.manager.companyId == '') {
                this.$message({
                    message: '请选择分公司',
                    type: 'error'
                });
                return
            }
            if (this.manager.account == '') {
                this.$message({
                    message: '请输入账号',
                    type: 'error'
                });
                return
            }
            if (this.manager.password == '') {
                this.$message({
                    message: '请输入密码',
                    type: 'error'
                });
                return
            }
            if (this.manager.name == '') {
                this.$message({
                    message: '请输入姓名',
                    type: 'error'
                });
                return
            }
            if (this.manager.phone == '') {
                this.$message({
                    message: '请输入手机号',
                    type: 'error'
                });
                return
            }
            let params = this.manager;
            params.companyId = this.manager.companyId
            this.$axios.post('/managerapi/custome/system/manager/add', params).then(res => {
                console.log(res);
                if (res.result) {
                    this.showManager = false;
                    this.getData();
                    this.$notify({
                        title: '提示',
                        message: res.message,
                        type: 'success'
                    })
                } else {
                    this.$notify({
                        title: '提示',
                        message: res.message,
                        type: 'error'
                    })
                }

            })
        },
        editManager(id) {
            if (this.manager.roleId == '') {
                this.$message({
                    message: '请选择角色',
                    type: 'error'
                });
                return
            }
            if (this.manager.roleId == 5 && this.roleId == 3 && this.manager.companyId == '') {
                this.$message({
                    message: '请选择分公司',
                    type: 'error'
                });
                return
            }
            if (this.manager.account == '') {
                this.$message({
                    message: '请输入账号',
                    type: 'error'
                });
                return
            }
            if (this.manager.password == '') {
                this.$message({
                    message: '请输入密码',
                    type: 'error'
                });
                return
            }
            if (this.manager.name == '') {
                this.$message({
                    message: '请输入姓名',
                    type: 'error'
                });
                return
            }
            if (this.manager.phone == '') {
                this.$message({
                    message: '请输入手机号',
                    type: 'error'
                });
                return
            }
            let params = this.manager;
            params.id = this.id;
            this.$axios.put('/managerapi/custome/system/manager/edit', params).then(res => {
                console.log(res);
                if (res.result) {
                    this.showManager = false;
                    this.getData();
                    this.$notify({
                        title: '提示',
                        message: res.message,
                        type: 'success'
                    })
                } else {
                    this.$notify({
                        title: '提示',
                        message: res.message,
                        type: 'error'
                    })
                }

            })
        },
        //删除/激活管理员
        updateMangerStatus(scope) {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$axios.delete('/managerapi/custome/system/manager/delete', {
                    params: {
                        id: scope,
                    }
                }).then((res) => {
                    this.$notify({
                        title: '提示',
                        message: res.message,
                        type: 'success'
                    })
                    this.getData();
                }).catch(() => {})

            })
        },
        //获取公司下拉
        getCompany() {
            this.$axios.get('/managerapi/custome/company/get').then(res => {
                this.company = res.datas;
            })
        },
        roleChange() {
            if (this.manager.roleId == 5) {
                this.needCompany = false;
            } else {
                this.needCompany = true;
            }

        },
        closeModal() {
            this.showManager = false;
        },
        getData() {
            this.loading = true;
            let params = this.search;
            // params.companyId = this.search.companyId
            this.$axios.get('/managerapi/custome/system/manager/get', {
                params
            }).then(res => {
                this.managerList = res.datas.rows;
                this.total = res.datas.total;
            })

        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.search.limit = val;
            this.getData();

        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            // console.log(val, this.currentPage);
            this.search.offset = (val - 1) * this.search.limit;
            this.getData();

        },
        onSubmitSearch() {
            // console.log(this.search);
            this.getData();
        },
        handleSelectionChange() {

        },

        // 重置
        onRest() {
            if (this.roleId != 3) {
                this.search = {
                        account: '',
                        isActive: '',
                        roleId: '',
                        limit: 10,
                        offset: 0
                    },
                    this.getData();
            } else {
                this.search = {
                        account: '',
                        isActive: '',
                        roleId: '',
                        limit: 10,
                        offset:0,
                        companyId: this.search.companyId
                    },
                    this.getData();
            }

        }
    },
    mounted() {
        // this.getData();
        this.getCompany();
    },
    created() {
        this.getUserInfo()


    }
};