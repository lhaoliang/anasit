import selectTree from "@/components/SelectTree/selectTree.vue";
import merge from 'element-ui/src/utils/merge';

export default {
  components: {
    'select-tree': selectTree
  },
  data() {
    return {
      menuTree: [{
        id: 1,
        label: '首页',
      }, {
        id: 2,
        label: '权限管理',
        children: [{
          id: 9,
          label: '权限设置'
        }, {
          id: 10,
          label: '角色设置'
        }, {
          id: 11,
          label: '菜单设置'
        }]
      }, {
        id: 3,
        label: '组织管理',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      form: {
        id: null,
        menuTitle: '',
        level: 0,
        menuIcon: '',
        menuUrl: '',
        hidden: '0',
        delivery: false,
        menuParentId: null,
        desc: ''
      },
      formLabelWidth: '100px',
      defaultProps: {
        children: 'children',
        label: 'name',
        id: "id",
      },
      selectIconDialog: false,
    }
  },

  methods: {
    onSubmit() {
        console.log(this.form)

      if (this.form.id == null) {
        // 新增菜单
        this.$axios.post('/managerapi/system/menu/add', this.form).then(res => {
          console.log(res);
          if (res.result) {
            this.$message.success("新增菜单成功");
            this.getUserMenu();
          } else {
            this.$message.error("新增菜单失败");            
          }
        })
      } else {
        // 更新菜单
        this.$axios.put('/managerapi/system/menu/update', this.form).then(res => {
          console.log(res);
          if (res.result) {
            this.$message.success("更新菜单成功");
            this.getUserMenu();
          } else {
            this.$message.error("更新菜单失败");            
          }
        })
      }
    },
    // 新增菜单
    addMenu() {
      this.form = {
        id: null,
        menuTitle: '',
        level: 0,
        menuParentId: 0,
        menuUrl: '',
        hidden: '0'
      };
    },
    // 删除单个菜单
    deleteSelected() {
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/managerapi/system/menu/delete?id='+this.form.id).then(res => {
          if (res.result) {
            this.$message.success("删除菜单"+this.form.menuTitle+"成功");
            this.getUserMenu();
            this.form = {};
          } else {
            this.$message.error("删除菜单"+this.form.menuTitle+"失败");
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      
    },
    handleDragStart(node, ev) {
      console.log('drag start', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    },
    handleNodeClick(data){
      this.form = Object.assign({}, data);
      this.form.hidden = this.form.hidden+'';
    },
    // 获取菜单栏
    getUserMenu() {
      this.$axios.get("managerapi/system/menu").then(res => {
        this.menuTree = res.datas;
        this.menuTree.forEach(menu => {
          menu.label = menu.menuTitle;
          menu.children.forEach(item => {
            item.label = item.menuTitle;
          })
        });
      });
    }
  },
  created() {
    this.getUserMenu();
  }
};