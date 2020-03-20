import httpConfig from "../../../http.config";
export default {

    data() {
        return {
            importLoading: false,
            exportDisable: false,
            companyType: '0',
            date: [],
            date2: [],
            search: {
                limit: 10,
                offset: 0,
                keyWord: '',
                startTime: '',
                endTime: '',
                type: 0,
                companyId: ''
            },
            question: {
                select: ''
            },
            currentPage: 1,
            showDetail: false,
            saleDetail: false,
            formLabelWidth: '120px',
            serviceOptions: [],
            total: 0,
            value: '',
            tableData: [{
                id: 1,
                storeName: '紫阳明珠店',
                companyName: '江西分公司',
                name: '张三',
                score: '100',
                time: '2018-10-25',
            }, {
                id: 2,
                storeName: '紫阳明珠店',
                companyName: '江西分公司',
                name: '张三',
                score: '100',
                time: '2018-10-25',
            }],
            time: [],
            time2: '',
            id: '',
            dialogVisible: false,
            goods: {
                goodsId: '',
                price: '',
                numPerUser: '',
                title: '',
                subTitle: '',
                stock: '',
                serviceNote: [],
                isAvailable: 0,
                startTime: '',
                endTime: '',
                coverImg: '',
                value: '',
                discount: '',
                deposit: '',
                ficti: '',
            },
            options: [{
                    value: '0',
                    label: '分公司检查',
                },
                {
                    value: '1',
                    label: '总部检查',
                },
            ],
            // 批量设置相关
            isSetListShow: true,
            loading: false,
            server: process.env.VUE_APP_BASE_API,
            headers: httpConfig.getHeaders(),
            importLoading: false,
            exportDisable: false,
            activeName: '1',
            companyList: [],
            roleId: 0
        }
    },

    methods: {
        //获取个人信息
        getUserInfo() {
            this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
                this.roleId = res.datas.roleId;
                if (this.roleId == 3) {
                    this.search.companyId = res.datas.companyId;
                }

                this.getList();
            })
        },
        handleClose(done) {
            this.dialogVisible = false
        },
        handleClick(tab) {
            this.search.type = tab.name
            this.companyType = tab.name
            if(tab.name==1){
                this.$router.push(
                    '/check/record'
                )
            }
            if(tab.name==2){
                this.$router.push(
                    '/check/total-record'
                )
            }
            if(tab.name==3){
                this.$router.push(
                    '/check/no-record'
                )
            }
            this.getList()
        },
        // 获取表单列表
        getList() {
            this.loading = true;
            if (this.search.type == 0) {
                this.search.type = 1;
            }
            let params = this.search;
            if (this.date) {
                params.startTime = this.date[0];
                params.endTime = this.date[1];
            }
            this.$axios.get('/managerapi/custome/grade/table/list', {
                params
            }).then(res => {
                this.loading = false;
                if (res.result) {
                    this.tableData = res.datas.rows;
                    this.total = res.datas.total;
                }
            });
        },
        // 设置商品下拉菜单选中的id
        changeGood(value) {
            let choosenItem = this.goodsList.filter(item => item.goodsName === value)[0]
            this.goods.goodsId = choosenItem.id
        },
        // 操作按钮
        openEdit(scope) {
            if (scope.operation == 5) {
                this.$router.push({
                    path: `/check/record-detail/${scope.id}`
                })
            }


        },
        // 重制属性
        onRest() {
            this.search = {
                    limit: 10,
                    offset: 0,
                    title: '',
                    isAvailable: -1
                },
                this.date = []
            this.time2 = ''
            this.time = [];
            this.activeName = '1'
            this.getList()
        },

        // 传递操作数据的对象
        commandValue(operation = '', id = '', goods = '') {
            return {
                "operation": operation,
                "id": id,
                "goods": goods
            }
        },
        // 分页
        handleSizeChange(val) {
            this.search.limit = val;

            this.getList();
        },
        // 分页
        handleCurrentChange(val) {
            this.search.offset = (val - 1) * this.search.limit;
            this.getList();
        },
        getCompanyList() {
            this.$axios.get('/managerapi/custome/company/get').then(res => {
                if (res.result) {
                    this.companyList = res.datas
                }
            })
        },
        // 导出表格分公司
        exportExcel() {
            this.exportDisable = true;
            if (this.companyType == '1') {
                var params = this.search
                params.type = 1
                console.log('11', params)
            } else if (this.companyType == '2') {
                var params = this.search
                params.type = 2
                console.log('22', params)
            }
            this.$axios.get('/managerapi/custome/grade/item/export', {
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

    },
    mounted() {

    },
    created() {
        this.getUserInfo()
        this.getCompanyList()
    },
    computed: {

    }
};