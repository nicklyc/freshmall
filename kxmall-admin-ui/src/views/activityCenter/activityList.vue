<template>
  <div class="main">
    <el-input
      v-model="query.title"
      clearable
      style="width:200px"
      placeholder="请输入活动名称"/>
    <el-select v-model="query.activityType" style="width:150px" clearable filterable placeholder="请选择活动类型">
      <el-option
        v-for="item in activityTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select v-model="query.status" style="width:150px" clearable filterable placeholder="请选择活动状态">
      <el-option
        v-for="item in statusOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-date-picker
      v-model="query.activityStartTime"
      style="width:150px"
      type="date"
      placeholder="活动开始日期">
    </el-date-picker>
    <el-date-picker
      v-model="query.activityEndTime"
      style="width:150px"
      type="date"
      placeholder="活动结束日期">
    </el-date-picker>

    <el-button type="primary" @click="onSearch()">查询</el-button>
    <el-button type="primary" @click="onCreate">新建</el-button>

    <!-- 表格内容 -->
    <el-table
      v-loading="isListLoading"
      ref="list"
      :data="list"
      border
      style="width: 100%; margin-top:20px"
      @selection-change="onSelectRow">
      <el-table-column
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        prop="title"
        align="center"
        width="120"
        label="活动名称"/>
      <el-table-column
        align="center"
        width="100"
        label="活动类型">
        <template slot-scope="scope">
          {{ activityTypeMap[scope.row.activityType] }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="effectiveDate"
        label="活动有效期">
        <template slot-scope="scope">
          {{ scope.row.activityStartTime | dateFormat }} ~ {{ scope.row.activityEndTime | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        width="100"
        align="center"
        label="活动状态">
        <template slot-scope="scope">
          {{ scope.row.status | statusType }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建/修改人">
        <template slot-scope="scope">
          {{ (scope.row.adminDTO || {}).username }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="修改时间">
        <template slot-scope="scope">
          {{ scope.row.gmtUpdate | dateFormat }}
        </template>
      </el-table-column>

      <el-table-column
        width="100"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="onEdit(scope.row, scope.$index)">详情</el-button>
          <el-button type="text" size="mini" @click="onEdit(scope.row, scope.$index)">修改</el-button>
          <el-button v-show="scope.row.status === 1" type="text" size="mini" @click="onDisable(scope.row)">失效</el-button>
          <el-button v-show="scope.row.status === 0 " type="text" size="mini" @click="onOpen(scope.row)">激活</el-button>
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
import { fetchActivityList, updateStatusActivityStatus, getActivityTypeEnums } from '@/api/activityCenter'
import { parseTime } from '@/utils'

export default {
  name: 'ActivityList',
  filters: {
    statusType(val) {
      switch (val) {
        case 0: return '失效'
        case 1: return '正常'
        case 2: return '到期'
      }
    },
    dateFormat(val) {
      return parseTime(val)
    }
  },
  data() {
    return {
      query: {
        activityType: '',
        status: '',
        activityStartTime: '',
        activityEndTime: '',
        limit: 20,
        page: 1
      },
      // 表格列表内容
      list: [],
      total: 0,
      // 是否全选
      selectedAll: false,
      // 活动类型列表
      activityTypeList: []
    }
  },

  computed: {
    activityTypeOptions() {
      return this.activityTypeList.map(a => ({ label: a.msg, value: a.code }))
    },
    activityTypeMap() {
      return this.activityTypeOptions.reduce((obj, item) => {
        return Object.assign(obj, { [item.value]: item.label })
      }, {})
    },
    statusOptions() {
      return [
        { label: '失效', value: 0 },
        { label: '正常', value: 1 },
        { label: '到期', value: 2 }
      ]
    }
  },

  async created() {
    // 获取活动列表
    this.isListLoading = true

    const { data: { data: { items, total }}} = await fetchActivityList(this.query)
    this.list = items
    this.total = total

    const { data: { data: activityTypeList }} = await getActivityTypeEnums()
    this.activityTypeList = activityTypeList
    this.isListLoading = false
  },
  methods: {
    async onSearch(page) {
      this.isListLoading = true
      this.query.page = page || 1
      const { data: { data: { items, total }}} = await fetchActivityList(this.query)
      this.list = items
      this.total = total

      this.isListLoading = false
    },
    onCreate() {
      this.$router.push({ name: 'editActivity', query: { mode: 'create', id: '' }})
    },
    async onEdit(info, index) {
      this.$router.push({ name: 'editActivity', query: { mode: 'edit', id: info.id }})
    },
    async onDisable(item) {
      const time = new Date().getTime()
      let status = null
      if (time > item.activityStartTime && time < item.activityEndTime) {
        status = 0
      } else {
        status = 2
      }
      await updateStatusActivityStatus({ id: item.id, status: 0 })
      item.status = status
    },
    async onOpen(item) {
      const status = 1
      await updateStatusActivityStatus({ id: item.id, status: 1 })
      item.status = status
    },
    // 后台缺少批量编辑的操作
    // async onDisableSelectedList() {
    //   await updateStatusActivityStatus(this.seteletedRows.map(item => item.id))
    //   this.seteletedRows.forEach(item => {
    //     item.status = 0
    //   })
    // },
    // 后台缺少批量编辑的操作
    // async onOpenSelectedList() {
    //   await updateStatusActivityStatus(this.seteletedRows.map(item => item.id))
    //   this.seteletedRows.forEach(item => {
    //     item.status = 1
    //   })
    // },
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
      this.query.page = val
      this.onSearch(this.query.page)
    }
  }
}
</script>
<style scoped>
.main {
  padding: 10px;
}
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

