import httpConfig from "../../http.config";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean']
]
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: {
        placeholder: '请输入消息内容',
        theme: 'snow',
        height: '500px',
        width: '500px',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              'image': function (value) {
                if (value) {
                  document.querySelector('#quill-upload input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      loading: false,
      server: process.env.VUE_APP_BASE_API,
      id: 0,
      headers: httpConfig.getHeaders(),
      currentPage: 1,
      search: {
        limit: 10,
        offset: 0,
        startTime: '',
        endTime: '',
        title: '',
      },
      isShow: '1',
      total: 0,
      toDetailSearch: {
        id: 0
      },
      valueTime: '',
      roleId:0,
      showDetail: false,
      state: '1',
      type: 'add',
      restaurants: [],
      formLabelWidth: '100px',
      noticeList: [],
      //级联选择器数据
      acceptUser: [{
        value: 0,
        label: '所有分公司',
        children: []
      }],
      msgList: [
        {
          value: '1',
          label: '重要文件'
        },
        {
          value: '2',
          label: '平台消息'
        },],
      //档口列表


      branchTwo: [{
        value: '江西分公司',
        label: '江西分公司'
      }],
      shopTwo: [{
        value: '湖北分公司',
        label: '湖北分公司'
      }, {
        value: '湖南分公司',
        label: '湖南分公司'
      }
      ],

      windows: {
        title: '',
        type: '',
        time: '',
        acceptUser: '',
        content: '',
        attachFile: '',
        attachFileName: ''
      },
      fileList: [],
    }
  },

  methods: {
        //获取个人信息
        getUserInfo() {
          this.$axios.get('/managerapi/sysuser/info', {}).then(res => {
            this.roleId = res.datas.roleId;
          })
        },
    //获取消息列表
    getNoticeList() {
      let params = this.search
      params.startTime = this.valueTime[0];
      params.endTime = this.valueTime[1];

      this.$axios.get('/managerapi/custome/notice/list', {
        params
      }
      ).then(res => {
        console.log(111)
        console.log(res);
        this.noticeList = res.datas.rows;
        this.total = res.datas.total;
      })
    },
    // 分页
    handleSizeChange(val) {
      this.search.limit = val;
      this.getNoticeList();
    },
    // 分页
    handleCurrentChange(val) {
      this.search.offset = (val - 1) * this.search.limit;
      this.getNoticeList();
    },
    onRest() {
      this.search = {
        limit: 10,
        offset: 0,
        startTime: '',
        endTime: '',
        keyword: '',
      };
      this.valueTime = ''
      this.getNoticeList();
    },
    onSubmitSearch() {
      this.getNoticeList();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      this.windows.attachFileName = file.name
      this.windows.attachFile = res.datas
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    forMessage(scope) {
      console.log(scope);
      this.isShow = "2";
      if (scope == 'add') {
        this.windows = {

        }
        this.type = 'add'
      }
      if (scope.row) {
        this.type = 'detail'
        let params = this.toDetailSearch
        this.id = scope.row.id
        params.id = this.id
        this.$axios.get('/managerapi/custome/notice/detail',
          { params }
        ).then(res => {
          console.log(res);
          this.windows.acceptUser = res.datas.acceptUser
          this.windows.time = res.datas.createdAt
          this.windows.title = res.datas.title
          this.windows.content = res.datas.content
          this.windows.type = res.datas.type
          this.windows.attachFile = res.datas.attachFile
          this.windows.attachFileName = res.datas.attachFileName

        })
      }
    },
    onAdd() {
      if (!this.windows.acceptUser
        || !this.windows.title
        || !this.windows.content
        || !this.windows.type
      ) {
        this.$message({
          message: '输入的内容不能为空，请确认后再输入',
          type: 'error'
        });
        return
      }
      let acceptUser = [];
      this.windows.acceptUser.forEach(user => {
        acceptUser.push(user)
      })
      this.$axios.post('/managerapi/custome/notice/add', {
        acceptUser: acceptUser,
        type: this.windows.type,
        title: this.windows.title,
        content: this.windows.content,
        attachFile: this.windows.attachFile,
        attachFileName: this.windows.attachFileName
      }).then(res => {
        this.$message({
          message: "通知发布成功",
          type: 'success'
        });
        this.isShow = '1'
        this.getNoticeList()

      })
    },
    // 获取分公司门店
    getCompanyShop() {
      this.$axios.get('/managerapi/custome/notice/company/shop/get', {}).then(res => {
        res.datas.forEach(element => {
          this.acceptUser[0]['children'].push(element);

        });
        console.log(this.acceptUser)


      })
    },
    acceptUserChange() {
      console.log(this.windows.acceptUser)
    },
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    },
    // 富文本图片上传前
    beforeUpload() {
      this.quillUpdateImg = true
    },
    uploadImageSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.result) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', process.env.VUE_APP_BASE_API + '/' + res.datas)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },

    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
    beforeUpload(file) {
      // console.log(this.fileList,file)
    },
    uploadSuccess(index, file, fileList) {
      if (fileList.length > 1) {
        fileList.shift();
      }
      this['fileList' + index] = [{
        name: fileList[0].name,
        url: fileList[0].response.datas
      }]
      this.windows.attachFileName = file.name
      this.windows.attachFile = fileList[0].response.datas
    }
  },
  created() {
    this.getNoticeList();
    this.getCompanyShop();
    this.getUserInfo();
  },

};
