<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="rightsList"
              stripe
              style="width: 100%">
      <el-table-column type="index"
                       width="50"></el-table-column>
      <el-table-column prop="authName"
                       label="权限名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="path"
                       label="路径"
                       width="180">
      </el-table-column>
      <el-table-column prop="level"
                       label="层级">
        <template v-slot="{row}">
          <span>{{row.level|leveFilter}}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    async getAxios() {
      let res = await this.$http({
        url: "/rights/list",
        data: {
          type: "list"
        }
      });
      console.log(res);
      this.rightsList = res.data.data;
    }
  },
  filters: {
    leveFilter(value) {
      switch (value) {
        case "0":
          return "一级";
        case "1":
          return "二级";
        case "2":
          return "三级";
      }
    }
  },
  created() {
    this.getAxios();
  }
};
</script>

<style scoped>
.el-main .el-breadcrumb {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  background-color: #d4dae0;
  padding-left: 20px;
}
</style>