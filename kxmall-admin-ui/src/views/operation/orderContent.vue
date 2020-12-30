<template>
  <div class="main">
    <a
      v-show="false"
      ref="download"
      href="" />
    <el-select
      v-model="entrepot"
      clearable
      filterable
      placeholder="请选择前置仓">
      <el-option
        v-for="item in entrepotOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value" />
    </el-select>
    <el-input
      v-model="order"
      clearable
      placeholder="输入订单号"
      style="width:250px"></el-input>
    <el-date-picker
      v-model="time"
      type="datetimerange"
      range-separator="至"
      start-placeholder="创建开始时间"
      end-placeholder="创建结束时间">
    </el-date-picker>
    <el-button
      type="primary"
      icon="el-icon-search"
      @click="doSearch">查找</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 100%; margin-top:20px">
      <el-table-column
        type="selection"
        align="center"
        width="55" />
      <el-table-column
        width="200"
        prop="orderNo"
        align="center"
        label="订单号" />
      <el-table-column
        v-if="status==='32'"
        prop="exceptionReason"
        align="center"
        label="异常原因" />
      <el-table-column
        v-if="status==='80'"
        prop="exceptionReason"
        align="center"
        label="付款状态" />
      <el-table-column
        v-if="status==='8'"
        prop="orderNo"
        align="center"
        label="订单状态" />
      <el-table-column
        v-if="status==='8'"
        prop="exceptionReason"
        align="center"
        label="支付状态" />
      <el-table-column
        v-if="status==='8'"
        prop="exceptionReason"
        align="center"
        label="配送状态" />
      <el-table-column
        v-if="status!=='14'&&status!=='16'&&status!=='10'"
        align="center"
        label="配送员">
        <template slot-scope="scope">
          <span>{{ scope.row.postId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="100"
        prop="consignee"
        label="姓名">
      </el-table-column>
      <el-table-column
        align="left"
        width="110"
        prop="phone"
        label="电话">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="left"
        width="200"
        prop="address"
        label="地址">
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.county }}{{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="订单金额" >
        <template slot-scope="scope">
          <span>{{ scope.row.actualPrice/100 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="实付金额">
        <template slot-scope="scope">
          <span>{{ scope.row.payPrice?scope.row.payPrice/100:'' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        align="center"
        label="要求送达时间">
        <template slot-scope="scope">
          <span>{{ scope.row.predictTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        width="150"
        align="center"
        label="下单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate | formatDateAndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        label="支付时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtPay | formatDateAndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="280"
        align="center"
        label="付款交易号">
        <template slot-scope="scope">
          <span>{{ scope.row.payId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作人">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate | formatDateAndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="150"
        label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtUpdate | formatDateAndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="toDetail(scope.row.id)">详情</el-button>
          <el-button
            v-if="status===14"
            type="primary"
            size="mini"
            @click="startExport(scope.row.id,scope.row.orderNo)">开始配货</el-button>
          <el-button
            v-if="status===16"
            type="primary"
            size="mini"
            @click="endExport(scope.row.id,scope.row.orderNo)">重新配货</el-button>
          <el-button
            v-if="status===16"
            type="primary"
            size="mini"
            @click="complete(scope.row.orderNo)">完成配货</el-button>
          <el-button
            v-if="status===20||status===32"
            type="primary"
            size="mini"
            @click="allot(scope.row.storageId,scope.row.orderNo)">{{ scope.row.postId ? '重新分配' : '分配' }}</el-button>
          <el-button
            v-if="status===32"
            type="primary"
            size="mini">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <div class="leftBar">
        <el-checkbox v-model="allCheck">全选</el-checkbox>
        <el-button
          size="mini"
          type="primary">开始配货</el-button>
      </div>
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      :visible.sync="showDetail"
      title="订单详情"
      width="800">
      <el-form
        :data="orderDetail"
        label-position="left">
        <el-form-item label="订单编号">
          <span>{{ orderDetail.orderNo }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <template>
            <el-tag>{{ orderDetail.status | orderStatusFilter }}</el-tag>
          </template>
        </el-form-item>
        <el-form-item label="下单时间">
          <span>{{ orderDetail.gmtCreate | formatDateAndTime }}</span>
        </el-form-item>
        <el-form-item label="要求送达时间">
          <span>{{ orderDetail.predictTime }}</span>
        </el-form-item>
        <el-form-item label="备注">
          <span>{{ orderDetail.mono }}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <span>{{ orderDetail.consignee }}</span>
        </el-form-item>
        <el-form-item label="客户电话">
          <span>{{ orderDetail.phone }}</span>
        </el-form-item>
        <el-form-item label="客户地址">
          <span>{{ orderDetail.address }}</span>
        </el-form-item>
        <el-form-item label="支付状态">
          <span>{{ orderDetail.status | orderStatusFilter }}</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>{{ orderDetail.payChannel | PaymentFilter }}</span>
        </el-form-item>
        <el-form-item label="支付金额">
          <span>{{ orderDetail.skuTotalPrice }}</span>
        </el-form-item>
        <el-form-item label="交易号">
          <span>{{ orderDetail.payId }}</span>
        </el-form-item>
        <el-form-item label="支付时间">
          <span>{{ orderDetail.gmtPay | formatDateAndTime }}</span>
        </el-form-item>
        <el-form-item label="商品信息">
          <el-table
            :data="orderDetail.skuList"
            size="small"
            border
            fit
            highlight-current-row>
            <el-table-column
              align="center"
              label="序号"
              prop="num" />
            <el-table-column
              align="center"
              label="条码"
              prop="barCode" />
            <el-table-column
              align="center"
              label="商品类目">
              <span>一级类>二级类</span>
            </el-table-column>
            <el-table-column
              align="center"
              label="商品编码"
              prop="skuId" />
            <el-table-column
              align="center"
              label="商品名称"
              prop="spuTitle" />
            <el-table-column
              align="center"
              label="可售量"
              prop="spuId" />
            <el-table-column
              align="center"
              label="数量"
              prop="num" />
            <el-table-column
              align="center"
              label="单位"
              prop="unit" />
            <el-table-column
              align="center"
              label="原价"
              prop="originalPrice" />
            <el-table-column
              align="center"
              label="售价"
              prop="price" />
            <el-table-column
              align="center"
              label="总价（单价*数量）">
              <template slot-scope="scope">
                <span>{{ scope.row.price * scope.row.num / 100 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="优惠">
          <span>{{ (orderDetail.skuTotalPrice-orderDetail.actualPrice)/100 }}</span>
        </el-form-item>
        <el-form-item label="总金额">
          <span>{{ orderDetail.skuTotalPrice/100 }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="allotShow"
      title="选择配送员"
      width="30%">
      <el-table
        :data="courierList"
        border
        style="width: 100%; margin-top:20px">
        <el-table-column
          prop="name"
          align="center"
          label="骑手名" />
        <el-table-column
          align="center"
          label="配送时间">
          <template slot-scope="scope">
            <span>{{ scope.row.deliveryStart }}-{{ scope.row.deliveryEnd }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="check(scope.row.id)">选 择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="allotShow = false">取 消</el-button>
        <el-button type="primary" @click="allotShow = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<style>
</style>

<script>
import axios from 'axios'
import { getEntrepotList } from '@/api/entrepot'
import { listByStatus, detailOrder, updateOrderStatus, distributeOrder } from '@/api/order'
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination listOrder, shipOrder, refundOrder, detailOrder, getExcelInfo,
// import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'OrderContent',
  filters: {
    orderStatusFilter(status) {
      const statusMap = {
        14: '待配货',
        16: '配货中',
        20: '待配送',
        30: '配送中',
        50: '已完成',
        40: '已完成',
        32: '配送异常',
        10: '待支付',
        80: '已取消',
        90: '已取消(系统)'
      }
      return statusMap[status]
    },
    PaymentFilter(status) {
      const statusMap = {
        WX: '微信支付',
        ALI: '支付宝',
        OFFLINE: '线下支付'
      }
      return statusMap[status]
    }
  },
  props: {
    status: {
      type: String,
      default: '14'
    }
  },
  data() {
    return {
      courierList: [],
      allotShow: false,
      entrepotOptions: [],
      entrepot: '',
      tableData: [],
      allCheck: false,
      page: 1,
      pageSize: 20,
      totalPage: 10,
      showDetail: false,
      startTime: '',
      endTime: '',
      order: '',
      time: [],
      orderDetail: {},
      allotValue: '',
      orderId: ''
    }
  },
  watch: {
    status() {
      this.getList({
        pageNo: 1,
        limit: 20
      })
    }
  },
  async created() {
    getEntrepotList().then(res => {
      res.data.data.items.forEach(item => {
        this.entrepotOptions.push({
          label: item.name,
          value: item.id
        })
      })
    })
    this.getList({
      pageNo: this.page,
      limit: this.pageSize
    })
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.getList({
        pageNo: val,
        limit: this.pageSize
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList({
        pageNo: this.page,
        limit: val
      })
    },
    async getList(obj) {
      if (this.status === 'all') {
        const res = await listByStatus({
          ...obj,
          status: ''
        })
        this.tableData = res.data.data.items
        this.totalPage = res.data.data.total
        return
      }
      const res = await listByStatus({
        ...obj,
        status: this.status
      })
      this.tableData = res.data.data.items
      this.totalPage = res.data.data.total
    },
    doSearch() {
      const gmtStart = this.time[0] ? this.time[0].getTime() : null
      const gmtEnd = this.time[1] ? this.time[1].getTime() : null
      this.getList({
        pageNo: this.page,
        limit: this.pageSize,
        gmtStart,
        gmtEnd,
        storeId: this.entrepot,
        orderNo: this.order
      })
    },
    toDetail(val) {
      detailOrder(val).then(res => {
        this.orderDetail = res.data.data
      })
      this.showDetail = true
    },
    complete(val) {
      updateOrderStatus({
        orderNo: val,
        status: 20
      })
      setTimeout(() => {
        this.getList({
          pageNo: 1,
          limit: 5
        })
      }, 300)
    },
    startExport(val, val2) {
      console.log(val2)
      axios.get(`http://114.67.94.213:8080/order/export?orderId=${val}&orderNo=${val2}`)
        .then(res => {
          console.log(res)
        })
      // console.log(this.$refs.download.href)
      // this.$refs.download.href = `http://114.67.94.213:8080/order/export?orderId=${val}&orderNo=${val2}`
      // this.$refs.download.click()
      setTimeout(() => {
        this.getList({
          pageNo: 1,
          limit: 5
        })
      }, 300)
    },
    endExport(val, val2) {
      // this.$refs.download.href = `http://114.67.94.213:8080/order/export?orderId=${val}`
      // this.$refs.download.click()
      axios.get(`http://114.67.94.213:8080/order/export?orderId=${val}&orderNo=${val2}`)
        .then(res => {
          console.log(res)
        })
      setTimeout(() => {
        this.getList({
          pageNo: 1,
          limit: 5
        })
      }, 300)
    },
    allot(val, id) {
      this.orderId = id
      this.allotShow = true
      this.allotValue = val
    },
    check(val) {
      const loadingInstance = this.$loading({ text: '正在分配中...' })
      distributeOrder({
        orderDTO: JSON.stringify({
          orderNo: this.orderId
        }),
        riderId: val
      }).then(res => {
        console.log(res)
        this.allotShow = false
        loadingInstance.close()
        this.$notify.success({ title: '成功', message: '分配成功' })
        this.getList({
          pageNo: 1,
          limit: 5
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

.footer {
  margin-top: 10px;
  display: flex;
}

.leftBar {
  margin-right: 10px;
}
</style>
