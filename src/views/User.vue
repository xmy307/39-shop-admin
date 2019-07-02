<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row>
      <el-col :span="8">
        <div>
          <el-input placeholder="请输入内容" v-model="query" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="openAddUserModel">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 用户列表 -->
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 解构出row -->
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#409EFF"
            inactive-color="#C0CCDA"
            @change="statusUser(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit"
            @click="openEditModel(row.id)"
          ></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUser(row.id)"></el-button>
          <el-button type="success" plain size="mini">
            <i class="el-icon-check"></i>分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="onPageChange"
    ></el-pagination>

    <!-- 添加用户的模态框 -->
    <!-- 模态框关闭时，重置表单  使用方法模态框关闭的方法close+表单的重置方法 -->
    <el-dialog title="添加用户" :visible.sync="isAddUserModel" @close="$refs.ruleForm.resetFields()">
      <el-form :model="addUserFormData" label-width="100px" :rules="addRules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserFormData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserFormData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserModel = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户的模态框 -->
    <el-dialog title="修改用户信息" :visible.sync="isEditUserModel" @close="$refs.ruleForm.resetFields()">
      <el-form :model="editUserFormData" label-width="100px" :rules="editRules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editUserFormData.username"></el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFormData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserFormData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditUserModel = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机格式不正确",
            trigger: "change"
          }
        ]
      },
      isEditUserModel: false,
      editUserFormData: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      editRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机格式不正确",
            trigger: "change"
          }
        ]
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
          data: { data, meta }
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
        }
      } catch {}
    }
  }
};
</script>

<style>
.el-main .el-breadcrumb {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  background-color: #d4dae0;
  padding-left: 20px;
}
.el-col .el-button {
  margin-left: 20px;
}
</style>

