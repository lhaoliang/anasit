export default {

    data() {
        return {
            loading: false,
            currentPage: 1,
            title: true,
            total: 0,
            id: 0,
            index: '',
            search: {
                limit: 10,
                offset: 0,
                keyWord: ''
            },
            showDetail: false,
            formLabelWidth: '100px',
            options: [{
                    value: '0',
                    label: '禁用',
                },
                {
                    value: '1',
                    label: '启用',
                },
            ],
            preDetail: false,
            form: {
                title: '',
                total: '',
                itemList: [{
                    content: '123'
                }, {
                    content: "124"
                }]
            },
            tableData: [{
                    id: '1',
                    name: '总公司检查表',
                    applicate: '10',
                    total: '100',
                    score: '100',
                    status: '在用',
                    time: '2019-5-20'
                },
                {
                    id: '2',
                    name: '总公司检查表',
                    applicate: '10',
                    total: '100',
                    score: '100',
                    status: '在用',
                    time: '2019-5-20'
                },
            ],
            multipleSelection: [],
            type: '',
            dialogVisible: false,
            restaurants: [],
            state: '',

            companyForm: {
                name: '',
            },
            question: {
                select: ''
            }

        }
    },

    methods: {
        getList() {
            this.loading = true
            let params = this.search
            params.checkTableId = this.$route.query.checkTableId
            this.$axios.get('/managerapi/custome/check/subject/list', {
                params
            }).then((res) => {
                this.loading = false;
                this.tableData = res.datas.rows
                this.total = res.datas.total
            })
        },
        onSumbitUpdate() {
            this.$axios.post('/managerapi/custome/check/subject/add', {
                name: this.companyForm.name,
                checkTableId: this.$route.query.checkTableId
            }).then(res => {
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.showDetail = false
                this.getList()
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
        //添加公司
        /* addBranch(){
        this.showDetail = true;
    
      },*/
        goShopList() {
            this.$router.push(
                '/inside-admin/shop'
            )
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
        handleSelect() {

        },
        handleIconClick() {

        },
        handleCommand(command) {
            if (command.operation == -1) {
                // 修改订单
                this.id = command.id
                this.companyForm.name = command.row.name
                this.type = 'edit'
                this.title = 'edit'
                this.showDetail = true;

            } else if (command.operation == 0) {
                // 删除订单
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('/managerapi/custome/check/subject/delete', {
                        params: {
                            id: command.id
                        }
                    }).then((res) => {
                        this.$notify({
                            title: '删除检查项分类成功',
                            message: `删除检查项分类成功`,
                            type: 'success'
                        });
                        // this.deleteNow = false;
                        this.getList();
                    })
                })
            } else if (command.operation == 1) {
                // 删除订单
                this.$confirm('此操作将启用, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.put('/managerapi/custome/check/subject/status/put', {
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
            } else if (command.operation == 2) {
                // 删除订单
                this.$confirm('此操作将禁用, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.put('/managerapi/custome/check/subject/status/put', {
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
            } else if (command.operation == 5) {
                console.log(command)
                this.$router.push({
                    path: '/check/add-item',
                    query: {
                        checkTableId: command.row.checkTableId,
                        companyId: this.$route.query.companyId,
                        checkSubjectId: command.id,
                        cateName: command.row.name
                    }
                })
            } else if (command.operation == 6) {
                // this.preDetail = true;
                this.$router.push('/check/item-detail')

            }
            console.log(command);

            console.log(this.showDetail);
        },
        preClose() {
            this.preDetail = false;
        },
        handleClose() {
            this.dialogVisible = false
        },
        onRest() {
            this.search = {
                    limit: 10,
                    offset: 0,
                    keyWord: ''
                },
                this.companyForm = {}
            this.getList()
        },
        addRowsFirst(index) {
            var obj = {
                content: '',
                seq: index
            }
            this.form.itemList.push(obj)
        },
        delItem(i) {
            this.form.itemList.splice(i, 1)
        },
        up(index, row) {
            if (index === 0) {
                this.$message({
                    message: '已经是列表中第一个素材！',
                    type: 'warning'
                })
            } else {
                let temp = this.form.itemList[index - 1]
                this.$set(this.form.itemList, index - 1, this.form.itemList[index])
                this.$set(this.form.itemList, index, temp)
            }

        },
        down(index, row) {
            if (index === (this.form.itemList.length - 1)) {
                this.$message({
                    message: '已经是列表中最后一个素材！',
                    type: 'warning'
                })
            } else {
                let i = this.form.itemList[index + 1]
                this.$set(this.form.itemList, index + 1, this.form.itemList[index])
                this.$set(this.form.itemList, index, i)
            }

        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.search.limit = val;

        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            // console.log(val, this.currentPage);
            this.search.offset = (val - 1) * this.search.limit;

        },
        onSumbitEdit() {
            this.$axios.put('/managerapi/custome/check/subject/update', {
                id: this.id,
                name: this.companyForm.name,
                checkTableId: this.$route.query.checkTableId
            }).then((res) => {
                if (res.result) {
                    this.$message.success("修改成功!");
                    this.companyForm.name = ''
                    this.showDetail = false;
                    this.getList()
                }
            })
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
        back() {
            this.$router.push('/check/list')
        }
    },

    mounted() {

    },
    created() {

        this.getList()
    },

};