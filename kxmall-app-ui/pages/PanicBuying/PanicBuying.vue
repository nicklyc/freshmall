<template>
	<view class="app">
		<view class="header_nav">
			<view class="header_nav_item" @click="changeNav(0)">
				<text class="header_nav_item_text" :class="index==0?'selector':''">未使用</text>
			</view>
			<view class="header_nav_item" @click="changeNav(1)">
				<text class="header_nav_item_text" :class="index==1?'selector':''">已使用</text>
			</view>
			<view class="header_nav_item" @click="changeNav(2)">
				<text class="header_nav_item_text" :class="index==2?'selector':''">已过期</text>
			</view>
		</view>
		<view class="main">
			<block v-if="index==0">
				<view @click="useCou" class="main_item" v-for="(item,i) in list " :key="i" >
					<view class="main_item_l flex align-center justify-center">
						<!-- <view class="money">￥<text>{{item.couponDO.discount}}</text> </view>
						<view class="mj">满{{item.couponDO.min}}元可用</view> -->
						<view class="text-white text-df">抢购券</view>
					</view>
					<view class="main_item_r">
						<view class="item_r_t">
							<text class="txt1">{{item.couponDO.title}}</text>
							<text class="txt2">点击使用</text>
						</view>
						<view class="item_r_b">{{dateToString(item.gmtStart)}} - {{dateToString(item.gmtEnd)}}有效</view>
					</view>
				</view>
			</block>
			<block v-if="index==1">
				<!-- <view @click="useCou" class="main_item" v-for="(item,i) in list " :key="i" >
					<view class="main_item_l">
						<view class="money">￥<text>{{item.couponDO.discount}}</text> </view>
						<view class="mj">满{{item.couponDO.min}}元可用</view>
					</view>
					<view class="main_item_r">
						<view class="item_r_t">
							<text class="txt1">{{item.couponDO.title}}</text>
							<text class="txt2">点击使用</text>
						</view>
						<view class="item_r_b">{{dateToString(item.gmtStart)}} - {{dateToString(item.gmtEnd)}}有效</view>
					</view>
				</view> -->
			</block>
			<block v-if="index==2">
				<!-- <view class="main_item">
					<view class="main_item_l mt2">
						<view class="money">￥<text>35</text> </view>
						<view class="mj">满120元可用</view>
					</view>
					<view class="main_item_r">
						<view class="item_r_t">
							<text class="txt1 cor1">新人礼券</text>
							<text class="cor2">已过期</text>
						</view>
						<view class="item_r_b">02月23日 - 03月23日有效</view>
					</view>
				</view> -->
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index:0,
				list:[]
			}
		},
		mounted(){
			let that=this
			that.$api.request('coupon','getUserCoupons',{couponType:2},  failres => {
				that.logining = false
				that.$api.msg(failres.errmsg)
			}).then(res => {
				this.list=res.data
				console.log(this.list)
			
			})
		},
		methods: {
			dateToString(dates){
				var date = new Date(dates);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			    var year = date.getFullYear();
				console.log(year)
			    var month =(date.getMonth() + 1).toString();
			    var day = (date.getDate()).toString();
			    if (month.length == 1) {
			        month = "0" + month;
			    }
			    if (day.length == 1) {
			        day = "0" + day;
			    }
			    var hours = date.getHours().toString();
			    if(hours.length == 1){
			        hours = "0" + hours;
			    }
			    var mintus = date.getMinutes().toString();
			    if(mintus.length == 1){
			        mintus = "0" + mintus;
			    }
			    var second = date.getSeconds().toString();
			    if(second.length == 1){
			        second = "0" + second;
			    }
			
			    var dateTime = month + "月" + day + '日' 
			    return dateTime;
			},
			changeNav(index){
				this.index=index
			},
			useCou(){
				uni.navigateTo({
					url:"/pages/parity/PanicbuyingLIst"
				})
			}
		}
	}
</script>

<style scoped>
	pages,.app{
		min-height: 100vh;
		background-color: #F6F5FA;
	}
   .header_nav{
	   display: flex;
	   flex-direction: row;
	   height: 80rpx;
	   background-color: #FFFFFF;
   }
   .header_nav_item{
	   flex: 1;
	   height: 80rpx;
	   text-align: center;
   }
   .header_nav_item_text{
	   display: inline-block;
	   height: 80rpx;
	   width: 150rpx;
	   line-height: 80rpx;
	   text-align: center;
	   font-size: 28rpx;
	   color: #666666;
   }
   .selector{
	   color: #2AAB34;
	   border-bottom: 4rpx solid #2AAB34;
   }
   .main{
	   width: 710rpx;
	   /* padding-top: 21rpx; */
	   margin: 0 auto;
   }
   .main_item{
	   margin-top: 21rpx;
	   height: 120rpx;
	   border-radius: 20rpx;
	   background-color: #FFFFFF;
	   display: flex;
	   flex-direction: row;
   }
   .main_item_l{
	   height: 120rpx;
	   width: 170rpx;
	   background-image: url(../../static/user/conpus1.png);
	   background-repeat: no-repeat;
	   background-size: 170rpx 120rpx;
   }
   .mt1{
	   background-image: url(../../static/user/conpus2.png);
   }
   .mt2{
   	   background-image: url(../../static/user/conpus3.png);
   }
   .main_item_r{
   	   height: 120rpx;
   	   width: 540rpx;
   }
   .money{
	   text-align: center;
	   color: #FFFFFF;
	   font-size: 24rpx;
	   height: 72rpx;
	   line-height: 80rpx;
   }
   .money text{
	   font-size: 56rpx;
   }
   .mj{
	   height: 48rpx;
	   text-align: center;
	   font-size: 20rpx;
	   color: #FFFFFF;
	   line-height: 48rpx;
   }
   .item_r_t,.item_r_b{
	   height: 60rpx;
	   position: relative;
   }
   .txt1{
	   font-size: 32rpx;
	   color: #1B1C33;
	   position: absolute;
	   top: 20rpx;
	   left: 30rpx;
	   
   }
   .txt2{
	   position: absolute;
	   color: #2AAB34;
	   font-size: 24rpx;
	   display: inline-block;
	   width: 120rpx;
	   height: 40rpx;
	   text-align: center;
	   line-height: 40rpx;
	   border:1rpx solid #2AAB34;
	   border-radius: 20rpx;
	   top: 20rpx;
	   right: 20rpx;
   }
   .item_r_b{
	   height: 48rpx;
   }
   .item_r_b{
	   padding-left: 30rpx;
	   color: #8E8E9A;
	   font-size: 24rpx;
	   padding-top: 12rpx;
   }
   .cor1{
	   color: #8E8E9A;
   }
   .cor2{
	   color: #C4C4CC;
	   position: absolute;
	   top: 20rpx;
	   right: 20rpx;
	   font-size: 24rpx;
   }
</style>