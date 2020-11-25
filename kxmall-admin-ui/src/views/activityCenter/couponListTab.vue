<template>
  <div class="main">
    <el-input
      v-model="query.title"
      style="width:240px"
      clearable
      placeholder="请输入活动券名称/ID"/>
    <el-select v-model="query.status" style="width:150px" clearable filterable placeholder="请选择状态">
      <el-option
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>

    <el-button type="primary" @click="onSearch()">查询</el-button>
    <el-button type="primary" @click="onCreate">新建</el-button>

    <!-- 表格内容 -->
    <el-table
      v-loading="isListLoading"
      ref="list"
      :data="list"
      border
      element-loading-text="正在查询中。。。"
      style="width: 100%; margin-top:20px"
      @selection-change="onSelectRow">
      <el-table-column
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        prop="id"
        align="center"
        width="120"
        label="活动券ID"/>
      <el-table-column
        prop="title"
        align="center"
        label="活动券名称"/>
      <el-table-column
        prop="type"
        align="center"
        width="120"
        label="券类型">
        <template slot-scope="scope">
          {{ scope.row.type | typeFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        width="100"
        align="center"
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | statusType }}
        </template>
      </el-table-column>

      <el-table-column
        width="170"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="onView(scope.row, scope.$index)">查看</el-button>
          <el-button type="text" size="mini" @click="onEdit(scope.row, scope.$index)">修改</el-button>
          <el-button v-show="Number(scope.row.status) === 1" type="text" size="mini" @click="onFreeze(scope.row)">冻结</el-button>
          <el-button v-show="Number(scope.row.status) === 0" type="text" size="mini" @click="onActive(scope.row)">激活</el-button>
          <el-button type="text" size="mini" @click="onDelete(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <!-- <div class="leftbar">
        <el-checkbox v-model="selectedAll" @change="onSelectAll">全选</el-checkbox>
        <el-dropdown trigger="click">
          <el-button type="primary" size="mini">
            批量操作<i class="el-icon-arrow-down el-icon--right"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text" style="padding:0" @click="onWorkSelectedList">失效</el-button>
              <span>/</span>
              <el-button type="text" style="padding:0" @click="onRestSelectedList">激活</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
      <el-pagination
        :current-page="query.pageNo"
        :page-size="query.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"/>
    </div>

    <!-- 新建/编辑/查看 优惠券 -->
    <coupon
      :visible.sync="createDialog.visible"
      :title="createDialog.title"
      :mode="createDialog.mode"
      :id="createDialog.id"
      @save="saved"
      @close="closed"></coupon>
  </div>
</template>

<script>
import { listCoupon, deleteCoupon, updateCouponStatus, queryCouponById } from '@/api/coupon'
import { detailByIds } from '@/api/goods'
import Coupon from './components/coupon'
import DialogData from './components/coupon.model'

export default {
  name: 'Stock',
  filters: {
    statusType(val) {
      switch (val) {
        case 0: return '失效'
        case 1: return '正常'
      }
    },
    typeFormat(val) {
      switch (val) {
        case 1: return '优惠券'
        case 2: return '抢购券'
      }
    }
  },
  components: {
    coupon: Coupon
  },
  data() {
    return {
      query: {
        title: '',
        status: '',
        limit: 20,
        pageNo: 1
      },
      createDialog: {
        visible: false,
        title: '编辑优惠券',
        mode: 'create',
        info: undefined
      },
      // 表格列表内容
      list: [],
      total: 0,
      // 是否全选
      selectedAll: false,
      // 活动类型列表
      activityTypeList: [],
      isListLoading: false
    }
  },

  computed: {
    statusOptions() {
      return [
        { label: '失效', value: 0 },
        { label: '正常', value: 1 }
      ]
    }
  },

  async created() {
  },
  methods: {
    async refresh() {
      // 获取活动列表
      this.isListLoading = true

      const { data: { data: { items, total }}} = await listCoupon(this.query)
      this.list = items
      this.total = total

      this.isListLoading = false
    },
    async onSearch(pageNo) {
      this.isListLoading = true
      this.query.pageNo = pageNo || 1
      const { data: { data: { items, total }}} = await listCoupon(this.query)
      this.list = items
      this.total = total

      this.isListLoading = false
    },
    async parseDetail(info) {
      const { data: { data: detail }} = await queryCouponById({ id: info.id })
      this.createDialog.info = new DialogData(detail)
      // 获取限制商品的所有商品详情
      const couponSkuDoList = this.createDialog.info.couponSkuDoList
      const ids = couponSkuDoList.map(item => item.spuId)
      const { data: { data: goodsList }} = await detailByIds(ids)
      this.createDialog.info.couponSkuDoList = couponSkuDoList.map(item => {
        const goodDetail = goodsList.find(goods => goods.id === item.spuId)
        const { name, title, skuList } = goodDetail
        return Object.assign(item, { barCode: skuList[0].barCode, skuList, title, name, skuId: skuList[0].id, categorySku: `G_${item.spuId}`, discountPrice: item.discountPrice / 100 })
      })

      // 分类
      this.createDialog.info.categoryTitle = `C_${this.createDialog.info.categoryId}`
      this.createDialog.info.couponSkuDoList.map(coupon => {
      })
    },
    async onView(info, index) {
      this.createDialog.title = '查看优惠劵'
      this.createDialog.mode = 'view'
      this.createDialog.index = index
      this.createDialog.id = info.id
      this.createDialog.visible = true
    },
    onCreate() {
      this.createDialog.title = '新建优惠劵'
      this.createDialog.mode = 'create'
      this.createDialog.index = this.list.length
      this.createDialog.id = ''
      this.createDialog.visible = true
    },
    async onEdit(info, index) {
      this.createDialog.title = '编辑优惠劵'
      this.createDialog.mode = 'edit'
      this.createDialog.index = index
      this.createDialog.id = info.id
      this.createDialog.visible = true
    },
    async onFreeze(info) {
      const status = 0
      await updateCouponStatus({ id: info.id, status })
      info.status = status
    },
    async onActive(info) {
      const status = 1
      await updateCouponStatus({ id: info.id, status })
      info.status = status
    },
    async onDelete(info, index) {
      if (await this.$confirm('此操作将永久删除该优惠卷' + info.title + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })) {
        await deleteCoupon({ id: info.id })
        this.list.splice(index, 1)
        this.$notify.success({ title: '成功', message: '删除优惠券成功' })
      }
    },
    onSelectRow(rows) {
      this.seteletedRows = rows
    },
    onSelectAll() {
      this.$refs.list.toggleAllSelection()
    },
    onSizeChange(val) {
      this.query.limit = val
      this.onSearch()
    },
    onCurrentChange(val) {
      this.query.pageNo = val
      this.onSearch(this.query.pageNo)
    },
    async saved() {
      this.createDialog.visible = false
      await this.onSearch()
    },
    closed() {
      this.createDialog.visible = false
    }
  }
}
</script>
<style scoped>
.page {
  margin-top: 10px;
}

.leftbar {
  float: left;
  margin-right: 30px;
}

.dateList {
  display: flex;
}

.gap {
  margin-left: 10px;
}

.el-select {
  width: 100%;
}

.tableBox {
  padding: 10px 10px 40px 10px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}

</style>

