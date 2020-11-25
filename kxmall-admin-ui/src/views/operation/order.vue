<template>
  <div class="main">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in list" :key="index" :name="item.name" :label="item.label">

      </el-tab-pane>
    </el-tabs>
    <Content :status="activeName"/>
  </div>
</template>

<script>
import Content from './orderContent'
export default {
  name: 'Order',
  components: { Content },
  data() {
    return {
      activeName: 14,
      list: [
        { label: '待配货', name: 14 },
        { label: '配货中', name: 16 },
        { label: '待配送', name: 20 },
        { label: '配送中', name: 30 },
        { label: '已完成', name: 50 },
        { label: '配送异常', name: 32 },
        { label: '待支付', name: 10 },
        { label: '已取消', name: 80 },
        { label: '全部订单', name: 'all' }
      ]
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
<style>
.main {
  padding: 20px;
}
</style>
