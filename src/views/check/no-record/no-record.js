import httpConfig from "../../../http.config";
export default {

    data() {
        return {
            importLoading: false,
            exportDisable: false,
            companySelect: '1',
            date: '2019-08',
            date2: '2019',
            search: {
                limit: 10,
                offset: 0,
                companyId: 1
            },
            currentPage: 1,
            showDetail: false,
            saleDetail: false,
            formLabelWidth: '120px',
            serviceOptions: [],
            total: 0,

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
            activeName: '3',
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
            if (tab.name == 1) {
                this.$router.push(
                    '/check/record'
                )
            }
            if (tab.name == 2) {
                this.$router.push(
                    '/check/total-record'
                )
            }
            if (tab.name == 3) {
                this.$router.push(
                    '/check/no-record'
                )
            }
            this.getList()
        },
        // 获取表单列表
        getList() {
            this.loading = true;
            let params = this.search;
            params.month = this.date
            if (this.companySelect == 1) {
                this.$axios.get('/managerapi/custome/grade/table/uncheck/shop/list', {
                    params
                }).then(res => {
                    this.loading = false;
                    if (res.result) {
                        this.tableData = res.datas.shops;
                        this.total = res.datas.total;
                    }
                });
            }
            if (this.companySelect == 2) {
                params.month = this.date2
                delete params.companyId
                this.$axios.get('/managerapi/custome/grade/table/uncheck/company/list', {
                    params
                }).then(res => {
                    this.loading = false;
                    if (res.result) {
                        this.tableData = res.datas.companys;
                        this.total = res.datas.total;
                    }
                });
            }

        },
        // 重制属性
        onRest() {
            this.companySelect = '1',
                this.date = '2019-08',
                this.search = {
                    limit: 10,
                    offset: 0,
                    companyId: 1
                },
                this.activeName = '3'
            this.getList()
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