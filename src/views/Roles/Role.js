export default {
  data() {
    return {
      roleList: [],
      isAssignRoleModelShow: false,
      rightList: [],
      checkedRights: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      iscurrentEditRoleId: -1
    }
  },
  methods: {
    // 获得角色权限
    async getAxios(callback) {
      let res = await this.$http({
        url: "/roles",
        methods: "get"
      })
      this.roleList = res.data.data
      callback && callback()
    },
    // 注册分配角色事件，获得当前的角色权限
    async isAssignRoleModel(row) {
      // 1.打开模态框
      this.isAssignRoleModelShow = true
      // console.log(row);
      // 2.把当前正在编辑的id改成当前role的id
      this.iscurrentEditRoleId = row.id
      // 3.获取权限数据
      let res = await this.$http({
        url: "rights/tree",
      })
      console.log(res);
      // console.log(row.children);
      // console.log(res.data.data);

      // 4.把数据绑定给rightList,绑定给tree组件
      this.rightList = res.data.data
      // 5.需要让tree组件中默认选中当前角色拥有的权限信息，将所有的id存储到数据中，共三级，三个数组
      // let levelId1 = []
      // let levelId2 = []
      let levelId3 = []
      // 获取二级权限的id，组合成数组
      // 需要去掉一级、二级的id，防止在勾选第三级时，默认全选中
      row.children.forEach(level1 => {
        // levelId1.push(level1.id);
        level1.children.forEach(level2 => {
          // levelId2.push(level2.id);
          level2.children.forEach(level3 => {
            levelId3.push(level3.id)
          })
        })
      })
      // 不能使用下面的，因为请求的数据不同，本次请求得到的是所有的权限信息，若筛选，则每一个角色全都具有具有相同的树形结构，相同的权限，而row中请求的是角色信息，每个角色拥有不同的权限
      // res.data.data.forEach(level1 => {
      //   levelId1.push(level1.id);
      //   level1.children.forEach(level2 => {
      //     levelId2.push(level2.id);
      //     level2.children.forEach(level3 => {
      //       levelId3.push(level3.id)
      //     })
      //   })
      // })

      this.checkedRights = [...levelId3]
      console.log(this.checkedRights);
    },
    // 更新角色的权限
    async assignRole() {
      // 获取tree组件中，所有被勾选的id，存储到数组中,将id存储到字符串中
      let ids = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ].join(",")
      console.log(ids);
      // 发送更新后的请求
      let res = await this.$http({
        url: `roles/${this.iscurrentEditRoleId}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      })
      // 提示用户更新成功
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      })
      // 发送ajax获取更新后的列表 关闭模态框 
      this.getAxios();
      this.isAssignRoleModelShow = false
    },
    // 删除单个角色权限
    async deleteRight(row, id) {
      // console.log(row, id);
      // 接口信息   roles为访问的roles.js :rightId是角色信息的一级id
      //    roles/:id/rights/:rightId
      //    method："delete"
      let res = await this.$http({
        url: `roles/${row.id}/rights/${id}`,
        method: "delete"
      })
      console.log(res);
      if (res.data.meta.status == 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        })
        // 请求数据是异步的操作，等请求的数据回来之后，在赋值给页面，页面再进行渲染  传递一个回调函数，函数为空函数，让数据没有拿到之前，保证当前函数即使回调函数不传也能执行

        // 数据赋值了，但页面并不是及时更新的，还要等待下一个$nextTick()完成了，他才更新完成
        // this.$nextTick()主要的作用就是保证，能让我们操作到，数据更新后，最新的dom元素
        // this.getAxios是异步操作，this.getAxios请求完成之后，才会去执行回调函数，使用两个异步回调嵌套
        this.getAxios(() => {
          this.$nextTick(() => {
            this.$refs.roleTable.toggleRowExpansion(this.roleList.find(v => v.id == row.id), true)
          })
        })
      }
    }
  },
  created() {
    this.getAxios()
  }
}