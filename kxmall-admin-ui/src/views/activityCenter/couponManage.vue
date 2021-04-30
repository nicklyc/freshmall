<template>
  <div class="couponManage">
    <el-tabs v-model="activeName" @tab-click="onSelectTab">
      <el-tab-pane label="活动券列表" name="couponList">
        <activity-list-tab ref="couponListInstance"></activity-list-tab>
      </el-tab-pane>
      <el-tab-pane label="优惠券用户列表" name="couponUserList">
        <user-list-tab ref="couponUserListTabInstance"></user-list-tab>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import CouponListTab from './couponListTab'
import couponUserListTab from './couponUserListTab'

export default {
  name: 'CouponManage',
  components: {
    'activity-list-tab': CouponListTab,
    'user-list-tab': couponUserListTab
  },
  data() {
    return {
      activeName: 'couponList'
    }
  },

  computed: {
  },

  async mounted() {
    this.$refs.couponListInstance.refresh()
  },
  methods: {
    onSelectTab(tab) {
      switch (tab.name) {
        case '"couponList"':
          this.$refs.couponListInstance.refresh()
          break
        case 'couponUserList':
          this.$refs.couponUserListTabInstance.refresh()
          break
      }
    }
  }
}
</script>
<style scoped>
.couponManage {
  padding: 10px;
}
</style>

