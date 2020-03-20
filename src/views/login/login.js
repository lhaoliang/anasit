export default {
  name: 'userlogin',
  data() {

    return {
      loginForm: {
        account: localStorage.getItem('account') ? localStorage.getItem('account') : '',
        password: ''
      },
      checked: false,
      code: {
        src: '',
        value: '',
        len: 4,
        type: 'text'
      },
      loginRules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
  },
  props: [],
  methods: {
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    rememberAccount() {
      if (this.checked) {
        localStorage.setItem('account', this.loginForm.account);
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$axios.post('/managerapi/sysuser/signin', this.loginForm).then(res => {
            if (res.result) {
              localStorage.setItem('ng-params-one', res.datas.uid);
              localStorage.setItem('ng-params-two', res.datas.token);
              localStorage.setItem('ng-params-three', res.datas.platform);
              // this.$message.success("登录成功");
              this.$router.push({ path: this.$route.query.redirect || '/' });

            }
          })
        }
      })
    }
  }
}