import httpConfig from "../../../http.config";
export default {

    data() {
        return {
            select: '',
            type: 'add',
            formLabelWidth: '120px',
            value: '',
            id: '',
            dialogVisible: false,
            // 批量设置相关
            isSetListShow: true,
            loading: false,
            server: process.env.VUE_APP_BASE_API,
            headers: httpConfig.getHeaders(),
            info: {},
            detail: [],
            viewImage: false
        }
    },

    methods: {
        editScore(){
            this.$axios.put('/managerapi/custome/grade/table/edit',{
                datas: this.detail
            }).then(res=>{
                if(res.result){
                    this.$message({
                        message: "编辑成功",
                        type: 'success'
                      });
                }
                this.$router.push('/check/record')
            })
        },
        getDetail() {
            let params = {
                id: this.$route.params.id
            }
            this.$axios.get('/managerapi/custome/grade/table/detail', {
                params
            }).then((res) => {
                this.info = res.datas
                this.detail = res.datas.subjects
                console.log(this.detail)
            })
        },
        handleClose(done) {
            this.dialogVisible = false
        },
        turn() {
            this.$router.push('/check/record')
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

        viewLargeImage() {
            this.viewImage = true;
        },

        handleClose() {
            this.viewImage = false;
        }

    },
    mounted() {

    },
    created() {
        console.log(this.$route.params.id)
        this.getDetail()
        // this.getList()
        // this.getGoodList()
        // this.getServiceList()
    },
    computed: {

    }
};