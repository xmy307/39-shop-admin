export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    // 退出
    // 清除token
    // 跳转到login页面
    logout() {
      localStorage.removeItem("token")
      this.$router.push('/login')
    }
  },
  created() {
    this.$http({
      url: "menus"
    }).then(res => {
      this.menuList = res.data.data
      // console.log(res);
    })
  }
}