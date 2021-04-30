<template>
  <div class="main">
    <el-input
      v-model="query.name"
      style="width:150px"
      clearable
      placeholder="请输入配送员姓名"/>
    <el-input
      v-model="query.phone"
      style="width:180px"
      clearable
      placeholder="请输入配送员联系电话"/>
    <el-select v-model="query.state" style="width:120px" placeholder="请选择状态" clearable filterable>
      <el-option
        v-for="item in stateOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select v-model="query.workState" style="width:110px" placeholder="开工状态" clearable filterable>
      <el-option
        v-for="item in workOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select v-model="query.storageId" style="width:120px" placeholder="请选择仓库" clearable filterable>
      <el-option
        v-for="item in storageOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>

    <el-button type="primary" @click="onSearch">查询</el-button>
    <el-button type="primary" @click="onCreate">创建</el-button>

    <!-- 表格内容 -->
    <el-table
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
        prop="id"
        align="center"
        width="120"
        label="配送员编码"/>
      <el-table-column
        prop="name"
        align="center"
        width="200"
        label="配送员姓名"/>
      <el-table-column
        align="center"
        prop="phone"
        label="联系电话"/>
      <el-table-column
        prop="storageId"
        align="center"
        label="配送仓库">
        <template slot-scope="scope">
          {{ storageMap[scope.row.storageId] }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.state | stateType }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="开工状态">
        <template slot-scope="scope">
          {{ scope.row.workState | workStateType }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="配送时间">
        <template slot-scope="scope">
          {{ scope.row.deliveryStart }}  ~ {{ scope.row.deliveryEnd }}
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
          {{ scope.row.gmtCreate | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="stockDto.frezzStock"
        align="center"
        label="操作人"/>
      <el-table-column
        width="100"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button v-show="scope.row.state === 1" type="text" size="mini" @click="onEdit(scope.row, scope.$index)">修改</el-button>
          <el-button v-show="scope.row.state === 1" type="text" size="mini" @click="onDisable(scope.row)">禁用</el-button>
          <el-button v-show="scope.row.state === 0" type="text" size="mini" @click="onOpen(scope.row)">启用</el-button>
          <el-button v-show="scope.row.state === 1 && scope.row.workState === 1" type="text" size="mini" @click="onRest(scope.row)">休息</el-button>
          <el-button v-show="scope.row.state === 1 && scope.row.workState === 0" type="text" size="mini" @click="onWork(scope.row)">开工</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <div class="leftbar">
        <el-checkbox v-model="selectedAll" @change="onSelectAll">全选</el-checkbox>
        <el-dropdown trigger="click">
          <el-button type="primary" size="mini">
            批量操作<i class="el-icon-arrow-down el-icon--right"/>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text" style="padding:0" @click="onWorkSelectedList">开工</el-button>
              <span>/</span>
              <el-button type="text" style="padding:0" @click="onRestSelectedList">休息</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" style="padding:0" @click="onOpenSelectedList">正常</el-button>
              <span>/</span>
              <el-button type="text" style="padding:0" @click="onDisableSelectedList">禁用</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-pagination
        :current-page="query.page"
        :page-size="query.limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

    <!-- 创建/编辑配送人员信息 -->
    <el-dialog
      :visible.sync="createDialog.visible"
      :title="createDialog.title"
      width="500px">
      <el-form ref="createDialog" :model="createDialog.info" :rules="createDialog.rules" label-position="right" label-width="100px">
        <el-form-item prop="name" label="配送员姓名">
          <el-input v-model="createDialog.info.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系电话">
          <el-input v-model="createDialog.info.phone" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item prop="name" label="配送周期">
          <el-checkbox-group v-model="createDialog.info.weekNumberIds" @change="onChanged">
            <el-checkbox label="周一"></el-checkbox>
            <el-checkbox label="周二"></el-checkbox>
            <el-checkbox label="周三"></el-checkbox>
            <el-checkbox label="周四"></el-checkbox>
            <el-checkbox label="周五"></el-checkbox>
            <el-checkbox label="周六"></el-checkbox>
            <el-checkbox label="周日"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="date" label="配送时间">
          <div class="dateList">
            <el-time-select
              v-model="createDialog.info.deliveryStart"
              :picker-options="{ start: '00:00', step: '00:15', end: '24:00' }"
              placeholder="起始时间">
            </el-time-select>
            <el-time-select
              v-model="createDialog.info.deliveryEnd"
              :picker-options="{ start: '00:00', step: '00:15', end: '24:00', minTime: startTime }"
              placeholder="结束时间">
            </el-time-select>
          </div>
        </el-form-item>
        <el-form-item prop="storageId" label="配送仓库">
          <el-select v-model="createDialog.info.storageId" placeholder="请选择仓库" clearable filterable>
            <el-option
              v-for="item in storageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchRiderList,
  createRider,
  editRider,
  getDetailById,
  updateStateToAbort,
  updateBusinessWorkState,
  updateStateToNomral,
  updateBusinessStateToRest
} from '@/api/rider'
import { getEntrepotList } from '@/api/entrepot'
import { parseTime, deepClone } from '@/utils'

const num2TextMap = {
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
  7: '周日'
}
const text2NumMap = {
  '周一': 1,
  '周二': 2,
  '周三': 3,
  '周四': 4,
  '周五': 5,
  '周六': 6,
  '周日': 7
}

class DialogData {
  constructor(raw = {}) {
    this.id = raw.id || ''
    this.name = raw.name || ''
    this.phone = raw.phone || ''
    this.weekNumberIds = (raw.weekNumberIds || []).map(item => num2TextMap[item])
    this.storageId = raw.storageId || ''
    this.deliveryStart = raw.deliveryStart || ''
    this.deliveryEnd = raw.deliveryEnd || ''
  }
}
export default {
  name: 'Stock',
  filters: {
    stateType(val) {
      if (!val) {
        return '禁用'
      } else {
        return '正常'
      }
    },
    workStateType(val) {
      if (!val) {
        return '休息'
      } else {
        return '开工'
      }
    },
    dateFormat(val) {
      return parseTime(val)
    }
  },
  data() {
    return {
      // 查询条件
      query: {
        state: '',
        workState: '',
        storageId: '',
        type: 1,
        limit: 20,
        phone: '',
        page: 1
      },
      // 表格列表内容
      list: [],
      total: 0,
      // 创建/编辑配送员信息弹窗
      createDialog: {
        title: '创建配送员',
        visible: false,
        mode: 'create',
        info: new DialogData(),
        index: 0,
        rules: {
          // name: { required: true, message: '请输入配送员姓名', trigger: 'blur' },
          // phone: { required: true, message: '请输入手机号', trigger: 'blur' },
          // weekNumberIds: { required: true, message: '请选择配送周期', trigger: 'blur' },
          // date: { required: true, message: '请输入配送时间 ', trigger: 'blur' },
          // storageId: { required: true, message: '请输入仓库 ', trigger: 'blur' }
        }
      },
      // 仓库列表
      storageList: [],
      // 已选配送人员列表
      seteletedRows: [],
      // 是否全选
      selectedAll: false,
      // 仓库map
      storageMap: {}
    }
  },

  computed: {
    stateOptions() {
      return [
        { label: '正常', value: 1 },
        { label: '禁用', value: 0 }
      ]
    },
    workOptions() {
      return [
        { label: '休息中', value: 0 },
        { label: '开工中', value: 1 }
      ]
    },
    storageOptions() {
      return this.storageList.map((storage) => ({ label: storage.name, value: storage.id }))
    }
  },

  async created() {
    // 获取前置仓列表
    const { data: { data: { items: storageList }}} = await getEntrepotList()
    this.storageList = storageList
    this.storageList.forEach(storage => {
      this.storageMap[storage.id] = storage.name
    })
    // 获取配送员列表
    const { data: { data: { items, total }}} = await fetchRiderList()
    this.list = items
    this.total = total
  },
  methods: {
    onChanged() {
    },
    onChangTime([start, end]) {
      this.createDialog.info.deliveryStart = parseTime(start)
      this.createDialog.info.deliveryEnd = parseTime(end)
    },
    async onSearch() {
      this.query.page = 1
      const { data: { data: { items, total }}} = await fetchRiderList(this.query)
      this.list = items
      this.total = total
    },
    onCreate() {
      this.createDialog.title = '创建配送员'
      this.createDialog.mode = 'create'
      this.createDialog.index = this.list.length
      this.createDialog.info = new DialogData()
      this.createDialog.visible = true
    },
    async onEdit(info, index) {
      this.createDialog.index = index
      const { data: { data: rider }} = await getDetailById(info.id)
      this.createDialog.title = '编辑配送员信息'
      this.createDialog.mode = 'edit'
      this.createDialog.info = new DialogData(rider)
      this.createDialog.visible = true
    },
    async onDisable(rider) {
      await updateStateToAbort([rider.id])
      rider.state = 0
    },
    async onOpen(rider) {
      await updateStateToNomral([rider.id])
      rider.state = 1
    },
    async onRest(rider) {
      await updateBusinessStateToRest([rider.id])
      rider.workState = 0
    },
    async onWork(rider) {
      await updateBusinessWorkState([rider.id])
      rider.workState = 1
    },
    async onDisableSelectedList() {
      await updateStateToAbort(this.seteletedRows.map(item => item.id))
      this.seteletedRows.forEach(item => {
        item.state = 0
      })
    },
    async onOpenSelectedList() {
      await updateStateToNomral(this.seteletedRows.map(item => item.id))
      this.seteletedRows.forEach(item => {
        item.state = 1
      })
    },
    async onRestSelectedList() {
      await updateBusinessStateToRest(this.seteletedRows.map(item => item.id))
      this.seteletedRows.forEach(item => {
        item.workState = 0
      })
    },
    async onWorkSelectedList() {
      await updateBusinessWorkState(this.seteletedRows.map(item => item.id))
      this.seteletedRows.forEach(item => {
        item.workState = 1
      })
    },
    onSelectRow(rows) {
      this.seteletedRows = rows
    },
    onSelectAll() {
      this.$refs.list.toggleAllSelection()
    },
    async onSave() {
      this.$refs.createDialog.validate(async(valid) => {
        // 转换配送周期
        const data = deepClone(this.createDialog.info)
        data.weekNumberIds = data.weekNumberIds.map(date => (text2NumMap[date]))
        delete data.date
        if (valid) {
          try {
            if (this.createDialog.mode === 'create') {
              const { data: { data: rider }} = await createRider(data)
              this.list.push(rider)
            } else {
              const { data: { data: rider }} = await editRider(data)
              const i = this.createDialog.index
              this.list.splice(i, 1, Object.assign(this.list[i], rider))
            }
            this.createDialog.visible = false
          } catch (response) {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.main {
  padding: 20px;
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

