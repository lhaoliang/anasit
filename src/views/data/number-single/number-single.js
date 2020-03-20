import httpConfig from '../../../http.config';
export default {
    data() {
        return {
            time: [],
            server: process.env.VUE_APP_BASE_API,
            headers: httpConfig.getHeaders(),
            exportDisable: false,
            statisSearch: {
                yearMonth: '',
                yearMonthTwo: '',
                companyId: '',
                shopId: '',
                windowGenreId: '',
                projectId: ''
            },
            loading: false,
            currentPage: 1,
            roleId: 0,
            date: '',
            activeName: '2',
            total: [],
            termList: [
                {
                    value: '选项1',
                    label: '2014年下学期'
                },
                {
                    value: '选项2',
                    label: '2015年下学期'
                }
            ],
            term: '2018年下学期',
            companyList: [],
            company: '江西分公司',
            shopList: [
                {
                    value: '选项1',
                    label: '高新店'
                },
                {
                    value: '选项2',
                    label: '与何明珠店'
                }
            ],
            shopId: '紫阳明珠店',
            //公司数值
            companyTotalActualMoney: '',
            companyTotalRate: '',
            companyTotalTurnover: '',
            companyNumerical: [],
            searchCompanyId: '',
            companyForm: {
                branchName: '江西分公司',
                name: '张三',
                phone: '13135613',
                account: 'josida',
                password: '123153'
            },
            tableData: [],
            itemTypeDown: [],
            termSelect: '201907',
            termSelectList: [
                {
                    value: 1,
                    label: '2019年下学期',
                    children: [
                        {
                            value: '201907',
                            label: '2019.7'
                        },
                        {
                            value: '201908',
                            label: '2019.8'
                        },
                        {
                            value: '201911',
                            label: '2019.11'
                        },
                        {
                            value: '201912',
                            label: '2019.12'
                        }
                    ]
                },
                {
                    value: 2,
                    label: '2019年上学期',
                    children: [
                        {
                            value: '201903',
                            label: '2019.3'
                        },
                        {
                            value: '201904',
                            label: '2019.4'
                        },
                        {
                            value: '201905',
                            label: '2019.5'
                        },
                        {
                            value: '201906',
                            label: '2019.6'
                        }
                    ]
                }
            ],
            //两个月比较
            monthCompareList: [],
            mouthOne: '',
            mouthTwo: '',
            genreList: [],
            genres: [],
            typeList: [
                {
                    value: 1,
                    label: '学期'
                },
                {
                    value: 2,
                    label: '月份'
                }
            ],
            typeValue: 1,
            winName: '',
            projectName: '',
            companyName: '',
            allCompany: '全部分公司',
            termName: '',
            itemCateId: '',
            gateItemSort: [],
            gateProject: [],
            termOne: '',
            termTwo: '',
            terms: [1]
        };
    },

    methods: {
        getWinName(val) {
            console.log(val);
            if (val == '') {
                this.itemCateId = '';
                this.statisSearch.projectId = '';
            } else {
                this.getProductCat();
                this.winName = this.itemTypeDown.filter(el => {
                    return val == el.id;
                })[0].name;
                this.itemCateId = '';
                this.statisSearch.projectId = '';
            }
            console.log(this.statisSearch.projectId, 555);
        },
        catChange() {
            this.statisSearch.projectId = '';
            this.getProduct();
        },
        getProjectName(val) {
            this.projectName = this.gateProject.filter(el => {
                return val == el.id;
            })[0].name;
        },
        getProductCat() {
            let params = {
                windowGenreId: this.statisSearch.windowGenreId
            };
            this.$axios
                .get('/managerapi/custome/window/type/class/get', {
                    params
                })
                .then(res => {
                    this.gateItemSort = res.datas;
                    this.itemCateId = res.datas[0].id;
                    this.getProduct();
                });
        },
        getProduct() {
            let params = {
                windowGenreId: this.statisSearch.windowGenreId,
                projectGenreId: this.itemCateId
            };
            this.$axios
                .get('/managerapi/custome/window/projects/down', {
                    params
                })
                .then(res => {
                    this.gateProject = res.datas;
                    this.statisSearch.projectId = res.datas[0].id;
                    this.getList();
                });
        },
        termChange(val) {
            if (val.length == 0) {
                this.$message({
                    message: '至少选择一个学期',
                    type: 'error'
                });
                return;
            }
            this.termOne = this.termList.filter(item => {
                return item.id == val[0];
            })[0].name;
            if (val.length == 2) {
                this.termTwo = this.termList.filter(item => {
                    return item.id == val[1];
                })[0].name;
            }
            this.terms = val;
            this.getList();
        },
        getUserInfo() {
            this.loading = true;
            this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
                this.loading = false;
                this.roleId = res.datas.roleId;
                if (res.datas.roleId == 3) {
                    this.statisSearch.companyId = res.datas.companyId;
                    this.companyName = res.datas.company.name;
                    let params = {
                        companyId: res.datas.companyId
                    };
                    this.$axios
                        .get('/managerapi/custome/shop/get', {
                            params
                        })
                        .then(res => {
                            this.shopList = res.datas;
                            this.getList();
                        });
                } else {
                    this.$axios.get('/managerapi/custome/company/get').then(res => {
                        this.companyList = res.datas;
                        this.statisSearch.companyId = res.datas[0].id;
                        let params = {
                            companyId: res.datas[0].id
                        };
                        this.$axios
                            .get('/managerapi/custome/shop/get', {
                                params
                            })
                            .then(res => {
                                this.shopList = res.datas;
                                this.getList();
                            });
                    });
                }
            });
        },
        changeType(val) {
            this.statisSearch.windowGenreId = '';
            if (this.roleId != 3) {
                this.statisSearch.companyId = '';
            }
            this.statisSearch.shopId = '';
            if (val == 1) {
                (this.time = []), (this.statisSearch.yearMonth = '');
                this.statisSearch.yearMonthTwo = '';
                // this.statisSearch.termId = 2
                // this.termName = this.termList.filter(el=>{
                //  return el.id == this.statisSearch.termId
                // })[0].name
                // this.getList()
            } else {
                this.terms = [];
            }
            console.log(this.terms);
        },
        // genreChange(val) {
        //   this.statisSearch.projectId = val[1]
        //   let wintype = this.genreList.filter(el=>{
        //     return (el.value == val[0])
        //   })
        //   let projectName = wintype[0].children.filter(j=>{
        //     return (j.value == val[1])
        //   })
        //   this.projectName = projectName[0].label
        // },

        timeChange(val) {
            this.mouthOne = val[0];
            this.mouthTwo = val[1];
        },
        //档口类型下拉
        getTypeDown() {
            this.$axios.get('/managerapi/custome/window/type/get').then(res => {
                this.itemTypeDown = res.datas;
            });
        },
        //档口类型、项目选择
        getGenreList() {
            this.$axios.get('/managerapi/custome/data/statistics/project/genre/select').then(res => {
                this.genreList = res.datas;
            });
        },
        getCompanyList(val) {
            this.statisSearch.shopId = '';
            if (val == '') {
                this.companyName = '全部分公司';
            }
            this.$axios.get('/managerapi/custome/company/get').then(res => {
                if (res.result) {
                    this.companyList = res.datas;
                    this.companyName = res.datas.filter(item => {
                        return item.id == this.statisSearch.companyId;
                    })[0].name;
                }
            });
            let params = {
                companyId: val
            };
            this.$axios
                .get('/managerapi/custome/shop/get', {
                    params
                })
                .then(res => {
                    this.shopList = res.datas;
                    this.getList();
                });
        },
        shopChange() {
            this.getList();
        },
        getTermList() {
            this.$axios.get('/managerapi/custome/term/get').then(res => {
                if (res.result) {
                    this.termList = res.datas;
                }
            });
        },
        getList() {
            this.loading = true;
            //分公司数值按单月统计
            if (this.time[0] == this.time[1] && this.terms && this.terms.length == 0 && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                if (params.yearMonth == params.yearMonthTwo) {
                    delete params.termId;
                    delete params.termIdTwo;
                    delete params.yearMonthTwo;

                    this.$axios
                        .get('/managerapi/custome/data/numerical/statistics/company/get', {
                            params
                        })
                        .then(res => {
                            this.loading = false;
                            if (res.result) {
                                // this.tableData = res.datas.companys;
                                this.tableData = res.datas.companys.filter(item => {
                                    return item.actualMoney != 0 || item.turnover != 0;
                                });
                                res.datas.companys.forEach(item => {
                                    item.actualMoney = Number(item.actualMoney).toFixed(2);
                                    item.turnover = Number(item.turnover).toFixed(2);
                                    item.rate = Number(item.rate).toFixed(2);
                                });
                                res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                                res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                                res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);

                                this.total = res.datas.total;
                            }
                        });
                }
            }
            //两个月分公司数值统计
            if (this.time && this.time[0] != this.time[1] && this.terms.length == 0 && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                delete params.termId;
                this.$axios
                    .get('/managerapi/custome/data/numerical/statistics/company/month/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            this.tableData = res.datas.companys.filter(item => {
                                return item.actualMoneyOne != 0 || item.actualMoneyTwo != 0 || item.turnoverOne != 0 || item.turnoverTwo != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.actualMoneyOne = Number(item.actualMoneyOne).toFixed(2);
                                item.actualMoneyTwo = Number(item.actualMoneyTwo).toFixed(2);
                                item.turnoverOne = Number(item.turnoverOne).toFixed(2);
                                item.turnoverTwo = Number(item.turnoverTwo).toFixed(2);
                                item.rate = Number(item.rate).toFixed(2);
                                item.rateTwo = Number(item.rateTwo).toFixed(2);
                            });
                            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                            res.datas.total.totalTurnoverTwo = Number(res.datas.total.totalTurnoverTwo).toFixed(2);
                            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                            res.datas.total.totalActualMoneyTwo = Number(res.datas.total.totalActualMoneyTwo).toFixed(2);
                            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                            res.datas.total.totalRateTwo = Number(res.datas.total.totalRateTwo).toFixed(2);

                            this.total = res.datas.total;
                        }
                    });
            }
            //分公司数值按周期统计
            if (this.time.length == 0 && this.terms.length == 1 && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.termId = this.terms[0];
                this.$axios
                    .get('/managerapi/custome/data/numerical/statistics/company/term/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            this.tableData = res.datas.companys.filter(item => {
                                return item.turnover != 0 || item.actualMoney != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.actualMoney = Number(item.actualMoney).toFixed(2);
                                item.turnover = Number(item.turnover).toFixed(2);
                                item.rate = Number(item.rate).toFixed(2);
                            });
                            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                            this.total = res.datas.total;
                        }
                    });
            }
            //分公司数值按两周期统计
            if (this.time.length == 0 && this.terms.length == 2 && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.termId = this.terms[0];
                params.termIdTwo = this.terms[1];
                this.$axios
                    .get('/managerapi/custome/data/numerical/statistics/company/two/term/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            this.tableData = res.datas.companys.filter(item => {
                                return item.actualMoneyOne != 0 || item.actualMoneyTwo != 0 || item.turnoverOne != 0 || item.turnoverTwo != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.actualMoneyOne = Number(item.actualMoneyOne).toFixed(2);
                                item.actualMoneyTwo = Number(item.actualMoneyTwo).toFixed(2);
                                item.turnoverOne = Number(item.turnoverOne).toFixed(2);
                                item.turnoverTwo = Number(item.turnoverTwo).toFixed(2);
                                item.rateOne = Number(item.rateOne).toFixed(2);
                                item.rateTwo = Number(item.rateTwo).toFixed(2);
                            });
                            res.datas.total.totalTurnoverOne = Number(res.datas.total.totalTurnoverOne).toFixed(2);
                            res.datas.total.totalTurnoverTwo = Number(res.datas.total.totalTurnoverTwo).toFixed(2);
                            res.datas.total.totalActualMoneyOne = Number(res.datas.total.totalActualMoneyOne).toFixed(2);
                            res.datas.total.totalActualMoneyTwo = Number(res.datas.total.totalActualMoneyTwo).toFixed(2);
                            res.datas.total.totalRateOne = Number(res.datas.total.totalRateOne).toFixed(2);
                            res.datas.total.totalRateTwo = Number(res.datas.total.totalRateTwo).toFixed(2);
                            this.total = res.datas.total;
                        }
                    });
            }

            //单月分公司门店数值统计
            if (this.time && this.time[0] == this.time[1] && this.terms.length == 0 && this.statisSearch.companyId > 0 && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                if (params.yearMonth == params.yearMonthTwo) {
                    delete params.yearMonthTwo;
                    delete params.termId;
                    this.$axios
                        .get('/managerapi/custome/data/numerical/statistics/company/shop/get', {
                            params
                        })
                        .then(res => {
                            this.loading = false;
                            if (res.result) {
                                this.tableData = res.datas.companys.filter(item => {
                                    return item.turnover != 0 || item.actualMoney != 0;
                                });
                                res.datas.companys.forEach(item => {
                                    item.turnover = Number(item.turnover).toFixed(2);
                                    item.actualMoney = Number(item.actualMoney).toFixed(2);
                                    item.rate = Number(item.rate).toFixed(2);
                                });
                                res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                                res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                                res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                                this.total = res.datas.total;
                            }
                        });
                }
            }
            //单周期分公司门店数值统计
            if (this.time.length == 0 && this.terms.length == 1 && this.statisSearch.companyId > 0 && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.termId = this.terms[0];
                this.$axios
                    .get('/managerapi/custome/data/term/statistics/company/shop/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            this.tableData = res.datas.companys.filter(item => {
                                return item.turnover != 0 || item.actualMoney != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.turnover = Number(item.turnover).toFixed(2);
                                item.actualMoney = Number(item.actualMoney).toFixed(2);
                                item.rate = Number(item.rate).toFixed(2);
                            });
                            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                            this.total = res.datas.total;
                        }
                    });
            }

            //两个月分公司门店数值统计
            if (this.time && this.time[0] != this.time[1] && this.terms.length == 0 && this.statisSearch.companyId > 0 && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];

                this.$axios
                    .get('/managerapi/custome/data/numerical/statistics/company/shop/month/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            this.tableData = res.datas.companys.filter(item => {
                                return item.actualMoney != 0 || item.actualMoneyTwo != 0 || item.turnover != 0 || item.turnoverTwo != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.turnover = Number(item.turnover).toFixed(2);
                                item.turnoverTwo = Number(item.turnoverTwo).toFixed(2);
                                item.actualMoney = Number(item.actualMoney).toFixed(2);
                                item.actualMoneyTwo = Number(item.actualMoneyTwo).toFixed(2);
                                item.rate = Number(item.rate).toFixed(2);
                                item.rateTwo = Number(item.rateTwo).toFixed(2);
                            });
                            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                            res.datas.total.totalActualMoneyTwo = Number(res.datas.total.totalActualMoneyTwo).toFixed(2);
                            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                            res.datas.total.totalTurnoverTwo = Number(res.datas.total.totalTurnoverTwo).toFixed(2);
                            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                            res.datas.total.totalRateTwo = Number(res.datas.total.totalRateTwo).toFixed(2);
                            this.total = res.datas.total;
                        }
                    });
            }
            //两个周期分公司门店数值统计
            if (this.time.length == 0 && this.terms.length == 2 && this.statisSearch.companyId > 0 && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.termId = this.terms[0];
                params.termIdTwo = this.terms[1];

                this.$axios
                    .get('/managerapi/custome/data/numerical/statistics/company/shop/term/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            this.tableData = res.datas.companys.filter(item => {
                                return item.actualMoney != 0 || item.actualMoneyTwo != 0 || item.turnover != 0 || item.turnoverTwo != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.turnover = Number(item.turnover).toFixed(2);
                                item.turnoverTwo = Number(item.turnoverTwo).toFixed(2);
                                item.actualMoney = Number(item.actualMoney).toFixed(2);
                                item.actualMoneyTwo = Number(item.actualMoneyTwo).toFixed(2);
                                item.rate = Number(item.rate).toFixed(2);
                                item.rateTwo = Number(item.rateTwo).toFixed(2);
                            });
                            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                            res.datas.total.totalActualMoneyTwo = Number(res.datas.total.totalActualMoneyTwo).toFixed(2);
                            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                            res.datas.total.totalTurnoverTwo = Number(res.datas.total.totalTurnoverTwo).toFixed(2);
                            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                            res.datas.total.totalRateTwo = Number(res.datas.total.totalRateTwo).toFixed(2);
                            this.total = res.datas.total;
                        }
                    });
            }

            //单个门店单月数值统计
            if (this.time && this.time[0] == this.time[1] && this.terms.length == 0 && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                if (params.yearMonth == params.yearMonthTwo) {
                    delete params.yearMonthTwo;
                    this.$axios
                        .get('/managerapi/custome/data/numerical/statistics/company/single/shop/get', {
                            params
                        })
                        .then(res => {
                            this.loading = false;
                            if (res.result) {
                                this.tableData = res.datas.companys.filter(item => {
                                    return item.turnover != 0 || item.actualMoney != 0;
                                });
                                res.datas.companys.forEach(item => {
                                    item.turnover = Number(item.turnover).toFixed(2);
                                    item.actualMoney = Number(item.actualMoney).toFixed(2);
                                    item.rate = Number(item.rate).toFixed(2);
                                });
                                res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                                res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                                res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                                this.total = res.datas.total;
                            }
                        });
                }
            }
            //单个门店单周期数值统计
            if (this.time.length == 0 && this.terms.length == 1 && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
                let params = this.statisSearch;
                params.termId = this.terms[0];

                this.$axios
                    .get('/managerapi/custome/data/term/statistics/company/single/shop/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            // this.tableData = res.datas.companys;
                            this.tableData = res.datas.companys.filter(item => {
                                return item.turnover != 0 || item.actualMoney != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.turnover = Number(item.turnover).toFixed(2);
                                item.actualMoney = Number(item.actualMoney).toFixed(2);
                                item.rate = Number(item.rate).toFixed(2);
                            });
                            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                            this.total = res.datas.total;
                        }
                    });
            }

            //单个门店两个月数值统计
            if (this.time && this.time[0] != this.time[1] && this.terms.length == 0 && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];

                this.$axios
                    .get('/managerapi/custome/data/numerical/statistics/company/single/shop/month/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            this.tableData = res.datas.companys.filter(item => {
                                return item.actualMoney != 0 || item.actualMoneyTwo != 0 || item.turnover != 0 || item.turnoverTwo != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.turnover = Number(item.turnover).toFixed(2);
                                item.turnoverTwo = Number(item.turnoverTwo).toFixed(2);
                                item.actualMoney = Number(item.actualMoney).toFixed(2);
                                item.actualMoneyTwo = Number(item.actualMoneyTwo).toFixed(2);
                                item.rate = Number(item.rate).toFixed(2);
                                item.rateTwo = Number(item.rateTwo).toFixed(2);
                            });
                            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                            res.datas.total.totalActualMoneyTwo = Number(res.datas.total.totalActualMoneyTwo).toFixed(2);
                            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                            res.datas.total.totalTurnoverTwo = Number(res.datas.total.totalTurnoverTwo).toFixed(2);
                            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                            res.datas.total.totalRateTwo = Number(res.datas.total.totalRateTwo).toFixed(2);
                            this.total = res.datas.total;
                        }
                    });
            }
            //单个门店两个周期数值统计
            if (this.time.length == 0 && this.terms.length == 2 && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
                let params = this.statisSearch;
                params.termId = this.terms[0];
                params.termIdTwo = this.terms[1];

                this.$axios
                    .get('/managerapi/custome/data/numerical/statistics/area/double/term/get', {
                        params
                    })
                    .then(res => {
                        this.loading = false;
                        if (res.result) {
                            this.tableData = res.datas.companys.filter(item => {
                                return item.actualMoney != 0 || item.actualMoneyTwo != 0 || item.turnover != 0 || item.turnoverTwo != 0;
                            });
                            res.datas.companys.forEach(item => {
                                item.turnover = Number(item.turnover).toFixed(2);
                                item.turnoverTwo = Number(item.turnoverTwo).toFixed(2);
                                item.actualMoney = Number(item.actualMoney).toFixed(2);
                                item.actualMoneyTwo = Number(item.actualMoneyTwo).toFixed(2);
                                item.rate = Number(item.rate).toFixed(2);
                                item.rateTwo = Number(item.rateTwo).toFixed(2);
                            });
                            res.datas.total.totalActualMoney = Number(res.datas.total.totalActualMoney).toFixed(2);
                            res.datas.total.totalActualMoneyTwo = Number(res.datas.total.totalActualMoneyTwo).toFixed(2);
                            res.datas.total.totalTurnover = Number(res.datas.total.totalTurnover).toFixed(2);
                            res.datas.total.totalTurnoverTwo = Number(res.datas.total.totalTurnoverTwo).toFixed(2);
                            res.datas.total.totalRate = Number(res.datas.total.totalRate).toFixed(2);
                            res.datas.total.totalRateTwo = Number(res.datas.total.totalRateTwo).toFixed(2);
                            this.total = res.datas.total;
                        }
                    });
            }
        },
        handleClick(tab) {
            if (tab.name == 1) {
                this.$router.push('/data/number');
            }
            if (tab.name == 2) {
                this.$router.push('/data/number-single');
            }
            if (tab.name == 3) {
                this.$router.push('/data/number-area');
            }
        },
        onRest() {
            this.statisSearch.shopId = '';
            this.statisSearch.windowGenreId = '';
            if(this.roleId !=3){
                this.statisSearch.companyId = '';
            }
            this.getUserInfo();
            this.activeName = '2';
            // this.getList()
        },
        // 导出表格
        exportExcel() {
            if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
                this.exportDisable = true;
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                if (params.yearMonth == params.yearMonthTwo) {
                    delete params.yearMonthTwo;
                    this.$axios
                        .get('/managerapi/custome/company/numerical/value/export', {
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
            }
            //单月全部门店
            if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId > 0 && this.statisSearch.shopId == '') {
                this.exportDisable = true;
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                if (params.yearMonth == params.yearMonthTwo) {
                    delete params.yearMonthTwo;
                    this.$axios
                        .get('/managerapi/custome/shop/numerical/value/export', {
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
            }
            //单月单个门店
            if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
                this.exportDisable = true;
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                if (params.yearMonth == params.yearMonthTwo) {
                    delete params.yearMonthTwo;
                    this.$axios
                        .get('/managerapi/custome/window/numerical/value/export', {
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
            }
            //两个月分公司数值比较
            if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                this.$axios
                    .get('/managerapi/custome/company/two/numerical/value/export', {
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
            //两个月分公司门店
            if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId > 0 && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                this.$axios
                    .get('/managerapi/custome/shop/two/numerical/value/export', {
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
            //两个月单个门店
            if (this.time && this.statisSearch.termId == '' && this.statisSearch.companyId > 0 && this.statisSearch.shopId > 0) {
                let params = this.statisSearch;
                params.yearMonth = this.time[0];
                params.yearMonthTwo = this.time[1];
                this.$axios
                    .get('/managerapi/custome/window/two/numerical/value/export', {
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
            //分公司数值按周期统计
            if (this.time.length == 0 && this.statisSearch.termId > 0 && this.statisSearch.companyId == '' && this.statisSearch.shopId == '') {
                let params = this.statisSearch;
                this.$axios
                    .get('/managerapi/custome/company/term/numerical/statics/export', {
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
        }
    },
    created() {
        this.getTermList();
        this.getTypeDown();
        this.getGenreList();
        this.getUserInfo();
    },

    mounted() {}
};
