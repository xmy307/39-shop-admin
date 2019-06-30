<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light system">
            <h1>品优购后台管理系统</h1>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple vip">
            <span>欢迎上海前端39期星曜会员</span>
            <a href="#">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span slot="title">商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span slot="title">分类参数</span>
            </el-menu-item>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span slot="title">商品分类</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span slot="title">订单列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-4-1">
              <i class="el-icon-menu"></i>
              <span slot="title">数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<style>
.el-container {
  height: 100%;
  background-color: #eaeef1;
}
.el-container .el-header {
  background-color: #b3c1cd;
  padding: 0;
}

.el-header .el-col h1 {
  font-size: 28px;
  color: #fff;
  font-weight: 700;
  margin: 0;
  text-align: center;
}
.el-header .el-col span {
  font-weight: bolder;
  padding-right: 10px;
}
.el-header .el-col a {
  color: orange;
}
.el-aside {
  background: #545c64;
}
.el-menu-vertical-demo.el-menu {
  height: 100%;
}
</style>