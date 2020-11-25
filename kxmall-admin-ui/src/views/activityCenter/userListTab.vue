<template>
  <div class="main">
    <el-input
      v-model="query.name"
      style="width:240px"
      clearable
      placeholder="请输入用户昵称"/>
    <el-input
      v-model="query.activityName"
      style="width:240px"
      clearable
      placeholder="请输入活动名称"/>
    <el-select v-model="query.activityType" style="width:150px" clearable filterable placeholder="请选择活动类型">
      <el-option
        v-for="item in activityTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>

    <el-button type="primary" @click="onSearch">查询</el-button>

    <!-- 表格内容 -->
    <el-table
      ref="list"
      :data="list"
      border
      style="width: 100%; margin-top:20px">
      <el-table-column
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        prop="userDTO.nickname"
        align="center"
        width="120"
        label="用户">
        <template slot-scope="scope">
          <div>{{ scope.row.userDTO.nickname }}</div>
          <div>{{ scope.row.userDTO.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="couponAdminDTO.title"
        align="center"
        width="200"
        label="优惠名称"/>
      <el-table-column
        align="center"
        prop="couponAdminDTO.a"
        label="优惠类型"/>
      <el-table-column
        align="center"
        label="获得优惠时间">
        <template slot-scope="scope">
          {{ scope.row.gmtStart | dateFormat }} ~ {{ scope.row.gmtEnd | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="剩余优惠时间">
        <template slot-scope="scope">
          {{ scope.row | diffDateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="优惠使用状态">
        <template slot-scope="scope">
          {{ scope.row | useType }}
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        :current-page="query.page"
        :page-size="query.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"/>
    </div>
  </div>

</template>

<script>
import { fetchUserList, getActivityTypeEnums } from '@/api/activityCenter'
import { parseTime } from '@/utils'

export default {
  name: 'UserListTab',
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
        page: 1
      },
      // 表格列表内容
      list: [],
      total: 0,
      activityTypeList: []
    }
  },

  computed: {
    activityTypeOptions() {
      return this.activityTypeList.map(a => ({ label: a.msg, value: a.code }))
    }
  },

  async created() {

  },
  methods: {
    async refresh() {
      // 获取活动列表
      const { data: { data: { items, total }}} = await fetchUserList()
      this.list = items
      this.total = total

      const { data: { data: activityTypeList }} = await getActivityTypeEnums()
      this.activityTypeList = activityTypeList
    },
    async onSearch(page) {
      this.query.page = 1
      const { data: { data: { items, total }}} = await fetchUserList(this.query)
      this.list = items
      this.total = total
    },
    onSizeChange(val) {
      this.query.limit = val
      this.onSearch()
    },
    onCurrentChange(val) {
      this.query.page = val
      this.onSearch(this.query.page)
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

