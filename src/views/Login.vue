<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle" :gutter="10">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <div class="grid-content bg-purple-light">
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="login-model"
          label-position="top"
        >
          <!-- <el-form ref="form" :model="form" label-width="80px" class="login-model"> -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button>取消</el-button>
          </el-form-item>
          <!-- </el-form> -->
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// axios谁用谁引入
import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名必须是5-12个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
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
    submitForm(formName) {
      // this.$refs[formName] 这个就获取到表单的对象
      // 通过调用validate方法，可以对表单做整体的校验
      // validate函数接收的参数就是一个函数
      // valid形参接收到的就是表单校验的结果，表单校验成功则为true， 不成功则为false
      this.$refs[formName].validate(valid => {
        // 发送axios请求
        if (valid) {
          axios({
            url: "http://localhost:8888/api/private/v1/login",
            method: "post",
            data: this.form
            // }).then(res => {
          }).then(({ data: { data, meta } }) => {
            if (meta.status === 200) {
              // 登录成功服务器会返回一个token，保存到本地
              // 说明拿到了form对象中的username和password，将form对象的值存储到localstorage
              localStorage.setItem("token", data.token);

              // 登录成功后跳转至home页
              this.$router.push("./home");
            }
            console.log(data);
            // console.log(res);
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>



<style>
.row-bg {
  background-color: #2d434c;
  height: 100%;
}
.login-model {
  background-color: #fff;
  border-radius: 10px;
  padding: 40px 20px;
  min-width: 400px;
}
</style>

