export default {
  data() {
    return {
      userList: [],
      total: 0,
      pagesize: 3,
      currentpage: 1,
      query: "",
      isAddUserModel: false,
      addUserFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addRules: {
        username: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 5,
            message: "长度在 3 到 5 个字符",
            trigger: "change"
          }
        ],
        password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 个字符",
            trigger: "change"
          }
        ],
        email: [{
          pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
          message: "邮箱格式不正确",
          trigger: "change"
        }],
        mobile: [{
          pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
          message: "手机格式不正确",
          trigger: "change"
        }]
      },
      isEditUserModel: false,
      editUserFormData: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      editRules: {
        email: [{
          pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
          message: "邮箱格式不正确",
          trigger: "change"
        }],
        mobile: [{
          pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
          message: "手机格式不正确",
          trigger: "change"
        }]
      }
    };
  },
  created() {
    this.getAxios();
  },
  methods: {
    getAxios() {
      this.$http({
        url: "users",
        params: {
          query: this.query,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      }).then(res => {
        // 查看$route.path
        // console.log(this.$route);
        let {
          data: {
            data,
            meta
          }
        } = res;
        this.userList = data.users;
        this.total = data.total;

        // console.log(res);
      });
    },
    // 分页功能
    onPageChange(page) {
      // console.log("页码发生了改变", page);
      this.currentpage = page;
      this.getAxios();
    },
    // 搜索功能
    search() {
      this.getAxios();
    },
    // 修改状态功能
    async statusUser(state) {
      // 拿到row的值
      // console.log(state);
      let res = await this.$http({
        url: `users/${state.id}/state/${state.mg_state}`,
        method: "put"
      });
      // console.log(res);
      if ((res.data.meta.status = 200)) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: 1000
        });
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: "error",
          duration: 1000
        });
      }
    },
    // 删除用户功能
    async delUser(id) {
      await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      let res = await this.$http({
        url: `users/${id}`,
        method: "delete"
      });
      // console.log(res);
      if (res.data.meta.status == 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 2000
        });
        this.currentpage = 1;
        this.getAxios();
      }
    },
    // 打开添加用户模态框
    openAddUserModel() {
      this.isAddUserModel = true;
    },
    // 添加用户功能
    async addUser() {
      try {
        await this.$refs.ruleForm.validate();
        console.log("校验成功");

        let res = await this.$http({
          url: "users",
          method: "post",
          data: this.addUserFormData
        });
        console.log(res);
        if (res.data.meta.status === 201) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 2000
          });
          this.getAxios();
          this.isAddUserModel = false;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 2000
          });
        }
      } catch (err) {}
    },
    // 打开修改用户模态框  使用id去后台获取用户数据，展示到模态框中
    async openEditModel(id) {
      this.isEditUserModel = true;
      // console.log(id);
      let res = await this.$http({
        url: `users/${id}`
      });
      console.log(res);
      this.editUserFormData = res.data.data;
    },
    async editUser() {
      try {
        await this.$refs.ruleForm.validate();
        let res = await this.$http({
          url: `users/${this.editUserFormData.id}`,
          method: "put",
          data: {
            mobile: this.editUserFormData.mobile,
            email: this.editUserFormData.email
          }
        });
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.getAxios();
          this.isEditUserModel = false;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
      } catch (err) {}
    }
  }
};