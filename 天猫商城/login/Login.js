// 登录
import Urls from '../api/request.js';
import Request from '../api/api.js'; 

class wxLogin{
	constructor(user,msg) {
		this.user = user;
		this.msg = msg;
	}
	async login(){
		// 拒绝登陆
		if(this.msg !=="getUserInfo:ok"){
			wx.showToast({
				title:'登录失败',
				icon: 'none',
				duration: 1300,
			})
			// 抛出异常，阻止下面继续运行
			throw('拒绝登录');
		}
		let userdata =await this.getCode();
		let res =await new Request(Urls.m().loginurl, userdata).modepost();
		if(res.msg === "SUCCESS"){
			uni.setStorageSync('wxuser',res.data);
			wx.showToast({
				title:'登录成功',
				icon: this.icon,
				duration: 1300
			})
		}
	}
	
	getCode(){
		return new Promise((resolve,reject)=>{
			wx.login({
				success:(res)=>{
					let data = {
						appid:'wx257e4f31f3298b6b',
						secret:'c26e17f504594691bf158acacbb58e8c',
						nickName: this.user.nickName,
						avatarUrl: this.user.avatarUrl,
						code: res.code
					}
					resolve(data);
				},
				fail: (err) => {
					reject(err);
				}
			})
		})
	}
}
export default wxLogin;