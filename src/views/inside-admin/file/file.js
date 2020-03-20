import httpConfig from '../../../http.config';
export default {
    data() {
        return {
            server: process.env.VUE_APP_BASE_API,
            headers: httpConfig.getHeaders(),
            importLoading: false,
            exportDisable: false,
            loading: false,
            currentPage: 1,
            forCompanyId: '',
            title: true,
            id: 0,
            search: {
                limit: 10,
                offset: 0,
                keyWord: '',
                companyId: '',
                shopId: '',
                termId: ''
            },
            type: 'add',
            index: '',
            isShow: '1',
            total: 0,
            showDetail: false,
            formLabelWidth: '100px',
            termList: [],
            company: [],
            shopList: [],
            gateList: [],
            multipleSelection: [],
            restaurants: [],
            state: '',

            //档口列表
            termTwo: [
                {
                    value: '选项1',
                    label: '黄金糕'
                },
                {
                    value: '选项2',
                    label: '双皮奶'
                },
                {
                    value: '选项3',
                    label: '蚵仔煎'
                },
                {
                    value: '选项4',
                    label: '龙须面'
                },
                {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
            gateTwo: [
                {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
            gateType: [
                {
                    value: '1',
                    label: '风味'
                }
            ],
            branchTwo: [
                {
                    value: '2',
                    label: '北京烤鸭'
                }
            ],
            shopTwo: [
                {
                    value: '3',
                    label: '北京烤鸭'
                }
            ],
            gateProject: [],
            gateItemSort: [
                {
                    value: '1',
                    label: '风味'
                }
            ],
            windows: {
                termId: '',
                windowGenreId: '',
                projectGenreId: '',
                name: '',
                companyId: '',
                shopId: '',
                sn: '',
                projectId: '',
                cooperatorName: '',
                cooperatorIdno: '',
                cooperatorPhone: '',
                deposit: '',
                rental: '',
                waterEleRate: '',
                cleanRate: '',
                sanitationRate: '',
                shareMoney: '',
                otherMoney: ''
            },
            roleId: 0,
            productCatList: []
        };
    },

    methods: {
        //获取个人信息
        getUserInfo() {
            this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
                this.roleId = res.datas.roleId;
                if (res.datas.roleId == 3) {
                    this.search.companyId = this.$route.query.company || res.datas.companyId;
                    this.forCompanyId = res.datas.companyId;
                    this.getshopDown();
                }
                let params = {
                    companyId: this.$route.query.company || this.search.companyId
                };
                this.$axios
                    .get('/managerapi/custome/shop/get', {
                        params
                    })
                    .then(res => {
                        this.shopList = res.datas;
                        // this.search.shopId = this.$route.query.shop || res.datas[0].id
                        this.getGateList();
                    });
            });
        },
        getAddCompanyId(val) {
            this.forCompanyId = val;
            this.windows.shopId = '';
            this.getshopDown2();
        },
        //下拉门店筛选
        getCompanyId() {
            this.forCompanyId = this.$route.query.company || this.search.companyId;
            this.search.shopId = '';
            this.getshopDown();
        },

        text() {
            this.$axios.get('/managerapi/custome/data/statistics/project/genre/select').then(res => {
                this.productCatList = res.datas;
                //this.getProduct();
            });
        },
        test1(val) {
            console.log(val);
        },
        //门店下拉
        getshopDown() {
            let params = {
                companyId: this.$route.query.company || this.search.companyId || this.forCompanyId
            };
            this.$axios
                .get('/managerapi/custome/shop/get', {
                    params
                })
                .then(res => {
                    this.shopList = res.datas;
                    // this.search.shopId = res.datas[0].id
                });
        },
        getshopDown2() {
            let params = {
                companyId: this.forCompanyId
            };
            this.$axios
                .get('/managerapi/custome/shop/get', {
                    params
                })
                .then(res => {
                    this.shopList = res.datas;
                    // this.search.shopId = res.datas[0].id
                });
        },
        //学期下拉
        getTermDown() {
            this.$axios.get('/managerapi/custome/term/get').then(res => {
                this.termList = res.datas;
                if(this.$route.query.termId){
                    this.search.termId = this.$route.query.termId
                }else{
                    this.search.termId = res.datas[0].id;

                }
            });
        },
        //分公司下拉
        getCompanyDown() {
            this.$axios.get('/managerapi/custome/company/get').then(res => {
                this.company = res.datas;
                if (this.roleId != 3) {
                    this.search.companyId = this.$route.query.company || res.datas[0].id;
                    // this.forCompanyId = this.$route.query.company || res.datas[0].id
                    let params = {
                        companyId: res.datas[0].id
                    };
                    this.$axios
                        .get('/managerapi/custome/shop/get', {
                            params
                        })
                        .then(res => {
                            this.shopList = res.datas;
                            // this.search.shopId = this.$route.query.shop || res.datas[0].id
                        });
                }
            });
        },
        //获取表格数据
        getGateList() {
            let params = this.search;
            this.$axios.get('/managerapi/custome/window/list', { params }).then(res => {
                console.log(res);
                this.gateList = res.datas.rows;
                this.total = res.datas.total;
            });
        },
        // 分页
        handleSizeChange(val) {
            this.search.limit = val;
            this.getGateList();
        },
        // 分页
        handleCurrentChange(val) {
            this.search.offset = (val - 1) * this.search.limit;
            this.getGateList();
        },
        //删除公司
        toDel(scope) {
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios
                    .delete('/managerapi/custome/window/delete', {
                        params: {
                            id: scope
                        }
                    })
                    .then(res => {
                        this.$notify({
                            title: '删除成功',
                            message: `删除成功`,
                            type: 'success'
                        });
                        this.getGateList();
                    })
                    .catch(() => {});
            });
        },
        //搜索
        onSubmitSearch() {
            this.getGateList();
        },
        onRest() {
            if (this.roleId != 3) {
                this.$axios.get('/managerapi/custome/company/get').then(res => {
                    this.search = {
                        limit: 10,
                        offset: 0,
                        keyWord: '',
                        companyId: res.datas[0].id,
                        shopId: '',
                        termId: 3
                    };
                    this.getGateList();
                });
            } else {
                this.search = {
                    limit: 10,
                    offset: 0,
                    keyWord: '',
                    companyId: this.$route.query.company || this.search.companyId,
                    shopId: this.$route.query.shop || this.search.shopId,
                    termId: 3
                };
                this.getGateList();
            }
        },
        onAdd() {
            if (
                !this.windows.termId ||
                !this.windows.windowGenreId ||
                !this.windows.projectGenreId ||
                // || !this.windows.companyId
                !this.windows.shopId ||
                !this.windows.sn ||
                !this.windows.cooperatorName ||
                !this.windows.cooperatorIdno ||
                !this.windows.cooperatorPhone ||
                !this.windows.deposit ||
                !this.windows.rental
            ) {
                this.$message({
                    message: '输入的内容不能为空，请确认后再输入',
                    type: 'error'
                });
                return;
            }
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (reg.test(this.windows.cooperatorIdno) === false) {
                this.$message({
                    message: '请输入正确的身份证号码',
                    type: 'error'
                });
                return;
            }
            if (!/^1[3456789]\d{9}$/.test(this.windows.cooperatorPhone)) {
                this.$message({
                    message: '请输入正确的手机号码',
                    type: 'error'
                });
                return;
            }
            this.$axios
                .post('/managerapi/custome/window/add', {
                    termId: this.windows.termId,
                    windowGenreId: this.windows.windowGenreId,
                    projectGenreId: parseInt(this.windows.projectGenreId),
                    name: this.windows.name,
                    companyId: this.windows.companyId,
                    shopId: this.windows.shopId,
                    sn: this.windows.sn,
                    projectId: this.windows.projectId,
                    isActive: 1,
                    image: '',
                    // cooperatorId: 2,
                    cooperatorName: this.windows.cooperatorName,
                    cooperatorIdno: this.windows.cooperatorIdno,
                    cooperatorPhone: this.windows.cooperatorPhone,
                    deposit: this.windows.deposit,
                    rental: this.windows.rental,
                    waterEleRate: this.windows.waterEleRate,
                    cleanRate: this.windows.cleanRate,
                    sanitationRate: this.windows.sanitationRate,
                    shareMoney: this.windows.shareMoney,
                    otherMoney: this.windows.otherMoney
                })
                .then(res => {
                    this.$message({
                        message: '档口添加成功',
                        type: 'success'
                    });
                    this.isShow = 1;
                    this.getGateList();
                });
        },

        forGate(scope) {
            console.log(scope.$index);
            this.getProductType();
            this.isShow = '2';
            if (scope == 'add') {
                this.title = true;
                this.windows = {
                    termId: '',
                    windowGenreId: '',
                    projectGenreId: '',
                    name: '',
                    companyId: '',
                    shopId: '',
                    sn: '',
                    cooperatorName: '',
                    cooperatorIdno: '',
                    cooperatorPhone: '',
                    deposit: '',
                    rental: '',
                    waterEleRate: '',
                    cleanRate: '',
                    sanitationRate: '',
                    shareMoney: '',
                    otherMoney: ''
                };
                if (this.roleId === 3) {
                    this.windows.companyId = this.$route.query.company || this.search.companyId;
                }
                this.type = 'add';
            }
            if (scope.row) {
                this.type = 'edit';
                this.title = false;
                this.id = scope.row.id;
                this.windows = scope.row;
            }
        },
        onEdit() {
            if (
                !this.windows.termId ||
                !this.windows.windowGenreId ||
                !this.windows.projectGenreId ||
                !this.windows.companyId ||
                !this.windows.shopId ||
                !this.windows.sn ||
                !this.windows.cooperatorName ||
                !this.windows.cooperatorIdno ||
                !this.windows.cooperatorPhone ||
                !this.windows.deposit ||
                !this.windows.rental
            ) {
                this.$message({
                    message: '输入的内容不能为空，请确认后再输入',
                    type: 'error'
                });
                return;
            }
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (reg.test(this.windows.cooperatorIdno) === false) {
                this.$message({
                    message: '请输入正确的身份证号码',
                    type: 'error'
                });
                return;
            }
            if (!/^1[3456789]\d{9}$/.test(this.windows.cooperatorPhone)) {
                this.$message({
                    message: '请输入正确的手机号码',
                    type: 'error'
                });
                return;
            }
            this.$axios
                .put('/managerapi/custome/window/update', {
                    id: this.id,
                    termId: this.windows.termId,
                    windowGenreId: this.windows.windowGenreId,
                    projectGenreId: parseInt(this.windows.projectGenreId),
                    companyId: this.windows.companyId,
                    shopId: this.windows.shopId,
                    sn: this.windows.sn,
                    projectId: this.windows.projectId,
                    isActive: 1,
                    image: '',
                    cooperatorName: this.windows.cooperatorName,
                    cooperatorIdno: this.windows.cooperatorIdno,
                    cooperatorPhone: this.windows.cooperatorPhone,
                    deposit: this.windows.deposit,
                    rental: this.windows.rental,
                    waterEleRate: this.windows.waterEleRate + '',
                    cleanRate: this.windows.cleanRate + '',
                    sanitationRate: this.windows.sanitationRate + '',
                    shareMoney: this.windows.shareMoney,
                    otherMoney: this.windows.otherMoney
                })
                .then(res => {
                    if (res.result) {
                        this.$notify({
                            title: '档口信息修改成功',
                            message: `档口信息修改成功`,
                            type: 'success'
                        });
                        this.getGateList();
                    }
                });
            this.isShow = 1;
        },
        returnMain() {
            this.search.limit = 10;
            this.search.offset = 0;
            this.getGateList();
            this.isShow = 1;
        },
        //导入模板下载
        templateDownload() {
            window.location.href = this.server + 'export_template/档口档案导入模板.xls';
        },
        // 模板导入
        beforeExcelUpload(file) {
            // console.log(file.type)
            // this.importLoading = true;
            // const isExcel = file.type == 'application/vnd.ms-excel';
            // if (!isExcel) {
            //   this.$message.error('文件导入只能是xlsx格式!');
            //   this.importLoading = false;
            // }
            // return isExcel;
        },
        excelUploadSuccess(res, file) {
            if (res.result) {
                this.$message.success('导入成功');
                this.getGateList();
            } else {
                this.$message.success(res.message);
            }
            this.importLoading = false;

            console.log(res);
        },
        // 导出表格
        exportExcel() {
            this.exportDisable = true;
            let params = this.search;
            this.$axios
                .get('/managerapi/custome/window/export', {
                    params
                })
                .then(res => {
                    if (res.result) {
                        this.$message({
                            message: '导出成功',
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
                });
        },

        // 获取项目类型下拉
        getProductType() {
            this.$axios.get('/managerapi/custome/window/type/get').then(res => {
                this.gateType = res.datas;
                this.getProductCat();
            });
        },
        // 获取项目类型下拉
        getProductCat() {
            let params = {
                windowGenreId: this.windows.windowGenreId
            };
            this.$axios
                .get('/managerapi/custome/window/type/class/get', {
                    params
                })
                .then(res => {
                    this.gateItemSort = res.datas;
                    this.getProduct();
                });
        },
        // 获取项目类型下拉
        getProduct() {
            let params = {
                windowGenreId: this.windows.windowGenreId,
                projectGenreId: this.windows.projectGenreId
            };
            this.$axios
                .get('/managerapi/custome/window/projects/down', {
                    params
                })
                .then(res => {
                    this.gateProject = res.datas;
                });
        },
        typeChange() {
            this.windows.name = '';
            this.windows.projectGenreId = '';
            this.getProductCat();
        },
        catChange() {
            this.windows.name = '';
            this.getProduct();
        },
        productChange(val) {
            this.windows.projectId = val;
            this.getProduct();
        }
    },
    created() {
        this.search.companyId = this.$route.query.company || this.search.companyId;
        this.search.shopId = this.$route.query.shop || this.search.shopId;
        this.search.termId = this.$route.query.termId ;
        this.getUserInfo();
        this.getTermDown();
        this.text();
        this.getCompanyDown();
    },
    mounted() {



    }
};
