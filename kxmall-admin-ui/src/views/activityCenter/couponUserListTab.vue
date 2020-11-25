<template>
  <div class="main">
    <el-input
      v-model="query.name"
      style="width:240px"
      clearable
      placeholder="请输入用户昵称/手机号"/>
    <el-input
      v-model="query.activityName"
      style="width:240px"
      clearable
      placeholder="请输入活动券名称"/>
    <el-select v-model="query.activityType" style="width:150px" clearable filterable placeholder="请选择关联活动">
      <el-option
        v-for="item in typeOptionss"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>

    <el-button type="primary" @click="onSearch()">查询</el-button>

    <!-- 表格内容 -->
    <el-table
      v-loading="isListLoading"
      ref="list"
      :data="list"
      border
      element-loading-text="正在查询中。。。"

      style="width: 100%; margin-top:20px">
      <el-table-column
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        align="center"
        width="120"
        label="用户">
        <template slot-scope="scope">
          <div>{{ (scope.row.userDO || {}).nickname }}</div>
          <div>{{ (scope.row.userDO || {}).phone }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="activityDO.title"
        align="center"
        width="200"
        label="关联活动"/>
      <el-table-column
        align="center"
        prop="couponDO.title"
        label="活动券名称"/>
      <el-table-column
        align="center"
        label="券类型">
        <template slot-scope="scope">
          <div>{{ scope.row.couponDO.type | typeFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        align="center"
        label="获得时间">
        <template slot-scope="scope">
          <div>{{ scope.row.gmtStart | dateFormat }}</div>
          <div>{{ scope.row.gmtEnd | dateFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="券剩余时间">
        <template slot-scope="scope">
          {{ scope.row | diffDateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="使用状态">
        <template slot-scope="scope">
          {{ scope.row | useType }}
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :current-page="query.pageNo"
        :page-size="query.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"/>
    </div>
  </div>

</template>

<script>
import { queryUserCouponByList } from '@/api/coupon'
import { parseTime } from '@/utils'

export default {
  name: 'CouponUserListTab',
  filters: {
    useType({ orderId, gmtEnd }) {
      if (orderId) {
        return '已使用'
      } else if (new Date().getTime() - gmtEnd > 0) {
        return '过期未使用'
      } else {
        return '未使用'
      }
    },
    typeFormat(val) {
      switch (val) {
        case 1: return '优惠券'
        case 2: return '抢购券'
      }
    },
    dateFormat(val) {
      return parseTime(val)
    },
    diffDateFormat({ gmtStart, gmtEnd }) {
      const diff = (new Date(gmtEnd) - new Date(gmtStart)) / 1000
      return `${Math.ceil(diff / 3600 / 24)}天`
    }
  },
  data() {
    return {
      query: {
        name: '',
        activityName: '',
        activityType: '',
        limit: 20,
        pageNo: 1
      },
      // 表格列表内容
      list: [],
      total: 0,
      activityTypeList: [],
      isListLoading: false
    }
  },

  computed: {
    typeOptions() {
      return [
        { label: '优惠券', value: 1 },
        { label: '抢购券', value: 1 }
      ]
    }
  },

  async created() {

  },
  methods: {
    async refresh() {
      this.isListLoading = true

      // 获取优惠券用户列表
      const { data: { data: { items, total }}} = await queryUserCouponByList(this.query)
      this.list = items
      this.total = total
      this.isListLoading = false
    },
    async onSearch(pageNo) {
      this.isListLoading = true

      this.query.pageNo = pageNo || 1
      const { data: { data: { items, total }}} = await queryUserCouponByList(this.query)
      this.list = items
      this.total = total

      this.isListLoading = false
    },
    onSizeChange(val) {
      this.query.limit = val
      this.onSearch()
    },
    onCurrentChange(val) {
      this.query.pageNo = val
      this.onSearch(this.query.pageNo)
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
  justify-content: space-between
}

</style>

