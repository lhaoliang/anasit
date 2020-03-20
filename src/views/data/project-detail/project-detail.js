export default {
  data() {
    return {
      loading: false,
      dialogVisible:false,
      remark:'',
      mouths: ["2018-01","2018-02","2018-03","2018-04","2018-05"],
      tableData: [{
          sort: '1',
          name: '紫阳明珠店',
          company: '江西分公司',
          time: '2018-5-10',
          score: '100',
          term: '2018上学期'
        },
        {
          sort: '2',
          name: '紫阳明珠店',
          company: '江西分公司',
          time: '2018-5-10',
          score: '100',
          term: '2018上学期'
        },
      ],
    }
  },
  methods: {
    turn() {
      this.$router.push(
        '/data/flow'
      )
    },
    getList() {
      this.loading = true;
      let params = {
        termId:this.$route.query.termId,
        termIdTwo:this.$route.query.termIdTwo,
        shopId:this.$route.query.shopId,
      };
      this.$axios.get('/managerapi/custome/term/company/project/loss/detail', {
        params
      }).then(res => {
        this.loading = false;
        if (res.result) {
          this.tableData = res.datas;
          this.mouths = res.datas[0].months
        }
      });
    },
    tableRowClassName(row){

      console.log(row);
      if(row.row.isLoss){
        return 'grey'
      }
    },
    detail(row){
      console.log(row)
      if(row.isOut){
        this.dialogVisible = true
        this.remark = row.remark
      }
    }
  },
  created() {
    console.log(this.$route.query);
    this.getList()
  },
};