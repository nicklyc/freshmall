<template>
  <div class="editActivity">
    <el-form ref="editActivity" :model="info" :rules="rules" label-position="right" label-width="120px">
      <el-form-item prop="title" label="活动名称">
        <el-input v-model="info.title" clearable style="width: 220px" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="activityType" label="活动类型">
        <el-select v-model="info.activityType" style="width:220px" clearable filterable placeholder="请选择活动类型">
          <el-option
            v-for="item in activityTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="qualifyList" label="参与资格">
        <el-row type="flex">
          <el-checkbox-group v-model="info.qualifyList" style="display: inline-block">
            <el-checkbox v-for="item in qualifyOptions" :key="item.label" :label="item.value" style="display: inline-block; margin-right: 10px">{{ item.label }}</el-checkbox>
          </el-checkbox-group>
          <el-tooltip class="item" effect="dark" content="指成功邀请注册成功人数" placement="top-end">
            <el-form-item prop="pullNum">
              <el-input v-model="info.pullNum" clearable placeholder="请输入拉新人数" style="width: 150px"></el-input>
            </el-form-item>
          </el-tooltip>
        </el-row>
      </el-form-item>
      <el-form-item prop="limit" label="参与次数限制">
        <el-tooltip class="item" effect="dark" content="每个用户参与活动的次数" placement="top-end">
          <el-input v-model="info.limit" clearable style="width: 220px" autocomplete="off"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="活动有效期">
        <div class="dateList">
          <el-form-item prop="activityStartTime">
            <el-date-picker
              :picker-options="startDate"
              v-model="info.activityStartTime"
              type="date"
              placeholder="起始时间">
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="activityEndTime">
            <el-date-picker
              :picker-options="endDate"
              v-model="info.activityEndTime"
              type="date"
              placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item prop="remark" label="活动说明">
        <el-input v-model="info.remark" clearable rows="5" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="活动关联优惠" prop="activityCounponDO">
        <div class="tableBox">
          <el-button size="mini" type="primary" @click="onSelectCouponList">添加</el-button>
          <el-table
            v-loading="isListLoading"
            ref="couponList"
            :data="info.activityCounponDO"
            border
            style="width: 100%; margin-top:20px"
            @selection-change="onSelectCouponRow">
            <el-table-column
              type="selection"
              align="center"
              width="55"/>
            <el-table-column
              prop="title"
              align="center"
              label="券名称">
            </el-table-column>
            <el-table-column
              align="center"
              prop="description"
              label="介绍">
            </el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="券类型">
              <template slot-scope="scope">
                {{ scope.row.type | typeFormat }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="140"
              prop="minMoney"
              label="最低消费">
              <template slot-scope="scope">
                <el-input v-model="scope.row.minMoney" clearable autocomplete="off">
                  <template slot="append">元</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="numLimit"
              align="center"
              label="每日限量(0表示不限量)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.numLimit" clearable autocomplete="off"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="120"
              prop="manLimit"
              label="每人限量(0表示不限量)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.manLimit" clearable autocomplete="off"></el-input>
              </template>
            </el-table-column>

            <el-table-column
              width="100"
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="onViewCoupon(scope.row, scope.$index)">查看</el-button>
                <el-button type="text" size="mini" @click="onDeleteCoupon(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="leftbar">
            <el-checkbox v-model="selectedAll" @change="onSelectAll">全选</el-checkbox>
            <el-dropdown trigger="click">
              <el-button type="primary" size="mini">
                批量操作<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="text" style="padding:0" @click="onDeleteSelectedCouponList">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-form-item>

      <el-form-item prop="url" label="活动链接">
        <el-row type="flex">
          <el-input v-model="info.url" clearable autocomplete="off"></el-input>
          <el-button style="margin-left: 10px" size="mini" type="primary" @click="onGenerateLinkes">生成链接</el-button>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </div>

    <!-- 选择优惠券弹窗 -->
    <el-dialog
      :visible.sync="selectDialog.visible"
      :title="selectDialog.title"
      width="1000px">
      <el-input
        v-model="selectDialog.query.title"
        style="width:240px"
        clearable
        placeholder="请输入活动券名称/ID"/>
      <el-select v-model="selectDialog.query.status" clearable filterable style="width:150px" placeholder="请选择状态">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>

      <el-button type="primary" @click="onSearchCouponOnDialog">查询</el-button>

      <el-table
        ref="couponListOnDialog"
        :data="selectDialog.list"
        border
        style="width: 100%; margin-top:20px"
        @selection-change="onSelectCouponRowOnDialog">
        <el-table-column
          type="selection"
          align="center"
          width="55"/>
        <el-table-column
          prop="id"
          align="center"
          label="活动券ID">
        </el-table-column>
        <el-table-column
          prop="title"
          align="center"
          label="券名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="介绍">
        </el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="券类型">
          <template slot-scope="scope">
            {{ scope.row.type | typeFormat }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="discount"
          label="满减金额">
        </el-table-column>
        <el-table-column
          align="center"
          prop="min"
          label="最低消费">
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          :current-page="selectDialog.query.pageNo"
          :page-size="selectDialog.query.limit"
          :total="selectDialog.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"/>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="onSaveOnDialog">确 定</el-button>
      </div>
    </el-dialog>

    <coupon
      :visible.sync="createDialog.visible"
      :title="createDialog.title"
      :mode="createDialog.mode"
      :id="createDialog.id"
      @close="createDialog.visible = false"></coupon>
  </div>
</template>

<script>

import { deepClone } from '@/utils'
import { createActivity, getActivityTypeEnums, editActivity, queryActivityById, generateLinkes } from '@/api/activityCenter'
import { listCoupon, queryCouponByIds } from '@/api/coupon'
import CouponComponent from './components/coupon'

class Coupon {
  constructor(raw = {}) {
    this.id = raw.id || ''
    this.activityId = raw.activityId || ''
    this.title = raw.title || ''
    this.remark = raw.remark || ''
    this.type = raw.type || ''
    this.couponId = raw.couponId || ''
    this.minMoney = raw.minMoney || 0
    this.numLimit = raw.numLimit || 0
    this.manLimit = raw.manLimit || 0
    this.description = raw.description || ''
  }
}

class ActivityData {
  constructor(raw = {}) {
    this.title = raw.title || ''
    this.activityType = raw.activityType || 1
    this.activityStartTime = raw.activityStartTime || ''
    this.activityEndTime = raw.activityEndTime || ''
    this.remark = raw.remark || ''
    this.activityCounponDO = (raw.activityCounponDO || []).map(a => new Coupon(a))
    this.id = raw.id || ''
    this.qualifyNew = raw.qualifyNew || ''
    this.qualifyOld = raw.qualifyOld || ''
    this.pullNew = raw.pullNew || ''
    this.pullNum = raw.pullNum || ''
    this.limit = raw.limit || 0
    this.url = raw.url || ''

    /* 前端专用字段 */
    this.qualifyList = []
    if (Number(raw.qualifyNew) === 1) {
      this.qualifyList.push(1)
    }
    if (Number(raw.qualifyOld) === 1) {
      this.qualifyList.push(2)
    }
    if (Number(raw.pullNew) === 1) {
      this.qualifyList.push(3)
    }
  }
}

export default {
  name: 'EditActivity',
  filters: {
    typeFormat(val) {
      switch (val) {
        case 1: return '优惠券'
        case 2: return '抢购券'
      }
    }
  },
  components: {
    coupon: CouponComponent
  },
  data() {
    return {
      title: '',
      createDialog: {
        visible: false,
        title: '查看优惠券',
        mode: 'view',
        info: undefined
      },
      // create / edit
      mode: 'create',
      info: new ActivityData(),
      index: 0,
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 16, message: '名称不能大于16个字符' }
        ],
        qualifyList: [
          { required: true, message: '请选择参与资格', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value.length === 0) {
              callback('请选择参与资格')
            } else {
              callback()
            }
          } }
        ],
        pullNum: [
          { validator: (rule, value, callback) => {
            if (this.info.qualifyList.includes(3) && !value) {
              callback('请填写拉新人数')
            } else {
              callback()
            }
          } }
        ],
        limit: [
          { required: true, message: '请输入参与次数限制', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '请输入整数' }
        ],
        activityStartTime: [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        activityEndTime: [
          { required: true, message: '请选择结束日期', trigger: 'blur' }
        ],
        activityCounponDO: [
          { required: true, message: '请选择关联优惠', trigger: 'blur' },
          { validator: (rule, list, callback) => {
            if (!list.length) {
              callback('请选择关联优惠')
              return
            }

            function isNull(value) {
              return !value && value !== '0' && value !== 0
            }

            const hasNull = list.find(item => isNull(item.minMoney) || isNull(item.numLimit) || isNull(item.manLimit))
            if (hasNull) {
              callback('关联优惠的最低消费、每日限量、每人限领的值不能有空')
              return
            }
            callback()
          } }
        ]
      },
      selectedList: [],
      // 活动类型列表
      activityTypeList: [],
      // 是否全选
      selectedAll: false,
      selectDialog: {
        title: '选择优惠券',
        visible: false,
        mode: 'create',
        list: [],
        selectedList: [],
        total: 0,
        query: {
          title: '',
          type: '',
          limit: 20,
          pageNo: 1
        }
      }
    }
  },

  computed: {
    activityTypeOptions() {
      return this.activityTypeList.map(a => ({ label: a.msg, value: a.code }))
    },
    statusOptions() {
      return [
        { label: '失效', value: 0 },
        { label: '正常', value: 1 }
      ]
    },
    qualifyOptions() {
      return [
        { label: '新注册用户', value: 1 },
        { label: '老用户', value: 2 },
        { label: '拉新', value: 3 }
      ]
    },
    startDate() {
      return {
        disabledDate: date => {
          console.error(date.getTime(), new Date().getTime())
          return date.getTime() <= new Date().getTime() - 24 * 3600 * 1000
        }
      }
    },
    endDate() {
      return {
        disabledDate: date => {
          return date.getTime() <= new Date(this.info.activityStartTime).getTime() - 24 * 3600 * 1000
        }
      }
    }
  },

  async created() {
    this.isListLoading = true

    this.mode = this.$route.query.mode
    const id = this.$route.query.id
    if (this.mode === 'edit' && id) {
      const { data: { data: detail }} = await queryActivityById(id)

      const couponIds = detail.activityCounponDO.map(item => item.couponId)
      const { data: { data: couponDetailList }} = await queryCouponByIds(couponIds)
      const newActivityCounponDO = detail.activityCounponDO.map(activity => {
        const couponDetail = couponDetailList.find(coupon => coupon.id === activity.couponId)
        if (couponDetail) {
          const { title, description, type } = couponDetail
          return Object.assign(activity, { title, description, type })
        } else {
          return activity
        }
      })
      detail.activityCounponDO = newActivityCounponDO
      this.info = new ActivityData(detail)
    } else {
      this.info = new ActivityData()
    }

    const { data: { data: activityTypeList }} = await getActivityTypeEnums()
    this.activityTypeList = activityTypeList

    this.isListLoading = false
  },
  methods: {
    onDeleteCoupon(_, index) {
      this.info.activityCounponDO.splice(index, 1)
    },
    onViewCoupon(info, index) {
      debugger
      this.createDialog.title = '查看优惠劵'
      this.createDialog.mode = 'view'
      this.createDialog.id = info.couponId
      this.createDialog.visible = true
      // TODO
    },
    onSelectCouponRow(rows) {
      this.info.selectedList = rows
    },
    onSelectAllCoupon() {
      this.$refs.couponList.toggleAllSelection()
    },
    onDeleteSelectedCouponList() {
      this.info.activityCounponDO = this.info.activityCounponDO.filter((coupon) => !this.info.selectedList.includes(coupon))
    },
    async onSelectCouponList() {
      this.selectDialog.isListLoading = true

      this.selectDialog.title = '选择优惠劵'
      this.selectDialog.mode = 'create'
      const { data: { data: { items, total }}} = await listCoupon(this.selectDialog.query)
      this.selectDialog.list = items
      this.selectDialog.total = total
      this.selectDialog.visible = true
      this.selectDialog.isListLoading = false
    },
    async onSearchCouponOnDialog(pageNo) {
      this.selectDialog.isListLoading = true
      this.selectDialog.query.pageNo = pageNo || 1
      const { data: { data: { items, total }}} = await listCoupon(this.selectDialog.query)
      this.selectDialog.list = items
      this.selectDialog.total = total
      this.selectDialog.isListLoading = false
    },
    onSelectCouponRowOnDialog(rows) {
      this.selectDialog.selectedList = rows
    },
    onSaveOnDialog() {
      debugger
      const list = this.selectDialog.selectedList.map(a => new Coupon(Object.assign(a, { activityId: this.info.id, minMoney: a.min, couponId: a.id, id: '' })))
      this.$nextTick(() => {
        this.info.activityCounponDO.push(...list)
        this.selectDialog.selectedList = []
        this.selectDialog.visible = false
      })
    },
    async onGenerateLinkes() {
      const { data: { data: url }} = await generateLinkes(this.info.activityType)
      this.info.url = url
    },
    onCancel() {
      this.$router.push({ name: 'activityList' })
      this.$refs.editActivity.resetFields()
      this.$refs.editActivity.clearValidate()
    },
    async onSave() {
      this.$refs.editActivity.validate(async(valid) => {
        // 参数转换
        const data = deepClone(this.info)
        data.activityStartTime = new Date(this.info.activityStartTime).getTime()
        data.activityEndTime = new Date(this.info.activityEndTime).getTime()
        data.activityCounponDO.forEach(coupon => {
          data.minMoney = data.minMoney * 100
        })
        data.qualifyNew = data.qualifyList.includes(1) ? 1 : 0
        data.qualifyOld = data.qualifyList.includes(2) ? 1 : 0
        data.pullNew = data.qualifyList.includes(3) ? 1 : 0

        if (valid) {
          try {
            if (this.mode === 'create') {
              await createActivity(data)
            } else {
              await editActivity(data)
            }
            this.$router.push({ name: 'activityList' })
            this.$refs.editActivity.resetFields()
            this.$refs.editActivity.clearValidate()
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
    },
    onSizeChange(val) {
      this.selectDialog.query.limit = val
      this.onSearchCouponOnDialog()
    },
    onCurrentChange(val) {
      this.selectDialog.query.pageNo = val
      this.onSearchCouponOnDialog(this.selectDialog.query.pageNo)
    }
  }
}
</script>
<style scoped>
.editActivity {
  padding: 10px
}

.leftbar {
  float: left;
  margin-right: 30px;
}

.dateList {
  display: flex;
}

.dateList > div {
  margin-right: 10px
}

.tableBox {
  padding: 10px 10px 40px 10px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

</style>

