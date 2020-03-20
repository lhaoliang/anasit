export default {

    data() {
        return {
            loading: false,
            currentPage: 1,
            limit: 10,
            offset: 0,
            id: 0,
            title: true,
            total: 0,
            index: '',
            search: {
                status: ''
            },
            type: 'add',
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
                    score: '',
                    content: '',
                    id: 0
                }],
            },
            totalScore:0,
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
            cateName: '',
            multipleSelection: [],
            type: '',
            dialogVisible: false,
            restaurants: [],
            state: '',

            companyForm: {
                name: '总公司检查表',
            },
            question: {
                select: ''
            },
            itemList: []

        }
    },

    methods: {
        toUp(index, row, list) {
            this.$confirm('此操作将上移, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var arr = []
                var sort1 = list[index].sort
                var sort2 = list[index - 1].sort
                console.log(sort1, sort2)

                var t;
                t = sort1;
                sort1 = sort2;
                sort2 = t;
                console.log(sort1, sort2)
                list[index].sort = sort1
                list[index - 1].sort = sort2
                var obj1 = {}
                var obj2 = {}
                obj1.id = list[index].id
                obj1.sort = sort1
                obj2.id = list[index - 1].id
                obj2.sort = sort2
                arr.push(obj1)
                arr.push(obj2)
                console.log(arr)
                this.$axios.put('/managerapi/custome/check/item/sort/update', {
                    jsonInfo: JSON.stringify(arr)
                }).then((res) => {
                    this.$notify({
                        title: '上移成功',
                        message: `上移成功`,
                        type: 'success'
                    });
                    // this.deleteNow = false;
                    this.getItemList();
                })
            })
        },
        toTop(row) {
            var arr = []
            var obj = {}
            obj.id = row.id
            obj.sort = 0
            arr.push(obj)

            this.$confirm('此操作将置顶, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.put('/managerapi/custome/check/item/sort/update', {
                    jsonInfo: JSON.stringify(arr)
                }).then((res) => {
                    this.$notify({
                        title: '置顶成功',
                        message: `置顶成功`,
                        type: 'success'
                    });
                    // this.deleteNow = false;
                    this.getItemList();
                })
            })
        },
        getItemList() {
            let params = {
                checkSubjectId: this.$route.query.checkSubjectId,
                checkTableId: this.$route.query.checkTableId,
                companyId: this.$route.query.companyId,
            }
            this.$axios.get('/managerapi/custome/check/item/list', {
                params
            }).then((res) => {
                this.itemList = res.datas
            })
        },
        addItem() {
            let info = JSON.stringify(this.form.itemList)
            let count = 0;
            let dis = 0;
            this.form.itemList.forEach( item=>{
                if(!item.content||!item.score){
                    count++
                }
                if(item.score < 0){
                    dis++
                }
            })
            if(this.form.total < 0){
                this.$message({
                    message: '检查项满分不能小于0',
                });
                return
            }
            if(dis>0){
                this.$message({
                    message: '检查项分数不能小于0',
                });
                return
            }
            if (!this.form.title || !this.form.total || !info || count>0) {
                this.$message({
                    message: '请填写完整检查项信息',
                });
                return
            } else {
                this.$axios.post('/managerapi/custome/check/item/add', {
                    checkSubjectId: this.$route.query.checkSubjectId,
                    checkTableId: this.$route.query.checkTableId,
                    companyId: this.$route.query.companyId,
                    title: this.form.title,
                    score: this.form.total,
                    jsonInfo: info
                }).then(res => {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.form = {
                            title: '',
                            total: '',
                            itemList: [{
                                content: '',
                                score: '',
                                sort: ''
                            }]
                        },
                        this.dialogVisible = false
                    this.getItemList()
                })
            }

        },
        cancle() {
            this.form = {
                    title: '',
                    total: '',
                    itemList: [{
                        content: '',
                        score: '',
                        sort: ''
                    }]
                },
                this.dialogVisible = false
        },
        editItem() {
            this.$axios.put('/managerapi/custome/check/item/update', {
                checkSubjectId: this.$route.query.checkSubjectId,
                checkTableId: this.$route.query.checkTableId,
                companyId: this.$route.query.companyId,
                id: this.id,
                title: this.form.title,
                sort: this.form.sort,
                score: this.form.total,
                jsonInfo: JSON.stringify(this.form.itemList),
            }).then(res => {
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                });
                this.form = {
                        title: '',
                        total: '',
                        itemList: [{
                            content: '',
                            score: '',
                            sort: ''
                        }]
                    },
                    this.dialogVisible = false
                this.getItemList()
            })
        },
        toDown(index, row, list) {
            this.$confirm('此操作将下移, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var arr = []
                var sort1 = list[index].sort
                var sort2 = list[index + 1].sort
                console.log(sort1, sort2)

                var t;
                t = sort1;
                sort1 = sort2;
                sort2 = t;
                console.log(sort1, sort2)
                list[index].sort = sort1
                list[index + 1].sort = sort2
                var obj1 = {}
                var obj2 = {}
                obj1.id = list[index].id
                obj1.sort = sort1
                obj2.id = list[index - 1].id
                obj2.sort = sort2
                arr.push(obj1)
                arr.push(obj2)
                console.log(arr)
                this.$axios.put('/managerapi/custome/check/item/sort/update', {
                    jsonInfo: JSON.stringify(arr)
                }).then((res) => {
                    this.$notify({
                        title: '下移成功',
                        message: `下移成功`,
                        type: 'success'
                    });
                    // this.deleteNow = false;
                    this.getItemList();
                })
            })
        },
        edit(item) {
            console.log(item)
            var options = []
            item.option.forEach(item => {
                delete item['checkItemId']
                delete item['createdAt']
                delete item['isActive']
                delete item['updatedAt']
                //   delete item['sort']
                options.push({
                    'id': item.id,
                    "content": item.content,
                    'score': item.score,
                    'sort': item.sort
                })
            })
            this.type = 'edit'
            this.form.title = item.title
            this.id = item.id
            this.form.sort = item.sort
            this.form.total = item.score
            this.form.itemList = options
            this.dialogVisible = true

        },
        show() {
            this.type = 'add'

            this.dialogVisible = true
        },
        del(item) {
            console.log(item)
            let params = {
                id: item.id
            }
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',

            }).then(() => {
                this.$axios.delete('/managerapi/custome/check/item/delete', {
                    params
                }).then(res => {
                    if (res.result) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getItemList()
                    }

                })
            })
        },
        turn() {
            this.$router.push({
                path: '/check/item',
                query: {
                    checkTableId: this.$route.query.checkTableId,
                    companyId: this.$route.query.companyId,
                }
            })
        },
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
        handleSelect() {

        },
        handleIconClick() {

        },
        handleCommand(command) {
            if (command.operation == -1) {
                // 修改订单
                console.log(1);
                this.type = 'edit'
                this.title = 'edit'
                this.companyForm = command.row
                this.showDetail = true;

            } else if (command.operation == 0) {
                // 删除订单
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('/managerapi/store/order/delete', {
                        params: {
                            id: command.id
                        }
                    }).then((res) => {
                        this.$notify({
                            title: '删除订单成功',
                            message: `删除订单成功，成功删除ID：${command.id}的订单`,
                            type: 'success'
                        });
                        // this.deleteNow = false;
                        this.getOrderList();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            } else if (command.operation == 2) {
                // 删除订单
                this.$confirm('此操作将禁用, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('/managerapi/store/order/delete', {
                        params: {
                            id: command.id
                        }
                    }).then((res) => {
                        this.$notify({
                            title: '删除订单成功',
                            message: `删除订单成功，成功删除ID：${command.id}的订单`,
                            type: 'success'
                        });
                        // this.deleteNow = false;
                        this.getOrderList();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            } else if (command.operation == 1) {
                // 确认发货
                this.showSendGoods = true;
                this.SendGoodsId = command.id;
                this.orderSn = command.row.sn;
                this.logisticsCompany = command.row.logisticsCompany;
                this.logisticsNumber = command.row.waybillNo;


            } else if (command.operation == 2) {
                this.logisticsCompany = command.row.logisticsCompany;
                this.logisticsNumber = command.row.waybillNo;
                // 确认收货
                this.$confirm('是否确认收货, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.put('/managerapi/store/order/status/update', {
                        id: command.id,
                        logisticsCompany: this.logisticsCompany,
                        waybillNo: this.logisticsNumber,
                        status: 4
                    }).then((res) => {
                        this.$notify({
                            title: '确认收货成功',
                            message: `确认收货成功，成功确认收货ID：${command.id}的订单`,
                            type: 'success'
                        });
                        // this.deleteNow = false;
                        this.getOrderList();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });

            } else if (command.operation == 3) {
                this.refundStatus = command.status
                this.refundId = command.id
                this.showAdvice = true
                let params = {
                    id: command.id
                }
                this.$axios.get('/managerapi/store/order/refund/detail', {
                    params
                }).then(res => {
                    if (res.result) {
                        this.refundDetail = res.datas
                    }
                })
            } else if (command.operation == 5) {
                this.$router.push('/check/add-item')
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
            this.form = {
                    title: '',
                    total: '',
                    itemList: [{
                        content: '',
                        score: '',
                        sort: ''
                    }]
                },
                this.dialogVisible = false
        },
        onRest() {
            this.state = ''
        },
        addRowsFirst(index) {
            console.log(index)
            this.form.itemList[0].sort = 0
            var obj = {
                content: '',
                score: '',
                sort: index + 1,
                id: 0
            }
            this.form.itemList.push(obj)
            console.log(this.form.itemList)
        },
        delItem(i) {
            this.form.itemList.splice(i, 1)
        },
        up(index, row, list) {
            console.log(index)
            var sort1 = list[index].sort
            var sort2 = list[index - 1].sort
            console.log(sort1, sort2)

            var t;
            t = sort1;
            sort1 = sort2;
            sort2 = t;
            console.log(sort1, sort2)
            list[index].sort = sort1
            list[index - 1].sort = sort2
            console.log(this.form.itemList)
            // row.sort -=1 
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
        down(index, row, list) {
            console.log(index)
            var sort1 = list[index].sort
            var sort2 = list[index + 1].sort
            console.log(sort1, sort2)

            var t;
            t = sort1;
            sort1 = sort2;
            sort2 = t;
            console.log(sort1, sort2)
            list[index].sort = sort1
            list[index + 1].sort = sort2
            console.log(this.form.itemList)


            // list[index].sort +=1
            // console.log(row)
            // row.sort+=1
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
        getTableDetail(){
            let params = {
                limit:10,
                offset:0,
                companyId:this.$route.query.companyId
            }
            this.$axios.get('/managerapi/custome/check/table/list',{params}).then(res=>{
                this.totalScore = res.datas.rows[0].score
            })
        }
    },

    mounted() {

    },
    created() {
        this.getItemList()
    
        this.cateName = this.$route.query.cateName
        
    },

};