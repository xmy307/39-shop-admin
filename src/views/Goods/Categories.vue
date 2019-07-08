<template>
  <div>
    <!-- 添加商品 -->
    <el-col :span="6">
      <el-button type="success" plain @click="openAddCategoriesModel">添加商品</el-button>
    </el-col>

    <!-- 商品列表 -->
    <!-- element-tree-grid（表格树）  配合el-table使用
      <el-table-tree-column fixed (是否固定)
　　　　　　　　　　　　　　　　　　prop='属性 '     table='表头'
　　　　　　　　　　　　　　　　　　levelKey='层级（0,1,2,3代表第几层）'
　　　　　　　　　　　　　　　　　　parentKey='parentId（上一层级的ID,值与父层级的ID（treeKey）一致）’
　　　　　　　　　　　　　　　　　　treeKey='目前层级的ID，子层级的parentKey与其一致 '
　　　　　　　　　　　　　　　　　　:indentSize='没展开一个层级缩进的px'
　　　　　　　　　　　　　　　　　　child-key='子层级数据（数组形式）'>
    </el-table-tree-column>-->
    <el-table :data="categoriesList" stripe style="width: 100%">
      <!--file-icon 指的就是叶子节点的图标
      folder-icon   指的就是可展开的项的图标
      label 指的就是表头 
      treeKey 节点的唯一表示
      parentKey 数据的父节点id
indent-size是用来设置每个层级之间的缩进距离的  设置indent-size 需要同时制定 层级属性
level-key:    设置为数据中标识层级的属性名即可
      -->
      <el-table-tree-column
        file-icon="el-icon-folder"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        treeKey="cat_id"
        parentKey="cat_pid"
        :indent-size="50"
        level-key="cat_level"
      ></el-table-tree-column>
      <!-- <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column> -->
      <el-table-column prop="cat_pid" label="是否有效" width="180">
        <template v-slot="{row}">
          <span>{{row.cat_deleted?"否":"是"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>

      <el-table-column label="操作">
        <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
        <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="onPageChange"
    ></el-pagination>

    <!-- 添加商品的模态框 -->
    <el-dialog title="添加分类" :visible.sync="isshowCategoriesModel">
      <el-form :model="addCateForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- v-model绑定的就是value值，而value默认绑定cat_id,存储所选中的选项对应层级的id：包括父级和二级层级的id（可通过浏览器Vue视图查看）-->
          <el-cascader v-model="addCateForm.parentArr" :options="options" :props="defaultProps"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openAddCategoriesModel = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const ElTreeGrid = require("element-tree-grid");

export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoriesList: [],
      total: 0,
      pagesize: 5,
      currentpage: 1,
      isshowCategoriesModel: false,
      addCateForm: {
        cat_name: "",
        parentArr: []
      },
      // 添加父类的时候，所有的父类列表 最终都展示在级联选择器中----参考树形控件，设置默认绑定props
      // 级联菜单放到options中,数组中存放的是对象
      options: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  methods: {
    async getAxios() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.categoriesList = res.data.data.result;
      this.total = res.data.data.total;
    },
    onPageChange(page) {
      this.currentpage = page;
      this.getAxios();
      // console.log(page);
    },
    async openAddCategoriesModel() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      this.options = res.data.data;
      this.isshowCategoriesModel = true;
    },
    async addCategories() {
      // cat_level与cat_pid先后位置不能调换，否则，level永远都是1
      let cat_name = this.addCateForm.cat_name;
      let cat_level = this.addCateForm.parentArr.length;
      let cat_pid = this.addCateForm.parentArr.pop() || 0;
      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_name,
          cat_level,
          cat_pid
        }
      });
      console.log(res);
      if (res.data.meta.status == 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.isshowCategoriesModel = false;
        this.getAxios();
      }
    }
  },
  created() {
    this.getAxios();
  }
};
</script>