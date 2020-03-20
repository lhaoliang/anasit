export default {

    data() {
        return {
            loading: false,
            title:true,
            total: 0,
            index:'',
            search:{
              status:''
            },
            showDetail: false,
            formLabelWidth: '100px',
            dialogVisible:false,
            multipleSelection: [],
            type:'',
            restaurants: [],
            state: '',
            question:{
                select:''
            },
            shopName:'',
           detail:[]
        }
    },

    methods: {


      goShopList(){
        this.$router.push(
          '/inside-admin/shop'
        )
      },
      getDetail(){
          let params = {
              id:this.$route.params.id
          }
        this.$axios.get('/managerapi/custome/check/table/preview', {
            params
        }).then((res) => {
            console.log(res)
            this.shopName = res.datas.name
            this.detail = res.datas.subject
        })
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
        turn(){
            this.$router.push(
                '/check/list'
            )
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
       console.log(this.$route.params.id)
       this.getDetail()
      },


   
};