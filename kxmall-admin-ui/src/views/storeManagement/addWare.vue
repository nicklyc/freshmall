<template>
  <div class="main">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="前置仓名称">
        <el-input v-model="form.name" placeholder="请输入仓库名称" clearable style="width:500px"/>
      </el-form-item>
      <el-form-item label="前置仓状态">
        <el-radio-group v-model="form.state">
          <el-radio-button label="1">
            正常
          </el-radio-button>
          <el-radio-button label="0">
            禁用
          </el-radio-button>
        </el-radio-group>
        <b class="formInfo">订单自动分配配送员</b>
        <el-radio-group v-model="form.automatic">
          <el-radio-button label="1">
            是
          </el-radio-button>
          <el-radio-button label="0">
            否
          </el-radio-button>
        </el-radio-group>

      </el-form-item>
      <el-form-item label="营业状态">
        <el-radio-group v-model="form.operatingState">
          <el-radio-button label="1">
            营业中
          </el-radio-button>
          <el-radio-button label="0">
            休息中
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="营业时间">
        <el-time-select
          v-model="form.businessStartTime"
          :picker-options="{
            start: '00:00',
            step: '1:00',
            end: '23:00',
          }"
          placeholder="起始时间"/>
        <el-time-select
          v-model="form.businessStopTime"
          :picker-options="{
            start: '00:00',
            step: '1:00',
            end: '23:00',
            minTime: form.businessStartTime
          }"
          placeholder="结束时间"/>
      </el-form-item>
      <el-form-item label="配送时间">
        <el-time-select
          v-model="form.deliveryStartTime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '23:00',
          }"
          placeholder="起始时间"/>
        <el-time-select
          v-model="form.deliveryStopTime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '23:00',
            minTime: form.deliveryStartTime
          }"
          placeholder="结束时间"/>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="form.leaderName" placeholder="请输入负责人姓名" clearable style="width:500px"/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone" placeholder="请输入负责人手机号" clearable style="width:500px"/>
      </el-form-item>
      <el-form-item label="仓库地址信息："/>
      <el-form-item label="配送范围">
        <el-input v-model="form.deliveryRadius" clearable style="width:500px">
          <template slot="append">公里</template>
        </el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-select v-model="form.province" placeholder="请选择省" style="width:165px" clearable filterable @change="getCity">
          <el-option
            v-for="item in province"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select v-model="form.city" placeholder="请选择市" style="width:165px" clearable filterable @change="getCounty">
          <el-option
            v-for="item in city"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-select v-model="form.county" placeholder="请选择区" style="width:165px" clearable filterable @change="changeCounty">
          <el-option
            v-for="item in county"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <el-input v-model="form.address" placeholder="详细地址" clearable style="width:500px"/>
      </el-form-item>
      <el-form-item label="经纬度">
        <el-input v-model="address" style="width:500px" clearable />
        <el-button type="primary" style="width:120px" @click="parse">解析</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="back">取消</el-button>
        <el-button size="medium" type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { addEntrepot, getEntrepotMessage, updateEntrepot, getProvinceAll, getCity, getCounty } from '@/api/entrepot'
export default {
  name: 'AddWare',
  data() {
    return {
      form: {
        name: '',
        state: '',
        phone: '',
        operatingState: '',
        longitude: '',
        leaderName: '',
        latitude: '',
        province: '',
        city: '',
        county: '',
        address: '',
        delStartTime: '',
        delTerTime: '',
        gmtUpdateUserID: '',
        gmtCreateUserID: '',
        deliveryRadiusL: '',
        automatic: ''
      },
      address: '',
      province: [],
      city: [],
      county: []
    }
  },
  async created() {
    this.province = (await getProvinceAll()).data.data
    if (this.$route.query.id) {
      const res = await getEntrepotMessage(this.$route.query.id)
      console.log(res)
      this.form = res.data.data
      if (!this.form.province) {
        return
      }
      this.city = (await getCity(this.form.province)).data.data
      this.county = (await getCounty(this.form.city)).data.data
      this.parse()
    }
  },
  methods: {
    async save() {
      if (this.$route.query.id) {
        await updateEntrepot(JSON.stringify(this.form))
      } else {
        await addEntrepot(JSON.stringify(this.form))
      }
      this.$router.go(-1)
    },
    getAddress(address) {
      axios.get(`https://restapi.amap.com/v3/geocode/geo?address=${address}&key=49ddbf4ad01c98ad1d5a63a23ddd4959`).then(res => {
        console.log(res)
        this.$set(this, 'address', res.data.geocodes[0].location)
        this.form.longitude = this.address.split(',')[0]
        this.form.latitude = this.address.split(',')[1]
        this.form.adcode = res.data.geocodes[0].adcode
      })
    },
    async getCity(val) {
      this.form.city = ''
      this.form.county = ''
      this.city = (await getCity(val)).data.data
    },
    async getCounty(val) {
      this.form.county = ''
      this.county = (await getCounty(val)).data.data
    },
    changeCounty() {
      console.log('1')
    },
    parse() {
      const province = this.province.filter((item) => item.value === this.form.province)[0].label
      const city = this.city.filter((item) => item.value === this.form.city)[0].label
      const county = this.county.filter((item) => item.value === this.form.county)[0].label
      const add = this.form.address
      const address = province + city + county + add
      this.getAddress(address)
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
<style>
.main {
  padding: 40px;
}
.formInfo{
  padding-left:30px;
  padding-right:10px;
  font-size: 14px;
  color: #606266;
}
</style>
