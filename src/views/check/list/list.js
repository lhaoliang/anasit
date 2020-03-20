export default {

    data() {
        return {
            loading: false,
            currentPage: 1,
            total: 0,
            index: '',
            search: {
                status: '',
                companyId: '',
                limit: 10,
                offset: 0,
                keyWord: '',
            },
            title: '',
            showDetail: false,
            formLabelWidth: '100px',
            dialogVisible: false,
            options: [{
                    value: '0',
                    label: '禁用',
                },
                {
                    value: '1',
                    label: '启用',
                },
            ],
            tableData: [{
                    id: '1',
                    name: '总公司检查表',
                    applicate: '总公司',
                    total: '100',
                    score: '100',
                    status: '在用',
                    time: '2019-5-20'
                },
                {
                    id: '2',
                    name: '总公司检查表',
                    applicate: '总公司',
                    total: '100',
                    score: '100',
                    status: '在用',
                    time: '2019-5-20'
                },
            ],
            multipleSelection: [],
            type: '',
            restaurants: [],
            state: '',
            companyList: [],
            companyForm: {
                name: '总公司检查表',
                score: '100',
                companyId: 0
            },
            id: '',
            companyName: '',
            question: {
                select: ''
            },
            roleId: 0,
            accept: ''

        }
    },

    methods: {
        //获取个人信息
        getUserInfo() {
            this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
                this.roleId = res.datas.roleId;
                if (res.datas.roleId == 3) {
                    this.search.companyId = res.datas.companyId;
                    this.companyForm.companyId = res.datas.companyId;
                    this.accept = res.datas.company.name
                }
                this.getList();
                console.log(this.companyForm.companyId)
            })
        },
        //获取检查表数据
        getList() {
            this.loading = true
            let params = this.search
            this.$axios.get('/managerapi/custome/check/table/list', {
                params
            }).then((res) => {
                console.log("223", res)
                this.loading = false;
                this.tableData = res.datas.rows
                this.total = res.datas.total
            })

        },
        //获取分公司下拉
        getCompany() {
            this.companyForm.companyId = ''
            this.$axios.get('/managerapi/custome/company/get').then(res => {
                if (res.result) {
                    let obj = {
                        "id": 0,
                        "name": '全部分公司'
                    }
                    res.datas.unshift(obj)
                    // console.log(res.datas)
                    this.companyList = res.datas

                }
            })
        },
        cancel() {
            this.companyForm.name = '';
            this.companyForm.score = ''
            this.companyForm.companyId = ''
            this.showDetail = false
        },
        changeGood(value) {
            let choosenItem = this.companyList.filter(item => item.name === value)[0]
            this.companyForm.companyId = choosenItem.id
        },
        onSumbitUpdate() { //添加检查表
            this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
                if (res.datas.roleId == 3) {
                    this.$axios.post('/managerapi/custome/check/table/add', {
                        name: this.companyForm.name,
                        companyId: res.datas.companyId,
                        score: this.companyForm.score,
                    }).then(res => {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.showDetail = false
                        this.getList()
                    })
                } else {
                    this.$axios.post('/managerapi/custome/check/table/add', {
                        name: this.companyForm.name,
                        companyId: this.companyForm.companyId,
                        score: this.companyForm.score,
                    }).then(res => {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.showDetail = false
                        this.getList()
                    })
                }
            })


        },
        //删除公司
        toDel(index, rows) {
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',

            }).then(() => {
                rows.splice(index, 1)
                this.$message({
                    type: 'success',
                    message: '删除成功!',
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'

                });

            });


        },

        goShopList() {
            this.$router.push(
                '/inside-admin/shop'
            )
        },
        onSubmitSearch() {

        },
        // 构造多个参数的command
        commandValue(operation = '', id = '', status = '', row = {}) {
            return {
                "status": status,
                "id": id,
                "operation": operation,
                "row": row

            }
        },
        handleCommand(command, id, status, scope) {
            if (command.operation == -1) {
                console.log(command)
                // 修改订单
                this.showDetail = true;
                this.type = 'edit'
                this.title = 'edit'
                this.companyForm.companyId = command.row.companyId
                this.companyForm.name = command.row.name
                this.id = command.id
                this.companyForm.score = command.row.score
                this.companyName = command.row.companyName ? command.row.companyName : '全部分公司'
            } else if (command.operation == 0) {
                // 删除订单
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('/managerapi/custome/check/table/delete', {
                        params: {
                            id: command.id
                        }
                    }).then((res) => {
                        this.$notify({
                            title: '删除检查表成功',
                            message: `删除检查表成功`,
                            type: 'success'
                        });
                        this.getList();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            } else if (command.operation == 1) {
                this.$confirm('此操作将禁用检查表, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.put('/managerapi/custome/check/status/put', {
                        id: command.id
                    }).then((res) => {
                        this.$notify({
                            title: '禁用成功',
                            message: `禁用成功`,
                            type: 'success'
                        });
                        // this.deleteNow = false;
                        this.getList();
                    })
                })
            } else if (command.operation == 2) {
                this.$confirm('此操作启用检查表, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.put('/managerapi/custome/check/status/put', {
                        id: command.id
                    }).then((res) => {
                        this.$notify({
                            title: '启用成功',
                            message: `启用成功`,
                            type: 'success'
                        });
                        // this.deleteNow = false;
                        this.getList();
                    })
                })
            } else if (command.operation == 8) {

                this.$router.push({
                    path: '/check/item',
                    query: {
                        checkTableId: command.id,
                        companyId: command.row.companyId
                    }
                })
            } else if (command.operation == 7) {
                this.$router.push({
                    path: `/check/check-detail/${command.id}`
                })
                // this.dialogVisible = true
            }

            console.log(this.showDetail);
        },
        onSumbitEdit() {
            this.$axios.put('/managerapi/custome/check/table/update', {
                id: this.id,
                name: this.companyForm.name,
                companyId: this.companyForm.companyId,
                score: this.companyForm.score,
            }).then((res) => {
                if (res.result) {
                    this.$message.success("修改成功!");
                    this.companyForm.name = '';
                    this.companyForm.score = ''
                    this.companyName = ''
                    this.showDetail = false;
                    this.getList()
                }
            })
        },
        handleClose(done) {
            this.companyForm = {}
            this.dialogVisible = false
        },
        handleSelect(item) {},
        handleIconClick(ev) {},
        onRest() {
            if (this.roleId != 3) {
                this.state = '';
                this.search = {
                    status: '',
                    limit: 10,
                    offset: 0,
                    keyWord: '',
                };
            } else {
                this.state = '';
                this.search = {
                    status: '',
                    limit: 10,
                    offset: 0,
                    keyWord: '',
                    companyId: this.search.companyId
                };
            }

            this.getList();
        },
        handleSizeChange(val) {
            this.search.limit = val;
            this.getList();

        },
        handleCurrentChange(val) {
            this.search.offset = (val - 1) * this.search.limit;
            this.getList();

        },


        forBranch(scope) {
            this.showDetail = true;
            if (scope == 'add') {
                this.title = 'add';
                this.companyForm = {
                    branchName: '',
                    name: '',
                    phone: '',
                    account: '',
                    password: ''
                }
                this.type = 'add'
            }
            if (scope.row) {
                this.type = 'edit'
                this.title = 'edit'
                this.index = scope.$index
                this.companyForm = scope.row
            }
        },

        //分页
        handleSizeChange(val) {
            this.search.limit = val;
            this.getList()
        },
        // 分页
        handleCurrentChange(val) {
            this.search.offset = (val - 1) * this.search.limit;
            this.getList()
        },
    },

    mounted() {
        // this.restaurants = this.loadAll();
    },
    created() {
        this.getCompany()
        this.getUserInfo()
    },

};