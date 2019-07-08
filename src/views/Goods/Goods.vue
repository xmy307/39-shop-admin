<template>
  <div>
    <!-- 添加商品 -->
    <el-col :span="6">
      <el-button type="success"
                 plain
                 @click="openAddGoodsModel">添加商品</el-button>
    </el-col>

    <!-- 商品列表 -->
    <el-table :data="goodsList"
              stripe
              style="width: 100%">
      <el-table-column type="index"
                       width="50"></el-table-column>
      <el-table-column prop="goods_name"
                       label="商品名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="goods_price"
                       label="商品价格"
                       width="180">
      </el-table-column>
      <el-table-column prop="goods_weight"
                       label="商品重量">
      </el-table-column>
      <el-table-column prop="add_time"
                       label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary"
                   plain
                   size="mini"
                   icon="el-icon-edit"></el-button>
        <el-button type="danger"
                   plain
                   size="mini"
                   icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background
                   layout="prev, pager, next"
                   :total="total"
                   :page-size="pagesize"
                   :current-page="currentpage"
                   @current-change="onPageChange"></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      total: 1,
      pagesize: 6,
      currentpage: 1
    };
  },
  methods: {
    async getAxios() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.goodsList = res.data.data.goods;
      this.total = res.data.data.total;
    },
    openAddGoodsModel() {},
    onPageChange(page) {
      this.currentpage = page;
      this.getAxios();
      // console.log(page);
    }
  },
  created() {
    this.getAxios();
  }
};
</script>
<style scoped>
</style>
