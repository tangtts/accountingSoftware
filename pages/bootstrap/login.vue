<template>
	<view class="container">
		<view class="title">登录</view>
		<my-card>
			<u--form labelPosition="left" :model="model" label-width="60" :rules="rules" ref="uFormRef">
				<u-form-item label="手机号" prop="phoneNumber" borderBottom>
					<u--input v-model="model.phoneNumber" placeholder="请输入手机号"></u--input>
				</u-form-item>

				<u-form-item label="密码" prop="password" borderBottom>
					<u--input v-model="model.password" placeholder="请输入密码"></u--input>
				</u-form-item>

				<u-form-item borderBottom>
					<u-button rounded @click="submit" type="primary">提交</u-button>
				</u-form-item>

				<up-text text="没有账号？去注册" type="primary" @click="goToRegister"></up-text>
			</u--form>
		</my-card>
	</view>
</template>

<script setup>
	import {
		login
	} from "../../utils/api.js"

	import {
		reactive,
		ref
	} from "vue"

	const goToRegister = () => {
		uni.navigateTo({
			url: "/pages/bootstrap/register"
		})
	}

	const model = reactive({
		phoneNumber: "",
		password: "",
	});
	const rules = ref({

		phoneNumber: {
			type: 'string',
			pattern: /\d{11}/,
			len: 11,
			required: true,
			message: '请填写正确的手机号',
			trigger: ['change']
		},
		password: {
			type: 'string',
			pattern: /\d{6,}/,
			required: true,
			message: '请填写正确的密码',
			trigger: ['change']
		}
	});

	const uFormRef = ref(null)

	const submit = () => {
		uni.removeStorageSync("token")
		uFormRef.value.validate().then(res => {
			login(model).then(res => {
				uni.setStorage({
					key: "token",
					data: res.access_token,
					success: () => {
						uni.switchTab({
							url: "/pages/tabbar/index/index"
						})
					}
				})
			})
		}).catch(errors => {
			uni.$u.toast('校验失败')
		})
	}
</script>

<style lang="scss">
	.title {
		font-size: 60rpx;
		text-align: center;
		margin-bottom: 40rpx;
	}
</style>