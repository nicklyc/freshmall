<template>
  <div class="activityList">
    <el-tabs v-model="activeName" @tab-click="onSelectTab">
      <el-tab-pane label="活动列表" name="activetyList">
        <activity-list-tab ref="activityListInstance"></activity-list-tab>
      </el-tab-pane>
      <el-tab-pane label="获得优惠券用户列表" name="userList">
        <user-list-tab ref="userListInstance"></user-list-tab>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import ActivityList from './activityList'
import UserListTab from './userListTab'

export default {
  name: 'ActivityList',
  components: {
    'activity-list-tab': ActivityList,
    'user-list-tab': UserListTab
  },
  data() {
    return {
      activeName: 'activetyList'
    }
  },

  computed: {
  },

  async created() {
    // this.$refs.activityListInstance.refresh()
  },
  methods: {
    onSelectTab(tab) {
      switch (tab.name) {
        case '"activetyList"':
          this.$refs.activityListInstance.refresh()
          break
        case 'userList':
          this.$refs.userListInstance.refresh()
          break
      }
    }
  }
}
</script>
<style scoped>
.activityList {
  padding: 10px;
}
</style>

