<template>
  <el-table :data="users" stripe style="width: 100%">
    <el-table-column prop="username" label="姓名" width="180"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column label="用户状态">
      <template v-slot="{row}">
        <el-switch v-model="row.type" active-color="#409EFF" inactive-color="#C0CCDA"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-row>
        <el-button type="primary" plain size="mini">
          <i class="el-icon-edit"></i>
        </el-button>
        <el-button type="danger" plain size="mini">
          <i class="el-icon-delete"></i>
        </el-button>
        <el-button type="success" plain size="mini">
          <i class="el-icon-check"></i>分配角色
        </el-button>
      </el-row>
    </el-table-column>
  </el-table>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      users: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      params: {
        pagenum: 1,
        pagesize: 5
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(res => {
      // 查看$route.path
      // console.log(this.$route);
      let {
        data: { data, meta }
      } = res;
      this.users = data.users;
      // console.log(res);
    });
  }
};
</script>
