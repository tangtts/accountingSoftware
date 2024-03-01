<template>
	<view class="container">
		<view class="title">注册</view>
		<my-card>
			<u--form labelPosition="left" :model="model" label-width="70" :rules="rules" ref="uFormRef">

				<u-form-item label="昵称" prop="username" borderBottom>
					<u--input v-model="model.username" placeholder="请输入昵称"></u--input>
				</u-form-item>

				<u-form-item label="手机号" prop="phoneNumber" borderBottom>
					<u--input v-model="model.phoneNumber" placeholder="请输入手机号"></u--input>
				</u-form-item>

				<u-form-item label="密码" prop="password" borderBottom>
					<u--input v-model="model.password" placeholder="请输入密码"></u--input>
				</u-form-item>

				<u-form-item label="确认密码" prop="repassword">
					<u--input v-model="model.repassword" placeholder="请输入确认密码"></u--input>
				</u-form-item>

				<u-form-item label="验证码" prop="capcha">
					<up-input placeholder="请输入验证码" v-model="model.capcha">
						<template #suffix>
							<view v-html="capcha" @click="genCapcha">
							</view>
						</template>
					</up-input>
				</u-form-item>
				<u-form-item label="">
					<u-button @click="submit" type="primary">提交</u-button>
				</u-form-item>
				<u-form-item label="">
					<up-text type="primary" text="去登录" @click="goToLogin"></up-text>
					</u-form-item>
			</u--form>
		</my-card>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue"
	import {
		register,
		getCapcha
	} from "../../utils/api.js"

	const model = reactive({
		username: "",
		phoneNumber: "",
		password: "",
		repassword: "",
		capcha: ""
	});
	const rules = ref({
		username: {
			type: 'string',
			required: true,
			message: '请填写昵称',
			trigger: ['change']
		},
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
		},
		capcha: {
			type: 'string',
			required: true,
			message: '请填写验证码',
			trigger: ['change']
		},
		repassword: {
			trigger: ['change', "blur"],
			validator: (rule, value, callback) => {
				if (!value.trim()) {
					callback(new Error("未填写密码"))
				}
				if (value.trim() != model.password.trim()) {
					callback(new Error("密码不一致"))
				}
				callback()
			},
		},
	});

	const capcha = ref('')

	const goToLogin = ()=>{
		uni.redirectTo({
			url:"/pages/bootstrap/login",
		})
	}

	const genCapcha = () => {
		getCapcha().then(res => {
			capcha.value = res
		})
	}
	genCapcha()


	const uFormRef = ref(null)

	const submit = () => {

		uFormRef.value.validate().then(res => {
			register(model).then(res => {
				uni.navigateTo({
					url: "/pages/bootstrap/login"
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