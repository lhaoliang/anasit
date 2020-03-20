import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'message_page',
  data() {
    return {
      total: 0,
      tableData: [],
      search: {
        limit: 10,
        offset: 0,
        title: '',
        content: '',
        date: '',
        noticeType: ''
      },
      count: {
        firstCount: 0,
        sysCount: 0,
        preCount: 0,
        tryCount: 0
      },
      listLoading: true,
      contentLoading: false,
      currentMessageType: 'unread',
      messageContent: '',
      showingMsgItem: {},
      listDic: {
        unread: 'messageUnreadList',
        readed: 'messageReadedList',
        trash: 'messageTrashList'
      },
      pickerOptions1: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  computed: {
    ...mapState({
      messageUnreadList: state => state.user.messageUnreadList,
      messageReadedList: state => state.user.messageReadedList,
      messageTrashList: state => state.user.messageTrashList,
      messageList() {
        return this[this.listDic[this.currentMessageType]]
      },
      titleClass() {
        return {
          'not-unread-list': this.currentMessageType !== 'unread'
        }
      }
    }),
    ...mapGetters([
      'messageUnreadCount',
      'messageReadedCount',
      'messageTrashCount'
    ])
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getContentByMsgId',
      'getMessageList',
      'hasRead',
      'removeReaded',
      'restoreTrash'
    ]),
    stopLoading(name) {
      this[name] = false
    },
    handleSelect(name) {
      this.search.noticeType = name;
      console.log(this.search.noticeType);
      this.loadData();
    },
    handleView(item) {
      this.showingMsgItem = item;
      if (!item.isRead) {
        this.$axios.put('/managerapi/store/notice/read/set', { id: item.id }).then(res => {
          console.log(res);
        })
        this.getMessageCount();
      }

      console.log(this.showingMsgItem);

    },
    loadData() {
      this.showingMsgItem = {};
      this.listLoading = true
      // 请求获取消息列表
      let params = this.search;
      if (this.search.date) {
        params.start = this.search.date[0];
        params.end = this.search.date[1];
      }
      this.$axios.get('/managerapi/store/notice/list', { params }).then(res => {
        console.log(res);
        this.loading = false;
        if (res.result) {
          this.tableData = [];
          this.tableData = res.datas.rows;
          this.total = res.datas.total;
        }
      });
      this.getMessageCount();
    },
    deleteMessage(item) {
      this.$confirm(`您将删除标题为${item.title}的消息`, '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: item.id
        }
        this.$axios.delete('/managerapi/store/notice/delete', { params }).then(() => {
          this.$notify({
            title: '删除消息成功',
            message: `删除消息成功`,
            type: 'success'
          });
          this.loadData();
        });

      })

    },
    getMessageCount() {
      this.$axios.get('/managerapi/store/notice/type/count', {}).then(res => {
        this.count = {
          firstCount: 0,
          sysCount: 0,
          preCount: 0,
          tryCount: 0
        },
          res.datas.forEach(x => {
            if (x.type == 2) {
              this.count.firstCount = x.count;
            }
            if (x.type == 1) {
              this.count.sysCount = x.count;
            }
            if (x.type == 3) {
              this.count.preCount = x.count;
            }
            if (x.type == 4) {
              this.count.tryCount = x.count;
            }
          })
      })
    },
    removeMsg(item) {
      item.loading = true
      const msg_id = item.msg_id
      if (this.currentMessageType === 'readed') this.removeReaded({ msg_id })
      else this.restoreTrash({ msg_id })
    }
  },

  mounted() {
    this.loadData();
  }
}