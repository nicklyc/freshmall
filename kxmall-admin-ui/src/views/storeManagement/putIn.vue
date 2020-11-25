<template>
  <div class="main">
    <el-select
      v-model="entrepot"
      clearable
      filterable
      placeholder="请选择入库仓库">
      <el-option
        v-for="item in entrepotOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value" />
    </el-select>
    <el-input
      v-model="store"
      clearable
      filterable
      style="width:300px"
      placeholder="请输入库单号" />
    <el-select
      v-model="status"
      placeholder="请选择入库状态">
      <el-option
        :value="1"
        label="已入库" />
      <el-option
        :value="0"
        label="待入库" />
    </el-select>
    <el-date-picker
      v-model="date"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
    <el-button
      type="primary"
      icon="el-icon-search"
      @click="doSearch">查找</el-button>
    <el-button
      type="primary"
      @click="add">新建</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top:20px">
      <el-table-column
        type="selection"
        align="center"
        width="55" />
      <el-table-column
        prop="id"
        align="center"
        width="120"
        label="仓库" />
      <el-table-column
        align="center"
        width="200"
        label="入库单号">
        <template slot-scope="scope">
          <span>{{ scope.row.enterStockNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="enterStockStatus"
        label="入库状态" >
        <template slot-scope="scope">
          {{ scope.row.enterStockStatus | formatStatus }}
        </template>
      </el-table-column>
      <el-table-column
        prop="spuDO.id"
        align="center"
        label="入库人" />
      <el-table-column
        prop="spuDO.id"
        align="center"
        label="入库时间" >
        <template slot-scope="scope">
          {{ scope.row.gmtUpdate | formatDateAndTime }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建/修改人" >
        <template slot-scope="scope">
          {{ scope.row.gmtCreateUser.realname }} / {{ scope.row.gmtUpdateUser.realname }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        align="center"
        label="创建/修改时间">
        <template slot-scope="scope">
          {{ scope.row.gmtUpdate | formatDateAndTime }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small">详情</el-button>
          <el-button
            v-if="!scope.row.enterStockStatus"
            type="primary"
            size="small"
            @click="edit(scope.row.id)">修改</el-button>
          <el-button
            v-if="!scope.row.enterStockStatus"
            type="danger"
            size="small"
            @click="deleteIt(scope.row.id)">删除</el-button>
          <el-button
            v-if="!scope.row.enterStockStatus"
            type="primary"
            size="small"
            @click="updataStatus(scope.row.id)">入库</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
    <el-dialog
      :visible.sync="addBar"
      title="商品入库列表"
      width="70%">
      <div>
        <el-form :inline="true">
          <el-form-item label="出库仓库">
            <el-select
              v-model="addStore"
              clearable
              filterable
              placeholder="请选择入库仓库">
              <el-option
                v-for="item in entrepotOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="remark"
              type="textarea"
              autosize
              clearable
              placeholder="请输入内容"
              style="height:36px">
            </el-input>
          </el-form-item>
        </el-form>
        <div style="margin-bottom:20px">
          <el-cascader
            :props="{ checkStrictly: true }"
            v-model="category"
            :options="categoryOptions"
            placeholder="请选择类目"/>
          <el-input
            v-model="code"
            clearable
            style="width:200px"
            placeholder="请输入商品条码/商品名称"/>
          <el-button type="primary" icon="el-icon-search" @click="goodsSearch">查询</el-button>
        </div>
        <el-table
          :data="goodAdd"
          border>
          <el-table-column
            :reserve-selection="true"
            type="selection"
            align="center"
            width="55"/>
          <el-table-column
            align="center"
            label="商品类目">
            <template slot-scope="scope">
              <span>{{ scope.row.categoryDOs | getType }}</span>
            </template>
          </el-table-column>
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
            prop="stock"
            align="center"
            label="可售量"/>
          <el-table-column
            align="center"
            label="入库数量">
            <template slot-scope="scope">
              <el-input-number v-model="numList[scope.$index]" :min="0" :max="scope.row.stock" clearable label="描述文字" style="width:120px"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage1"
          :page-size="pageSize1"
          :total="totalPage1"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"/>
      </div>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="addBar = false">取 消</el-button>
        <el-button
          type="primary"
          @click="create">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEntrepotList, getPutList, deleteEnterStock, UpdateEnterStockStatus, selectById } from '@/api/entrepot'
import { getGoodsList, createEnterStock } from '@/api/entrepot'
import { categoryTree } from '@/api/category'
export default {
  name: 'PutIn',
  filters: {
    formatStatus(val) {
      if (val) {
        return '已入库'
      } else {
        return '待入库'
      }
    },
    getType(val) {
      if (!val) {
        return ''
      }
      const arr = val.map(item => item.title)
      const str = arr.join('>')
      return str
    }
  },
  data() {
    return {
      date: '',
      currentPage: 1,
      totalPage: 10,
      pageSize: 20,
      currentPage1: 1,
      totalPage1: 10,
      pageSize1: 20,
      addStore: '',
      addBar: false,
      status: '',
      entrepotOptions: [],
      entrepot: '',
      store: '',
      tableData: [],
      remark: '',
      categoryOptions: [],
      category: '',
      code: '',
      goodAdd: [],
      numList: []
    }
  },
  created() {
    getEntrepotList().then(res => {
      res.data.data.items.forEach(item => {
        this.entrepotOptions.push({
          label: item.name,
          value: item.id
        })
      })
    })
    categoryTree().then(response => {
      this.categoryOptions = response.data.data
      this.categoryOptions.forEach(item => {
        item.children.forEach(val => {
          val.children = undefined
        })
      })
    })
    this.getList({
      page: this.currentPage,
      limit: this.pageSize
    })
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList({
        page: val,
        limit: this.pageSize
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList({
        page: this.currentPage,
        limit: val
      })
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val
      this.getListGood({
        page: val,
        limit: this.pageSize1
      })
    },
    handleSizeChange1(val) {
      this.pageSize1 = val
      this.getListGood({
        page: this.currentPage1,
        limit: val
      })
    },
    goodsSearch() {
      this.getListGood({
        page: this.currentPage1,
        limit: this.pageSize1
      })
    },
    getListGood(obj) {
      getGoodsList({
        storageId: this.addStore,
        name: this.code,
        categoryId: this.category[1],
        ...obj
      }).then(res => {
        this.totalPage1 = res.data.data.total
        this.goodAdd = res.data.data.items
        this.numList = this.goodAdd.map(() => 0)
      })
    },
    doSearch() {
      this.getList({
        page: this.currentPage,
        limit: this.pageSize
      })
    },
    add() {
      this.addBar = true
      this.getListGood({
        page: this.currentPage1,
        limit: this.pageSize1
      })
    },
    edit(val) {
      this.addBar = true
      selectById({ id: val }).then(res => {
        console.log(res)
      })
    },
    updataStatus(val) {
      // 确认入库二次确认
      this.$confirm('确定入库吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        UpdateEnterStockStatus({
          id: val, enterStockStatus: 1
        }).then(res => {
          this.getList({
            page: this.currentPage,
            limit: this.pageSize
          })
          this.$notify({
            title: '提示',
            message: '入库成功',
            type: 'success'
          })
        })
      }).catch(() => {

      })
    },
    deleteIt(val) {
      deleteEnterStock({ id: val }).then(res => {
        this.getList({
          page: this.currentPage,
          limit: this.pageSize
        })
      })
    },
    getList(obj) {
      let gmtCreate = null
      if (this.date) {
        gmtCreate = this.date.getTime()
      }
      getPutList({
        storageId: this.entrepot,
        enterStockStatus: this.status,
        enterStockNo: this.store,
        gmtCreate,
        ...obj
      }).then(res => {
        this.tableData = res.data.data.items
        this.totalPage = res.data.data.total
      })
    },
    create() {
      const list = []
      const arr = this.goodAdd.filter((val, index) => {
        if (this.numList[index]) {
          list.push(this.numList[index])
          return true
        }
      })
      const newArr = arr.map((val, index) => {
        return {
          storageId: val.storageId,
          skuId: val.skuId,
          spuId: val.spuId,
          enterNum: list[index]
        }
      })
      createEnterStock({
        enterStock: JSON.stringify(newArr)
      }).then(res => {
        console.log(res)
        this.addBar = false
        this.getList({
          page: this.currentPage,
          limit: this.pageSize
        })
      })
    }
  }
}
</script>

<style>
.main {
  padding: 20px;
}

</style>
