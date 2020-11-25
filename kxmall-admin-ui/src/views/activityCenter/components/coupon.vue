<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="createDialogWidth"
    @close="onClose">
    <el-form ref="createDialog" :model="info" :rules="rules" status-icon label-position="right" label-width="120px">
      <el-form-item prop="title" label="活动券名称">
        <el-input v-model="info.title" clearable autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="type" label="券类型">
        <el-select v-model="info.type" clearable filterable placeholder="请选择券类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item v-show="!isRushToPurchaseType" prop="discountType" label="优惠类型">
        <el-select v-model="info.discountType" clearable filterable placeholder="请选择优惠类型">
          <el-option
            v-for="item in discountTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="description" label="介绍">
        <el-input v-model="info.description" clearable autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-show="!isRushToPurchaseType" prop="discount" label="满减金额">
        <el-input v-model="info.discount" clearable autocomplete="off"><template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item v-show="!isRushToPurchaseType" prop="min" label="最低消费">
        <el-input v-model="info.min" clearable autocomplete="off"><template slot="append">元</template></el-input>
      </el-form-item>
      <el-form-item v-show="!isRushToPurchaseType" prop="status" label="优惠券状态">
        <el-select v-model="info.status" clearable filterable placeholder="请选择优惠券状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期">
        <div>
          <el-radio-group v-model="info.effectiveTime" style="margin-bottom: 10px" @change="onEffectiveTimeChang">
            <el-radio-button label="1">领券相对天数</el-radio-button>
            <el-radio-button label="2">指定绝对时间</el-radio-button>
          </el-radio-group>
          <el-form-item prop="days">
            <el-input v-show="Number(info.effectiveTime) === 1" v-model="info.days" clearable autocomplete="off"><template slot="append">天</template></el-input>
          </el-form-item>
          <div v-show="Number(info.effectiveTime) === 2" class="dateList">
            <el-form-item prop="gmtStart">
              <el-date-picker
                v-model="info.gmtStart"
                type="datetime"
                placeholder="选择开始日期"
                align="right">
              </el-date-picker>
            </el-form-item>
            <div class="gap"></div>
            <el-form-item prop="gmtEnd">
              <el-date-picker
                v-model="info.gmtEnd"
                type="datetime"
                placeholder="选择结束日期"
                align="right">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-show="!isRushToPurchaseType" prop="range" label="商品限制范围">
        <div>
          <el-radio-group v-model="info.range" style="margin-bottom: 10px" @change="onRangeChange">
            <el-radio-button label="1">全称通用</el-radio-button>
            <el-radio-button label="2">指定分类</el-radio-button>
          </el-radio-group>
          <el-form-item prop="categoryTitle">

            <el-cascader
              v-show="Number(info.range) === 2"
              v-model="info.categoryTitle"
              :options="categoryTitleOptions"
              collapse-tags
              placeholder="请选择优惠类目"
              style="margin-top: 10px"
              filterable
              clearable
              @change="onSelectCategory"/>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item v-show="isRushToPurchaseType" prop="range" label="使用限制">
        <div>
          <el-radio-group v-model="info.range" style="margin-bottom: 10px" @change="onRangeChange">
            <el-radio-button label="1">全称通用</el-radio-button>
            <el-radio-button label="3">指定商品</el-radio-button>
          </el-radio-group>
          <div v-show="Number(info.range) === 3" class="tableBox">
            <el-checkbox v-model="info.chooseOne">多选一</el-checkbox>
            <el-table
              ref="skuList"
              :data="info.couponSkuDoList"
              border
              style="width: 100%; margin-top:20px"
              @selection-change="onSelectSkuRow">
              <el-table-column
                type="selection"
                align="center"
                width="55"/>
              <el-table-column
                align="center"
                label="商品类目">
                <template slot-scope="scope">
                  <el-cascader
                    :options="categorySkuList"
                    v-model="scope.row.categorySku"
                    collapse-tags
                    placeholder="关联商品"
                    filterable
                    clearable
                    @change="(val) => onSelectSku(val, scope.$index)"/>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="barCode"
                label="商品条码">
              </el-table-column>
              <el-table-column
                align="center"
                prop="title"
                label="商品名称">
              </el-table-column>
              <el-table-column
                align="center"
                prop="skuList[0].title"
                label="商品规格">
              </el-table-column>
              <el-table-column
                align="center"
                width="150"
                prop="discountPrice"
                label="优惠价格">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.discountPrice" clearable autocomplete="off">
                    <template slot="append">元</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="120"
                label="每日限量">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.limitNum" clearable autocomplete="off"></el-input>
                </template>
              </el-table-column>

              <el-table-column
                width="100"
                align="center"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="onDeleteSku(scope.row, scope.$index)">删除</el-button>
                  <el-button type="text" size="mini" @click="onCreateSku(scope.row, scope.$index)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="leftbar">
              <el-checkbox v-model="selectedAll" @change="onSelectAllSku">全选</el-checkbox>
              <el-dropdown trigger="click">
                <el-button type="primary" size="mini">
                  批量操作<i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button type="text" style="padding:0" @click="onDeleteSelectedSku">删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="canEdit" slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils'
import { createCoupon, updateCoupon } from '@/api/coupon'
import { spuTree, detailGoods, detailByIds } from '@/api/goods'
import { clearTreeEmptyChildren } from '@/utils/index'
import DialogData, { Sku } from './coupon.model'
import { queryCouponById } from '@/api/coupon'

export default {
  name: 'ActivityList',
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    mode: {
      type: String,
      required: true,
      default: 'edit'
    },
    id: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      // title: '创建配送员',
      // visible: false,
      // mode: 'create',
      info: new DialogData(),
      categorySkuList: [],
      index: 0,
      rules: {
        title: [
          { required: true, message: '请输入活动券名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择券类型', trigger: 'change' }
        ],
        discountType: [
          { required: false, message: '请选择优惠类型', trigger: 'change' }
        ],
        description: [
        ],
        discount: [
          { pattern: /^[0-9]*$/, message: '请输入整数' },
          { validator: (rule, value, callback) => {
            if (this.isRushToPurchaseType) {
              return callback()
            }
            if (value < 1) {
              callback('满减金额不能小于1')
            } else if (value > 100000000) {
              callback('满减金额不能大于1亿')
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        min: [
          { validator: (rule, value, callback) => {
            if (this.isRushToPurchaseType) {
              return callback()
            }
            if (!value) {
              callback('请输入最低消费金额')
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择优惠券状态', trigger: 'blur' }
        ],
        effectiveTime: [
          { required: true, message: '请输入有效期', trigger: 'blur' }
        ],
        days: [
          { required: false, message: '请输入天数', trigger: 'blur' }
        ],
        gmtStart: [
          { required: false, message: '请选择开始日期', trigger: 'blur' }
        ],
        gmtEnd: [
          { required: false, message: '请选择结束日期', trigger: 'blur' }
        ],
        categoryTitle: [
          { required: false, message: '请选择优惠类目', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    typeOptions() {
      return [
        { label: '优惠券', value: 1 },
        { label: '抢购券', value: 2 }
      ]
    },
    discountTypeOptions() {
      return [
        { label: '满减券', value: 1 }
      ]
    },
    statusOptions() {
      return [
        { label: '失效', value: 0 },
        { label: '正常', value: 1 }
      ]
    },
    categoryTitleOptions() {
      const data = deepClone(this.categorySkuList)
      data.forEach(item => {
        if (!item.children) return
        item.children.forEach(it => {
          it.children = undefined
        })
      })
      return data
    },
    // 是否是抢购类型
    isRushToPurchaseType() {
      return Number(this.info.type) === 2
    },
    isLimitSku() {
      return Number(this.info.range) === 3
    },
    createDialogWidth() {
      return this.isRushToPurchaseType && this.isLimitSku ? '98%' : '600px'
    },
    canEdit() {
      return this.mode !== 'view'
    }
  },

  watch: {
    async visible(value) {
      if (this.visible && this.id) {
        const { data: { data: detail }} = await queryCouponById({ id: this.id })
        this.info = new DialogData(detail)
        // 获取限制商品的所有商品详情
        const couponSkuDoList = this.info.couponSkuDoList
        const ids = couponSkuDoList.map(item => item.spuId)
        const { data: { data: goodsList }} = await detailByIds(ids)
        this.info.couponSkuDoList = couponSkuDoList.map(item => {
          const goodDetail = goodsList.find(goods => goods.id === item.spuId)
          const { name, title, skuList } = goodDetail
          return Object.assign(item, { barCode: skuList[0].barCode, skuList, title, name, skuId: skuList[0].id, categorySku: `G_${item.spuId}`, discountPrice: item.discountPrice / 100 })
        })

        // 分类
        this.info.categoryTitle = `C_${this.info.categoryId}`
        this.info.couponSkuDoList.map(coupon => {
        })
      } else {
        this.$refs.createDialog.resetFields()
        this.$refs.createDialog.clearValidate()
      }

      const { data: { data: spuList }} = await spuTree()
      this.categorySkuList = clearTreeEmptyChildren(spuList)
    }
  },
  async mounted() {
  },
  methods: {
    onRangeChange(val) {
      if (val === '3' && !this.info.couponSkuDoList.length) {
        this.info.couponSkuDoList.push(new Sku())
      }
    },
    async onSelectSku(idList, index) {
      const [, , rowId] = idList
      const id = rowId.substring(2)
      const { data: { data: goodDetail }} = await detailGoods(id)
      const { coupoId, id: spuId, barCode, name, title, skuList } = goodDetail
      this.info.couponSkuDoList.splice(index, 1, new Sku({ coupoId, skuList, spuId, barCode, name, title, categorySku: rowId }))
    },
    onDeleteSku(_, index) {
      this.info.couponSkuDoList.splice(index, 1)

      if (!this.info.couponSkuDoList.length) {
        this.info.couponSkuDoList.push(new Sku())
      }
    },
    onCreateSku(_, index) {
      this.info.couponSkuDoList.splice(index + 1, 0, new Sku())
    },
    onSelectAllSku() {
      this.$refs.skuList.toggleAllSelection()
    },
    onDeleteSelectedSku() {
      this.info.couponSkuDoList = [new Sku()]
    },
    onSelectCategory(item) {
      const [, str] = item
      this.info.categoryId = str.substring(2)
    },
    check(data) {
      if (Number(this.info.range) === 3 && !data.couponSkuDoList.length) {
        this.$notify.error({
          title: '提示',
          message: '请至少选择一种商品'
        })
        return false
      }

      return true
    },
    onSave() {
      this.$refs.createDialog.validate(async(valid) => {
        if (valid) {
          try {
            const data = this.info.getType()
            if (!this.check(data)) return

            if (this.mode === 'create') {
              await createCoupon(data)
            } else {
              await updateCoupon(data)
            }
            this.$emit('save')
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
    onClose() {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>

</style>

