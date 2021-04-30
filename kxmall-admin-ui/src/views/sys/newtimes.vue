<template>
  <div class="main">
    <div class="newPaperHead">
      <el-form ref="form" label-width="80px">
        <el-form-item label="仓库:">
          <el-select
            v-model="userChangeStoreId"
            :remote-method="remoteMethod"
            :loading="loading"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            @change="storeIdChange">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时报:">
          <el-input
            :rows="6"
            v-model="newpaperContent"
            :disabled="!isEdit"
            clearable
            type="textarea"
            placeholder="请输入内容">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-permission="['promote:newtimes:updageOrAdd']" v-if="!isEdit" type="primary" @click="isEdit=!isEdit">编辑</el-button>
          <el-button v-else :loading="loadingSave" type="primary" @click="newpaperSave">保存</el-button>
          <el-checkbox v-model="isStop" :disabled="!isEdit" label="暂停" border style="padding-top:9px;margin-left:20px;margin-right:10px;"></el-checkbox>
          <span>{{ stopTip }}</span>
          <span style="margin-left:50px">编辑人: </span><span>{{ editor }}</span>
          <span style="margin-left:40px">编辑时间: </span><span>{{ editorTime | formatDateAndTime }}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { queryStore, getNewTimes, updageOrAdd } from '@/api/newtimes'
import store from '@/store'
export default{
  data() {
    return {
      newpaperContent: '', // 时报内容
      isStop: false, // 是否暂停
      stopTip: '勾选后,前台不显示时报内容,并隐藏时报模块',
      userChangeStoreId: '', // 用户选择的仓库id
      isEdit: false, // 时报内容是否可编辑
      editor: '', // 修改人姓名
      editorTime: '', // 修改时间
      loadingSave: false,
      options: [],
      value: [],
      loading: false
    }
  },
  methods: {
    async remoteMethod(query) {
      const res = await queryStore({ name: query })
      if (res.data.errno === 200) {
        this.options = res.data.data
      }
    },
    newpaperInit(res) {
      if (res.data.errno === 200) {
        if (!res.data.data) {
          res.data.data = {
            content: '',
            editor: '',
            editorTime: '',
            isStop: 0
          }
        }
        this.newpaperContent = res.data.data.content
        this.editor = res.data.data.gmtEditor
        this.editorTime = res.data.data.gmtUpdate
        this.isStop = Boolean(res.data.data.isStop)
      }
    },
    async storeIdChange(val) {
      // 获取改仓库下的新鲜时报
      const res = await getNewTimes({ storage_id: val })
      this.newpaperInit(res)
    },
    useNameGetId(name) {
      let res = ''
      this.options.forEach(item => {
        if (item.name === name) {
          res = item.id
        }
      })
      return res
    },
    async newpaperSave() {
      // 校验
      if (!this.userChangeStoreId || !this.newpaperContent) {
        this.$notify({
          title: '提示',
          message: '仓库不存在或者新鲜时报内容为空'
        })
        return false
      }
      this.loadingSave = true
      const query = {
        // storageName: this.userChangeStoreId,
        storageId: this.userChangeStoreId,
        content: this.newpaperContent,
        gmtEditor: store.getters.roles[0],
        isStop: this.isStop - 0
      }
      const res = await updageOrAdd({ newTimesDO: query })
      this.loadingSave = false
      if (res.data.errno === 200) {
        this.newpaperInit(res)
        this.$notify.success({
          title: '保存成功',
          message: '新鲜时报保存成功',
          showClose: true
        })
      }
      this.isEdit = false
    }
  }
}
</script>
<style scoped>
.main{
  padding:20px;
}
</style>
