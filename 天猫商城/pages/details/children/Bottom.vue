<template>
	<view>
		<view class="shopping-view">
			<view class="shopping-text">
				<image src="/static/details/fenxiang.svg" mode="widthFix"/>
				<text>分享</text>
			</view>
			<view class="shopping-text middle" @click="toCar">
				<image src="/static/details/gouwuche.svg" mode="widthFix"/>
				<text>购物车</text>
				<text>{{cartnum}}</text>
			</view>
			<!-- 未收藏 -->
			<view class="shopping-text" @click="collect(1,goodid)" v-if="collects ==0">
				<image src="/static/details/shoucang.svg" mode="widthFix"/>
				<text>收藏</text>
			</view>
			<!-- 已收藏 -->
			<view class="shopping-text" @click="collect(0,goodid)" v-if="collects ==1">
				<image src="/static/details/yishoucang.svg" mode="widthFix"/>
				<text>已收藏</text>
			</view>
			<view class="join join-right" @click="showcarFun('002')">加入购物车</view>
			<view class="join join-left" @click="showcarFun('003')">立即购买</view>
		</view>
	<!-- 登陆弹窗 -->
	<model ref='modelRef'></model>
	</view>
</template>

<script>
	export default{
		props: {
			goodid: String,
			collectdata: Object,
			shopcar: Object
		},
		data() {
			return {
				// key: value
				collects: 0,
				cartnum: 0, 
			}
		},
		methods:{
			// 收藏和取消收藏
			async collect(num,id){
				let data = {num,id}
				try{
					let enshrine = await new this.$Request(this.$Urls.m().collecturl,data).modepost();
					let {errcode} = enshrine.msg;
					if(errcode == '401'){
						// 要去登录
						this.$refs.modelRef.show('coll');
					}else if(errcode == '200'){
						this.collects = enshrine.msg.collects;
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			async refresh(){
				// 更新商品是否收藏信息
			 let goodcollect = await new this.$Request(this.$Urls.m().pancolurl+'?id='+this.goodid).modeGet();
			 this.collects = goodcollect.msg.collects;
			 let shopcar = await new this.$Request(this.$Urls.m().shopcarurl+'?id='+this.goodid).modeGet();
			 // 更新购物车信息
			 this.cartnum = shopcar.data.length;
			},
			// 展示购物车界面
			showcarFun(mean){
				this.$parent.addtocart(mean);
			},
			toCar(){
				wx.switchTab({
					url:'/pages/shopping/shopping'	 
				})
			}
		},
		// 接收登录组件传过来的值
		created() {
			this.$bus.$on('collict',((res)=>{
				if(res.colldata === 'SUCCESS'){
					// 更新收藏状态
					this.refresh();
				}
			}))
		},	
		watch: {
			// 获取该商品是否收藏
			collectdata(newValue, oldValue) {
				let {collects} = newValue;
				this.collects = collects;
			},
			shopcar(newValue, oldValue){
				if(newValue.msg.errcode){
					this.cartnum = 0;
				}else if(newValue.msg === 'SUCCESS'){
					this.cartnum = newValue.data.length;
				}
			},
			'$store.state.cartnum'(newValue,oldValue){
				this.cartnum = newValue.nums;
			}
		},
		
	}
</script>

<style scoped>
	.shopping-view image{
		width: 35rpx; 
		height: 35rpx;
	}
	.shopping-view{
		font-size: 30upx;
		background: #FFFFFF;
		border-top: 1rpx solid #cccccc;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.join{
		flex: 2; 
		text-align: center; 
		height: 80upx; 
		line-height: 80upx;
		color: white;
	}
	.shopping-text{
		height: 100upx;
		flex: 1;
		display: flex;
		flex-direction:column;
		justify-content: center;
		align-items: center;
	}
	.shopping-text text{
		font-size: 23upx; 
		padding-top: 5upx;
		color: #666666;
	}
	.join-right{
		background: linear-gradient(to right, #ffc800 10%, #ff9602 80%);
		border-top-left-radius: 50upx;
		border-bottom-left-radius: 50upx;
	}
	.join-left{
		background: linear-gradient(to right, #ff7500 10%, #ff4b00 80%);
		border-top-right-radius: 50upx;
		border-bottom-right-radius: 50upx;
		margin-right: 10upx;
	}
	.middle{
		border-left: 1rpx solid #f4f4f4;
		border-right: 1rpx solid #f4f4f4;
		position: relative;
	}
	.middle text:nth-child(3){
		font-size: 16upx; background: #fe0036;
		color: #FFFFFF;
		border-radius: 50%;
		width: 30upx;
		height: 30upx;
		padding: 0 !important;
		text-align: center;
		line-height: 30upx;
		position: absolute;
		top: 10upx;
		right: 10upx;
	}
</style>

