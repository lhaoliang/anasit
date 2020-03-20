export default {

    data() {
        return {
            loading: false,
            currentPage: 1,
            limit: 10,
            offset: 0,
            title:true,
            total: 0,
            index:'',
            search:{
              status:''
            },
            showDetail: false,
            formLabelWidth: '100px',
            dialogVisible:false,
            options: [
              {
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
                name:'总公司检查表',
                applicate:'总公司',
                total:'100',
                score:'100',
                status:'在用',
                time:'2019-5-20'
            }, 
            {
              id: '2',
              name:'总公司检查表',
              applicate:'总公司',
              total:'100',
              score:'100',
              status:'在用',
              time:'2019-5-20'
          }, 
          ],
            multipleSelection: [],
            type:'',
            restaurants: [],
            state: '',
      
            companyForm:{
                name:'总公司检查表',
                applicate:'总公司',
                score:'100',
            },
            question:{
                select:''
            }
           
        }
    },

    methods: {
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
      goShopList(){
        this.$router.push(
          '/inside-admin/shop'
        )
      },
      onSubmitSearch(){

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
      handleCommand(command,id,status,scope) {
        if (command.operation == -1) {
            // 修改订单
            this.showDetail = true;
            this.type = 'edit'
            this.title= 'edit'
            this.companyForm = command.row
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
        } else if (command.operation == 1) {
            this.$confirm('此操作将永久禁用, 是否继续?', '提示', {
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


        }else if(command.operation == 8){
            this.$router.push(
                '/check/item'
              )
        }
        else if(command.operation == 7){
            this.dialogVisible = true
        }
        else {
            // 订单详情
            if (this.search.status == 0) {
                this.showDetail = true;
                // this.receiptDetail[0].message = command.consignee;
                // this.receiptDetail[1].message = command.consignee;
                // this.receiptDetail[2].message = command.consigneeMobile;
                // this.receiptDetail[3].message = command.receiveAddress;
                // this.orderDetail[0].valueLeft = command.sn;
                this.receiptDetail[0].message = '';
                this.receiptDetail[1].message = '';
                this.receiptDetail[2].message = '';
                this.receiptDetail[3].message = '';
                this.orderDetail[0].valueLeft = command.sn;
                switch (command.status) {
                    case 0:
                        this.orderDetail[0].valueRight = '订单取消';
                        break;
                    case 1:
                        this.orderDetail[0].valueRight = '未支付';
                        break;
                    case 2:
                        this.orderDetail[0].valueRight = '待发货';
                        break;
                    case 3:
                        this.orderDetail[0].valueRight = '待收货';
                        break;
                    case 4:
                        this.orderDetail[0].valueRight = '待评价';
                        break;
                    case 5:
                        this.orderDetail[0].valueRight = '已评价';
                        break;
                    case 6:
                        this.orderDetail[0].valueRight = '退款中';
                        break;
                    case 7:
                        this.orderDetail[0].valueRight = '已退款';
                        break;
                    default:
                        break;
                }
                this.orderDetail[1].valueLeft = command.purchaseNum;
                this.orderDetail[1].valueRight = command.goodsUnitPrice;
                this.orderDetail[2].valueLeft = '';  //邮费 
                this.orderDetail[2].valueRight = ''; //优惠
                this.orderDetail[3].valueLeft = command.payPrice;
                this.orderDetail[3].valueRight = '';//使用积分
                this.orderDetail[4].valueLeft = command.createdAt;
                this.orderDetail[4].valueRight = '微信支付';
                this.orderDetail[5].valueLeft = '';
            } else {
                this.showDetail = true;
                this.receiptDetail[0].message = command.consignee;
                this.receiptDetail[1].message = command.consignee;
                this.receiptDetail[2].message = command.consigneeMobile;
                this.receiptDetail[3].message = command.province + command.city + command.district + command.receiveAddress;
                this.orderDetail[0].valueLeft = command.sn;
                switch (command.status) {
                    case 0:
                        this.orderDetail[0].valueRight = '订单取消';
                        break;
                    case 1:
                        this.orderDetail[0].valueRight = '未支付';
                        break;
                    case 2:
                        this.orderDetail[0].valueRight = '待发货';
                        break;
                    case 3:
                        this.orderDetail[0].valueRight = '待收货';
                        break;
                    case 4:
                        this.orderDetail[0].valueRight = '待评价';
                        break;
                    case 5:
                        this.orderDetail[0].valueRight = '已评价';
                        break;
                    case 6:
                        this.orderDetail[0].valueRight = '退款中';
                        break;
                    case 7:
                        this.orderDetail[0].valueRight = '已退款';
                        break;
                    default:
                        break;
                }
                this.orderDetail[1].valueLeft = command.goods.length;
                this.orderDetail[1].valueRight = command.goodsPrice;
                this.orderDetail[2].valueLeft = command.deliverFee;  //邮费 
                this.orderDetail[2].valueRight = ''; //优惠
                this.orderDetail[3].valueLeft = command.payPrice;
                this.orderDetail[3].valueRight = '';//使用积分
                this.orderDetail[4].valueLeft = command.createdAt;
                this.orderDetail[4].valueRight = '微信支付';
                this.orderDetail[5].valueLeft = command.remark;
            }

        }
        console.log(command);

        console.log(this.showDetail);
    },
    turn(){
        this.$router.push(
            '/check/item'
          )
    },
    handleClose(done) {
        this.dialogVisible = false
      },
      querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
          },
          createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
          },
      loadAll() {
            return [
              { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
              
           
            ];
          },
      handleSelect(item) {
            console.log(item);
          },
      handleIconClick(ev) {
            console.log(ev);
          },
      onRest() {
          this.state=''
          this.search.status = ''
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
      onSumbitEdit(){
        this.tableData[this.index].branchName=this.companyForm.branchName;
        this.showDetail=false;
      },
      onSumbitUpdate(){
        {
          {
            let companyForm = {
              branchName:'',
              name:'',
              phone:'',
              account:'',
              password:''
              
            };
            companyForm.branchName = this.companyForm.branchName;
            companyForm.name = this.companyForm.name;
            companyForm.phone = this.companyForm.phone;
            companyForm.account = this.companyForm.account;
            companyForm.password = this.companyForm.password;
            if (!companyForm.branchName ||
                !companyForm.name ||
                !companyForm. phone ||
                !companyForm.account ||
                !companyForm.password
            ) {
                this.$notify({
                    title: '请完善要修改的信息',
                    message: '请检查是否完善修改信息，完善要修改的信息',
                    type: 'warning'
                });
                return;
            }
            this.tableData.unshift(companyForm)       
      /*      // console.log(companyForm);
            this.$axios.put('/managerapi/store/member/info/update', companyForm)
                .then(() => {
                    this.$notify({
                        title: '修改信息成功',
                        message: `修改状态成功，成功修改会员${companyForm.realname}信息`,
                        type: 'success'
                    });
                    this.getData();
                })*/
            this.showDetail = false;
          }
        }
      this.windows={}
      },
      forBranch(scope){
        this.showDetail=true;
        if(scope=='add') {
          this.title= 'add';
          this.companyForm = {
                 branchName:'',
                name:'',
                phone:'',
                account:'',
                password:''
          }
          this.type = 'add'
        }
        if(scope.row) {
          this.type = 'edit'
          this.title= 'edit'
          this.index=scope.$index
          this.companyForm = scope.row
        }
      },
      
    },
    
    mounted() {
        
      },
      created() {
          console.log(JSON.stringify(this.$route.query))
      },
   
};