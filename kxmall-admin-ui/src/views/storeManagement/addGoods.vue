<template>
  <div>
    <el-cascader
      :props="{ checkStrictly: true }"
      v-model="category"
      :options="categoryOptions"
      placeholder="请选择类目"/>
    <el-input
      v-model="kw"
      style="width:200px"
      clearable
      placeholder="请输入商品条码/商品名称"/>
    <el-button type="primary" icon="el-icon-search" @click="goodsSearch">查询</el-button>
    <el-table
      :data="tableData"
      border
      height="500"
      row-key="id"
      style="margin-top:10px;"
      @selection-change="getTableData">
      style="width: 100%; margin-top:20px">
      <el-table-column
        :reserve-selection="true"
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        align="center"
        prop="skuDTO.barCode"
        label="商品条码"/>
      <el-table-column
        prop="spuDO.title"
        align="center"
        label="商品名称"/>
      <el-table-column
        prop="skuDTO.title"
        align="center"
        label="商品规格"/>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addGoodsTableBtn(scope.row,scope.$index)" >添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top:10px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
    <div class="dialog-footer" style="margin-top:10px;text-align:right;">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="sureDialog">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { getGoodsList } from '@/api/out_stock'
import { categorySecondLevelTree } from '@/api/category'
export default {
  name: 'AddGoodsVue',
  props: {
    userselectid: {
      type: Array,
      default: () => { return [] }
    },
    storageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      category: '',
      categoryOptions: [],
      kw: '',
      tableData: [],
      userTableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0
    }
  },
  created() {
    categorySecondLevelTree().then(res => {
      console.log(res)
      this.categoryOptions = res.data.data
      this.categoryOptions.forEach(item => {
        item.children.forEach(val => {
          val.children = undefined
        })
      })
    })
    this.getList(
      { page: 1,
        limit: 20,
        storageId: this.storageId,
        idsNotInJson: this.userselectidManage(this.userselectid)
      }
    )
  },
  methods: {
    async getList(obj) {
      console.log('执行了这个方法')
      const res = await getGoodsList(obj)
      this.total = res.data.data.total
      this.tableData = res.data.data.items
    },
    userselectidManage(data) {
      if (data.length === 0) {
        return ''
      } else {
        const res = []
        data.forEach(item => {
          res.push(Number(item))
        })
        return JSON.stringify(res)
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList({
        name: this.kw, /* 搜索关键字 */
        categoryId: this.category[1], /* 搜索类目 */
        page: this.currentPage,
        limit: val,
        storageId: this.storageId,
        idsNotInJson: this.userselectidManage(this.userselectid)
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList({
        name: this.kw, /* 搜索关键字 */
        categoryId: this.category[1], /* 搜索类目 */
        page: val,
        limit: this.pageSize,
        storageId: this.storageId,
        idsNotInJson: this.userselectidManage(this.userselectid)
      })
    },
    goodsSearch() {
      this.currentPage = 1
      this.getList({
        name: this.kw, /* 搜索关键字 */
        categoryId: this.category[1], /* 搜索类目 */
        page: this.currentPage,
        limit: this.pageSize,
        storageId: this.storageId,
        idsNotInJson: this.userselectidManage(this.userselectid)
      })
    },
    addGoodsTableBtn(data, index) {
      // 给添加成功的提示
      this.$notify({
        title: '提示',
        message: data.skuDTO.title + ' 添加成功'
      })
      // 已添加的商品先删除掉
      this.tableData.splice(index, 1)
      this.$emit('addOne', data)
    },
    getTableData(row) {
      const _this = this
      _this.userTableData = [] // 每次改动重置ID
      row.forEach((item) => {
        _this.userTableData.push(item)
      })
      console.log(_this.userTableData)
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    sureDialog() {
      /* 判断是否有选中数据 */
      if (this.userTableData.length !== 0) {
        this.$emit('batchAdd', this.userTableData)
      }
      this.closeDialog()
    }
  }
}
</script>

<style scoped>

</style>
