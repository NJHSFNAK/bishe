<template>
	<!-- 订单详情 -->
	<view>
		<view class="order-details-view">
			<view>{{values.tips}}</view>
			<image src="http://h.thexxdd.cn/video/tianmao/001.webp" mode="aspectFill"></image>
		</view>
		<!-- 地址 -->
		<view class="order-details-address">
			<view>
				<image src="/static/loading/address-shouhuo.svg" mode="aspectFit"></image>
			</view>
			<view class="order-details-name">
				<block v-for="(item,index) in orderdata" :key='index'>
				<text>{{item.consignee.name}} {{item.consignee.mobile}}</text>
				<text>{{item.consignee.city}} {{item.consignee.address}}</text>
				</block>
			</view>
		</view>
		<!-- 商品详情 -->
		<block v-for="(item,index) in orderdata" :key="index">
		<view class="payment-commodity pay-border">
			<text class="order-tips tips-import"></text>
			<block v-for="(iteming,indexs) in item.order" :key="indexs">
			<view class="payment-order">
				<view class="payment-order-img">
					<image :src="iteming.image" mode="aspectFill"></image>
				</view>
				<view class="payment-title">
					<text>{{iteming.title}}</text>
					<text class="text-you">颜色:{{iteming.color}};尺码:{{iteming.size}}</text>
				</view>
				<view class="payment-flex">
					<view class="payment-price">
						<text>￥ {{iteming.price}}</text>
						<text class="text-you">x{{iteming.many}}</text>
					</view>
				</view>
			</view>
			</block>
			<!-- 价格 -->
			<view class="presonal-Price">{{values.sum}}￥{{parseFloat((item.total_price).toFixed(10))}}</view>
		</view>
		</block>
		<!-- 订单编号 -->
		<view class="order-number">
			<block v-for="(item,index) in orderdata" :key='index'>
			<text>订单编号: {{item.order_number}}</text>
			<text>创建时间: {{item.time}}</text>
			</block>
		</view>
		<!-- 按钮 -->
		<view class="order-details-play" v-if="values.show">
			<text @click="conFirm(values.text)">{{values.text}}</text>
		</view>
	</view>
</template>

<script>
	import '../../style/order.css';
	import '../../style/order-details.css';
	import payment from '../commonJs/payment.js';
	export default{
		data() {
			return {
				values:{},
				orderdata:[],
			}
		},
		methods: {
			async tobeDetail(id,evt='001') {
				if(evt === '001'){
					try{
						let res = await new this.$Request(this.$Urls.m().tobedetailurl+'?id='+id).modeGet();
						this.orderdata = res.data;
					}catch(e){
						//TODO handle the exception
						throw e
					}
				}else{
					try{
						let res = await new this.$Request(this.$Urls.m().dtpenpageurl+'?id='+id).modeGet();
						this.orderdata = res.data;
					}catch(e){
						throw e
						//TODO handle the exception
					}
				}
			},
			// 付款，确认收货，评价
			async conFirm(txt){
				if(txt === '付款'){
					new this.$Toast('正在下单').showloading();
					new payment(this.orderdata[0]).paySucc()
					.then((res)=>{
						new this.$Toast('支付成功').showtoast();
						uni.redirectTo({
							url:'../personal/personal'
						})
					}).catch((err)=>{
						new this.$Toast('支付失败').showtoast();
					})
				}else if(txt ==='确认收货'){
					try{
						let res = await new this.$Request(this.$Urls.m().conreceipturl+'id='+this.values.id).modeGet();
						if(res.msg === 'SUCCESS'){
							new this.$Toast('确认收货成功').showtoast();
							this.payDetail();
							uni.redirectTo({
								url:'../personal/personal'
							})
						}
					}catch(e){
						throw e
					}
				}else if(txt === '去评价'){
					let {_id,id,size,color} = this.orderdata[0].order[0];
					let data = JSON.stringify({_id,id,size,color});
					wx.navigateTo({
						url: '../common/ordering?data='+ data
					})
				}
			}
		},
		onLoad(e) {
			let value = JSON.parse(e.value);
			this.values = value;
			this.tobeDetail(value.id,value.evt);
		}
	}
</script>

<style>
</style>
