import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 5,
            max: 12,
            message: "用户名必须是5-12个字符",
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
            message: "密码必须是5-12位",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    async submitForm(formName) {
      // this.$refs[formName] 这个就获取到表单的对象
      // 通过调用validate方法，可以对表单做整体的校验
      // validate函数接收的参数就是一个函数
      // valid形参接收到的就是表单校验的结果，表单校验成功则为true， 不成功则为false
      let valid = await this.$refs[formName].validate();
      // 发送axios请求
      if (valid) {
        try {
          let {
            data: {
              data,
              meta
            }
          } = await axios({
            url: "login",
            method: "post",
            data: this.form
          });
          if (meta.status === 200) {
            // 登录成功服务器会返回一个token，保存到本地
            // 说明拿到了form对象中的username和password，将form对象的值存储到localstorage
            localStorage.setItem("token", data.token);

            // 登录成功后跳转至home页
            this.$router.push("./home");
          }
        } catch (err) {
          console.log("请求发送失败", err);
        }

        // axios({

        //   // }).then(res => {
        // }).then(({ data: { data, meta } }) => {

        //   console.log(data);
        //   // console.log(res);
        // });
      } else {
        // console.log("error submit!!");
        return false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};