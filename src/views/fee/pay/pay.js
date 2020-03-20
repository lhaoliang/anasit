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
            companyId: '',
            type: 'add',
            isShow: '1',
            index: '',
            id: '',
            searchFee: {
                limit: 10,
                offset: 0,
                keyWord: '',
                companyId: '',
                shopId: '',
                yearMonth: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).length === 1 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
            },
            exportFee: {
                date: '',
                companyId: '',
                shopId: '',
                windowName: ''
            },
            searchList: {
                limit: 10,
                offset: 0,
                companyId: '',
                keyWord: '',
                isReported: '',
                yearMonth: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).length === 1 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
            },
            exportList: {
                keyWord: '',
                yearMonth: '',
                companyId: '',
                isReported: ''
            },
            activeName: 'first',
            total: 0,
            showDetail: false,
            avgScale: 0,
            formLabelWidth: '100px',

            tableData2: [
                {
                    id: '全部分店实收比例平均值',
                    gate: '20'
                }
            ],
            feeList: [],
            upList: [],
            multipleSelection: [],
            restaurants: [],
            state: '',

            shopList: [],
            company: [],
            //档口列表

            uptypeList: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: '1',
                    label: '已报'
                },
                {
                    value: '0',
                    label: '未报'
                }
            ],
            uptype: '全部',
            gateProject: [],
            branchTwo: [
                {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
            shopTwo: [
                {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ],
            roleId: 0,
            windows: {
                yearMonth: '',
                companyId: '',
                shopId: '',
                windowId: '',
                sn: '',
                cooperatorName: '',
                cooperatorIdno: '',
                cooperatorPhone: '',
                deposit: '',
                rental: '',
                turnover: '',
                waterEleMoney: '',
                cleanMoney: '',
                sanitationMoney: '',
                sharedMoney: '',
                otherMoney: '',
                rate: ''
            },
            ava: '',
            showInfo: false,
            depositAll: 0,
            turnoverAll: 0,
            rentalAll: 0,
            waterEleMoneyAll: 0,
            sanitationMoneyAll: 0, //卫生费
            sharedMoneyAll: 0,
            cleanMoneyAll: 0, //洗消费
            otherMoneyAll: 0 //其他
        };
    },

    methods: {
        getUserInfo() {
            this.loading = true;
            this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
                this.loading = false;
                this.roleId = res.datas.roleId;
                if (res.datas.roleId == 3) {
                    this.companyId = res.datas.companyId;
                    this.searchFee.companyId = res.datas.companyId;
                    this.searchList.companyId = res.datas.companyId;
                    this.windows.companyId = res.datas.companyId;
                    let params = {
                        companyId: res.datas.companyId
                    };
                    this.$axios
                        .get('/managerapi/custome/shop/get', {
                            params
                        })
                        .then(result => {
                            this.shopList = result.datas;
                            if (result.datas.length > 0) {
                                this.searchFee.shopId = result.datas[0].id || '';
                                this.getFeeList(this.hightLight);
                            } else {
                                this.getFeeList(this.hightLight);
                            }
                        });
                } else {
                    this.$axios.get('/managerapi/custome/company/get').then(rev => {
                        this.company = rev.datas;
                        this.companyId = rev.datas[0].id;
                        this.searchFee.companyId = rev.datas[0].id;
                        this.searchList.companyId = rev.datas[0].id;
                        this.windows.companyId = rev.datas[0].id;
                        let params = {
                            companyId: rev.datas[0].id
                        };
                        this.$axios
                            .get('/managerapi/custome/shop/get', {
                                params
                            })
                            .then(result => {
                                this.shopList = result.datas;
                                if (result.datas.length > 0) {
                                    this.searchFee.shopId = result.datas[0].id || '';
                                    this.getFeeList(this.hightLight);
                                } else {
                                    this.getFeeList(this.hightLight);
                                }
                            });
                    });
                }
            });
        },
        //选择框筛选
        getCompanyId(val) {
            this.companyId = this.searchFee.companyId;
            console.log(this.companyId);
            this.searchFee.shopId = '';
            if (val != 0) {
                this.getshopDown();
            }
        },
        getAddCompanyId(val) {
            this.companyId = val;
            // console.log(this.companyId)
            this.windows.shopId = '';
            this.getshopDown();
        },

        //设置颜色
        setClass(item) {
            let a = item.isbgc;
            let b = item.isOut;
            if (a && !b) {
                return 'lowavg';
            } else if (a && b) {
                return 'outandlow';
            } else if (!a && b) {
                return 'outbgc';
            }
        },
        //获取费用列表
        getFeeList(callback) {
            let params = this.searchFee;
            let year = params.yearMonth.substring(0,params.yearMonth.indexOf('-'));
            let month = params.yearMonth.substring(params.yearMonth.indexOf('-')+1).length==2?params.yearMonth.substring(params.yearMonth.indexOf('-')+1): '0'+params.yearMonth.substring(params.yearMonth.indexOf('-')+1)
            params.yearMonth = year + '-' + month
            
            this.$axios
                .get('/managerapi/custome/cost/actual/list', {
                    params
                })
                .then(res => {
                    console.log(res);
                    // this.ava = res.datas.averageRate
                    this.feeList = res.datas.rows;

                    this.depositAll = Number(res.datas.deposit);
                    this.turnoverAll = Number(res.datas.turnover);
                    this.rentalAll = Number(res.datas.rental);
                    this.waterEleMoneyAll = Number(res.datas.waterEleMoney);
                    this.cleanMoneyAll = Number(res.datas.cleanMoney);
                    this.sanitationMoneyAll = Number(res.datas.sanitationMoney);
                    this.sharedMoneyAll = Number(res.datas.sharedMoney);
                    this.otherMoneyAll = Number(res.datas.otherMoney);

                    this.ava = ((this.rentalAll + this.cleanMoneyAll + this.sanitationMoneyAll + this.sharedMoneyAll + this.otherMoneyAll) / this.turnoverAll) * 100;
                    this.ava = this.ava.toFixed(2);

                    this.total = res.datas.total;

                    callback && callback();
                    // this.feeList.forEach(element => {
                    //    element.rate =  (element.rate)*1
                    // });
                });
        },
        //获取未上报列表
        getUpList() {
            let params = this.searchList;
            this.$axios
                .get('/managerapi/custome/shop/no/report/list', {
                    params
                })
                .then(res => {
                    this.upList = res.datas.rows;
                });
        },

        //门店下拉
        getshopDown() {
            let params = {
                companyId: this.companyId
            };
            this.$axios
                .get('/managerapi/custome/shop/get', {
                    params
                })
                .then(res => {
                    this.shopList = res.datas;
                    this.windows.companyId = this.companyId;
                    this.searchFee.shopId = res.datas[0].id;
                });
        },
        getShopId() {
            this.getshopDown();
            this.getWindowList();
            
            this.windows.windowId = '';
            this.windows.sn = '';
            this.windows.cooperatorName = ''; 
            this.windows.cooperatorIdno = '';
            this.windows.cooperatorPhone = ''; 
            this.windows.deposit = '';
        },
        getWindowList() {
            if(!this.windows.yearMonth){
                this.$message({
                    message:'请选择月份',
                    type:'error'
                })
                return
            }
            let params = {
                yearMonth: this.windows.yearMonth
            };
            this.$axios.get('/managerapi/custome/term/month', { params }).then(res => {
                let params = {
                    shopId: this.windows.shopId,
                    termId: res.datas.id
                };
                this.$axios
                    .get('/managerapi/custome/cost/window/list', {
                        params
                    })
                    .then(res => {
                        this.gateProject = res.datas;
                        console.log(this.gateProject)
                    });
            });
        },
        getWindowInfo(val) {
            var res = this.gateProject.filter(item => {
                return val == item.id;
            })[0];
            console.log(res);
            this.windows.sn = res.sn;
            this.windows.cooperatorName = res.cooperatorName;
            this.windows.cooperatorIdno = res.cooperatorIdno;
            this.windows.cooperatorPhone = res.cooperatorPhone;
            this.windows.deposit = res.deposit;
        },
        //档口名称下拉
        getProduct() {
            this.$axios.get('/managerapi/custome/window/project/get').then(res => {
                this.gateProject = res.datas;
            });
        },

        // 分页
        handleSizeChange(val) {
            this.searchFee.limit = val;
            this.getFeeList(this.hightLight);
        },
        // 分页
        handleCurrentChange(val) {
            this.searchFee.offset = (val - 1) * this.searchFee.limit;
            this.getFeeList(this.hightLight);
        },
        handleClick(tab) {
            this.activeName = tab.name;
            this.getUpList();
        },
        onRestFee() {
            if (this.roleId != 3) {
                this.$axios.get('/managerapi/custome/company/get').then(rev => {
                    this.company = rev.datas;
                    let params = {
                        companyId: rev.datas[0].id
                    };
                    this.$axios
                        .get('/managerapi/custome/shop/get', {
                            params
                        })
                        .then(result => {
                            this.shopList = result.datas;
                            this.searchFee = {
                                limit: 10,
                                offset: 0,
                                keyWord: '',
                                companyId: rev.datas[0].id,
                                shopId: result.datas[0].id,
                                yearMonth: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).length === 1 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
                            };
                            this.getFeeList(this.hightLight);
                        });
                });
            } else {
                let params = {
                    companyId: this.searchFee.companyId
                };
                this.$axios
                    .get('/managerapi/custome/shop/get', {
                        params
                    })
                    .then(res => {
                        this.searchFee = {
                            limit: 10,
                            offset: 0,
                            keyWord: '',
                            companyId: this.searchFee.companyId,
                            shopId: res.datas[0].id,
                            yearMonth: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).length === 1 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
                        };
                        this.getFeeList(this.hightLight);
                    });
            }
        },
        onRestUp() {
            if (this.roleId != 3) {
                this.$axios.get('/managerapi/custome/company/get').then(rev => {
                    // this.company = rev.datas;
                    this.searchList = {
                        limit: 10,
                        offset: 0,
                        companyId: rev.datas[0].id,
                        keyWord: '',
                        yearMonth: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).length === 1 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
                    };
                    this.getUpList();
                });
            } else {
                this.searchList = {
                    limit: 10,
                    offset: 0,
                    companyId: this.searchFee.companyId,
                    keyWord: '',
                    yearMonth: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).length === 1 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
                };
                this.getUpList();
            }
        },
        onSearchFee() {
            this.getFeeList(this.hightLight);
        },
        onSearchList() {
            if(new Date(this.searchList.yearMonth).getTime()>new Date().getTime()){
                this.$message({
                    message:'选择时间不能大于当前时间',
                    type:'error'
                })
                return
            }
            this.getUpList();
        },
        output() {},

        forGate(type, scope) {
            this.isShow = '2';
            this.activeName = '3';
            if (type == 'add') {
                this.windows = {
                    yearMonth: '',
                    companyId: '',
                    shopId: '',
                    windowId: '',
                    sn: '',
                    cooperatorName: '',
                    cooperatorIdno: '',
                    cooperatorPhone: '',
                    deposit: '',
                    rental: '',
                    turnover: '',
                    waterEleMoney: '',
                    cleanMoney: '',
                    sanitationMoney: '',
                    sharedMoney: '',
                    otherMoney: '',
                    rate: ''
                };
                this.type = 'add';
            }
            if (type == 'detail') {
                this.type = 'detail';
                console.log(313);
                console.log(scope);
                this.$axios.get('/managerapi/custome/cost/actual/detail?id=' + scope.id).then(res => {
                    this.windows = res.datas;
                    this.getProduct();
                });
            }

            if (type == 'edit') {
                this.type = 'edit';
                console.log(scope);
                this.id = scope.id;
                this.$axios.get('/managerapi/custome/cost/actual/detail?id=' + scope.id).then(res => {
                    this.windows = res.datas;
                    this.windows.windowId = res.datas.windowId;
                    this.getWindowList();
                });
            }
        },
        onEdit() {
            if (
                !this.windows.yearMonth ||
                !this.windows.companyId ||
                !this.windows.shopId ||
                !this.windows.windowId ||
                !this.windows.sn ||
                !this.windows.turnover ||
                !this.windows.cooperatorName ||
                !this.windows.cooperatorIdno ||
                !this.windows.cooperatorPhone ||
                !this.windows.deposit ||
                !this.windows.rental ||
                !this.windows.waterEleMoney
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
                .put('/managerapi/custome/cost/actual/update', {
                    id: this.id,
                    yearMonth: this.windows.yearMonth,
                    companyId: this.windows.companyId,
                    shopId: this.windows.shopId,
                    windowId: this.windows.windowId,
                    sn: this.windows.sn,
                    cooperatorName: this.windows.cooperatorName,
                    cooperatorIdno: this.windows.cooperatorIdno,
                    cooperatorPhone: this.windows.cooperatorPhone,
                    deposit: this.windows.deposit + '',
                    rental: this.windows.rental + '',
                    turnover: this.windows.turnover,
                    waterEleMoney: this.windows.waterEleMoney + '',
                    cleanMoney: this.windows.cleanMoney + '',
                    sanitationMoney: this.windows.sanitationMoney + '',
                    sharedMoney: this.windows.sharedMoney + '',
                    otherMoney: this.windows.otherMoney + ''
                })
                .then(res => {
                    if (res.result) {
                        this.$notify({
                            title: '信息修改成功',
                            message: `信息修改成功`,
                            type: 'success'
                        });
                        this.getFeeList(this.hightLight);
                    }
                });
            this.activeName = 'first';
            this.isShow = 1;
        },

        onAdd() {
            if (
                !this.windows.yearMonth ||
                !this.windows.companyId ||
                !this.windows.shopId ||
                !this.windows.windowId ||
                !this.windows.sn ||
                !this.windows.turnover ||
                !this.windows.cooperatorName ||
                !this.windows.cooperatorIdno ||
                !this.windows.cooperatorPhone ||
                !this.windows.deposit ||
                !this.windows.rental ||
                !this.windows.waterEleMoney
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
                .post('/managerapi/custome/cost/actual/add', {
                    yearMonth: this.windows.yearMonth,
                    companyId: this.windows.companyId,
                    shopId: this.windows.shopId,
                    windowId: this.windows.windowId,
                    sn: this.windows.sn,
                    cooperatorName: this.windows.cooperatorName,
                    cooperatorIdno: this.windows.cooperatorIdno,
                    cooperatorPhone: this.windows.cooperatorPhone,
                    deposit: this.windows.deposit,
                    rental: this.windows.rental,
                    turnover: this.windows.turnover,
                    waterEleMoney: this.windows.waterEleMoney,
                    cleanMoney: this.windows.cleanMoney,
                    sanitationMoney: this.windows.sanitationMoney,
                    sharedMoney: this.windows.sharedMoney,
                    otherMoney: this.windows.otherMoney
                })
                .then(res => {
                    if (res.result) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.activeName = 'first';
                         this.getFeeList(this.hightLight);
                        this.isShow = 1;
                    } else {
                        this.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                });
        },

        delPay(id) {
            this.$confirm(`您将该条费用实收`, '是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {
                    id
                };
                this.$axios.delete('/managerapi/custome/cost/actual/delete', { params }).then(() => {
                    this.$notify({
                        title: '删除费用实收成功',
                        message: `删除费用实收成功`,
                        type: 'success'
                    });
                    this.getFeeList(this.hightLight);
                });
            });
        },
        //平均值
        AvgScales() {
            // let avg = 0;
            // let sum = 0;
            // console.log(this.feeList)
            // this.feeList.forEach(element => {
            //   console.log(element.rate)
            //   sum += element.rate;
            // });
            // avg = sum / this.feeList.length
            // this.avgScale = avg.toFixed(1)
        },
        /*  hightLight(){
        this.AvgScales()
        this.feeList.reduce((total,currentValue,currentIndex,arr)=> {
          if(currentValue.rate>this.avgScale){

            this.$refs.hightlight[currentIndex].style="text-align:center;background:red"
          }
        },0);
    },*/
        hightLight() {
            this.AvgScales();
            console.log(this.$refs);
            // this.$refs.forEach

            this.feeList.forEach((element, index, arr) => {
                let pos = element.rate.indexOf('%');
                console.log(element.rate);
                element.rate.substring(0, pos);
                console.log(element.rate);
                if (Number(element.rate) < Number(this.ava)) {
                    element.isbgc = true;
                    // this.$refs.hightlight[index].style="text-align:center;background:red"
                }
                console.log(Number(element.rate).toFixed(2));
                element.rate = Number(element.rate).toFixed(2) + '%';
            });
            /*   for(var i of this.feeList){
            console.log(3444)
            console.log(i)
            console.log(this.i.rate)

            if(this.i.rate>this.avgScale){
              this.$refs.hightlight[i].style="text-align:center;background:red"
            }
          }*/
        },
        toList() {
            this.activeName = 'first';
            this.isShow = 1;
            this.getFeeList(this.hightLight);
        },
        // 导入模板下载
        templateDownload() {
            window.location.href = this.server + 'export_template/费用实收导入模板.xls';
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
                this.getFeeList(this.hightLight);
            } else {
                this.$message.success(res.message);
            }
            this.importLoading = false;

            console.log(res);
        },

        // 导出表格
        exportExcelFee() {
            this.exportDisable = true;
            let params = this.exportFee;
            params.yearMonth = this.searchFee.yearMonth;
            params.companyId = this.searchFee.companyId;
            params.shopId = this.searchFee.shopId;
            params.windowName = this.searchFee.keyWord;
            this.$axios
                .get('/managerapi/custome/charge/window//export', {
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
        // 未上报列表导出
        exportExcelList() {
            this.exportDisable = true;
            let params = this.exportList;
            params.keyWord = this.searchList.keyWord;
            params.yearMonth = this.searchList.yearMonth;
            params.companyId = this.searchList.companyId;
            params.isReported = this.searchList.upType;
            this.$axios
                .get('/managerapi/custome/shop/no/plan/export', {
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
        }
    },
    computed: {
        Rate() {
            if (!this.windows.rental || !this.windows.cleanMoney || !this.windows.sanitationMoney || !this.windows.sharedMoney || !this.windows.otherMoney) {
                return 0 + '%';
            } else {
                return (
                    (
                        (((parseInt(this.windows.rental) +
                            parseInt(this.windows.cleanMoney) +
                            parseInt(this.windows.sanitationMoney) +
                            parseInt(this.windows.sharedMoney) +
                            parseInt(this.windows.otherMoney)) /
                            this.windows.turnover) *
                            10000) /
                        100
                    ).toFixed(2) + '%'
                );
            }
        }
    },
    created() {
        this.getUserInfo();

        // this.getshopDown();
        // this.getFeeList(this.hightLight);
        // this.getUpList();

        this.getProduct();
    },
    mounted() {
        // this.AvgScales();
        //this.hightLight();
    }
};
