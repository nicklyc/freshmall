<template>
  <div>
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="仓库授权" name="storageEmpower">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="kw" placeholder="关键词搜索" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="storeSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="storageTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @select="userSelect"
          @select-all="userSelectAll"
          @selection-change="userSelected">
          <el-table-column
            type="selection"
            align="center"
            width="55">
          </el-table-column>
          <el-table-column
            label="仓库Id"
            align="center"
            prop="id"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="仓库名称"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="state"
            align="center"
            label="仓库状态"
          >
          </el-table-column>
        </el-table>
        <div style="margin-top:10px;">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
        <div class="dialog-footer" style="margin-top:10px;text-align:right;">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button :loading="sureDialogLoading" type="primary" @click="sureDialog">确 定</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待开发" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { storagePermissionSet, getStoragePermissionSet } from '@/api/role'
import { getEntrepotList } from '@/api/entrepot'
export default{
  props: {
    dialogRoleId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeTab: 'storageEmpower',
      kw: '',
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      hasSelectList: [], // 已经选择的仓库id组成的数组
      sureDialogLoading: false
    }
  },
  created() {
    this.getRoleStorageId()
    this.getList({ page: 1, limit: 5 })
  },
  methods: {
    async getRoleStorageId() {
      const roleStorageData = await getStoragePermissionSet({ roleId: this.dialogRoleId })
      this.hasSelectList = roleStorageData.data.data ? roleStorageData.data.data : []
    },
    async getList(obj) {
      const res = await getEntrepotList(obj)
      this.total = res.data.data.total
      this.tableData = res.data.data.items
      this.$nextTick(() => {
        this.tableData.forEach(row => {
          if (this.hasSelectList.indexOf(row.id) >= 0) {
            this.$refs.storageTable.toggleRowSelection(row, true)
          }
        })
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList({
        name: this.kw,
        page: this.currentPage,
        limit: val
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList({
        name: this.kw,
        page: val,
        limit: this.pageSize
      })
    },
    handleClick(tab, event) {

    },
    storeSearch() {
      /* 将页码初始化为1 */
      this.currentPage = 1
      this.getList({
        name: this.kw,
        page: this.currentPage,
        limit: this.pageSize
      })
    },
    userSelected(data) {
      // console.log(data)
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    addOrReduceArray(origin, item, type) {
      // 参数一 为原数组  参数二 是目标数组  参数三 0为减 1 为加
      const index = origin.indexOf(item)
      if (type === 1 && index === -1) {
        origin.push(item)
      }
      if (type === 0 && index !== -1) {
        origin.splice(index, 1)
      }
    },
    userSelect(rows, row) {
      const selected = rows.length && rows.indexOf(row) !== -1
      // TODO  用户选中或者取消选中时对 this.hasSelectList 进行增减 之后也用这个值返回后台
      this.addOrReduceArray(this.hasSelectList, row.id, +selected)
    },
    userSelectAll(rows) {
      if (rows.length > 0) {
        rows.forEach(item => {
          this.addOrReduceArray(this.hasSelectList, item.id, 1)
        })
      }
      if (rows.length === 0) {
        this.tableData.forEach(item => {
          this.addOrReduceArray(this.hasSelectList, item.id, 0)
        })
      }
    },
    async sureDialog() {
      // this.sureDialogLoading = true
      const data = {
        storageIdList: this.hasSelectList,
        roleId: this.dialogRoleId
      }
      const res = await storagePermissionSet(data)
      // this.sureDialogLoading = false
      if (res.data.errno === 200) {
        this.$notify.success({
          title: '提示',
          message: '保存成功',
          showClose: true
        })
        this.closeDialog()
      }
    }
  }
}
</script>
<style scoped>

</style>
