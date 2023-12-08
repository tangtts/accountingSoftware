<template>
	<view>
		<u-cell-group>
			<u-cell icon="setting-fill" title="修改密码" @click="showPopup = true"></u-cell>
			<u-cell icon="integral-fill" title="退出" @click="showModal = true"></u-cell>
		</u-cell-group>


		<u-popup :round="10" mode="center" :show="showPopup" @close="showPopup = false">

			<my-card>
				<u--form labelPosition="left" :model="model" label-width="70" :rules="rules" ref="uFormRef">
					<u-form-item label="旧密码" prop="oldPassword" borderBottom>
						<u--input v-model="model.oldPassword" placeholder="请输入旧密码"></u--input>
					</u-form-item>

					<u-form-item label="新密码" prop="newPassword" borderBottom>
						<u--input v-model="model.newPassword" placeholder="请输入密码"></u--input>
					</u-form-item>

					<u-form-item borderBottom>
						<u-button rounded @click="submit" type="primary">提交</u-button>
					</u-form-item>

				</u--form>
			</my-card>
		</u-popup>
		<u-modal width="220" @close="showModal = false" @confirm="logout" :show="showModal" title="确定要退出吗?"
			closeOnClickOverlay>

		</u-modal>
	</view>
</template>

<script setup>
	import {changePassword} from "../../../utils/api.js"
	import {
		reactive,
		ref
	} from "vue"

	const showPopup = ref(false);
	const showModal = ref(false);

	const model = reactive({
		oldPassword: "",
		newPassword: ""
	})

	const rules = {
		oldPassword: {
			type: 'string',
			pattern: /\d{6,}/,
			required: true,
			message: '请填写正确的密码',
			trigger: ['change']
		},
		newPassword: {
			type: 'string',
			pattern: /\d{6,}/,
			required: true,
			message: '请填写正确的密码',
			trigger: ['change']
		},
	}

	const uFormRef = ref(null)
	const submit = () => {
		uFormRef.value.validate().then(res => {
changePassword(model).then(res=>{
	uni.navigateTo({
		url: "/pages/bootstrap/login"
	})
	console.log(res)
})
		})
	}


	const logout = () => {
		uni.removeStorage({
			key: 'token',
			success: function(res) {
				uni.navigateTo({
					url: "/pages/bootstrap/login"
				})
			}
		});
	}
</script>

<style>

</style>