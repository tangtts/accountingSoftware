<template>
	<view class="container">
		<my-card class="header">

			<view class="flex flex-col justify-center align-center">
				<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="file">
					<up-avatar size="80" :src="userDetails.avatar"></up-avatar>
				</u-upload>

				<view class="mt-40">
					<text class="font-60" @click="isTextUsername = true">
						{{ userDetails.username}}
					</text>
				</view>
			</view>
		</my-card>

		<u-cell-group class="mt-40">
			<u-cell icon="setting-fill" title="修改密码" @click="showPopup = true"></u-cell>
			<u-cell icon="integral-fill" title="退出" @click="showModal = true"></u-cell>
		</u-cell-group>

		<u-popup :round="10" mode="center" :show="isTextUsername" @close="isTextUsername = false">
			<my-card>
				<u--form labelPosition="left" label-width="60">
					<u-form-item label="用户名:" borderBottom>
						<up-input placeholder="请输入内容" border="surround" v-model="username"></up-input>
					</u-form-item>

					<u-form-item label="" borderBottom>
						<u-button rounded @click="update" type="primary">提交</u-button>
					</u-form-item>
				</u--form>
			</my-card>
		</u-popup>

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
	import {
		changePassword,
		userDetail,
		BASE_URL,
		userUpdate
	} from "../../../utils/api.js"
	import {
		reactive,
		ref
	} from "vue"

	import {
		onShow
	} from "@dcloudio/uni-app"

	const showPopup = ref(false);
	const showModal = ref(false);
	const isTextUsername = ref(false);

	const fileList = ref([]);
	const username = ref('');
	// 删除图片
	const deletePic = (event) => {
		fileList.value.splice(event.index, 1);
	};

	const update = () => {
		userUpdate({
			...userDetails.value,
			username: username.value
		}).then(res => {
			getUserDetail()
			if (isTextUsername.value) {
				isTextUsername.value = false
			}
		})
	}

	const afterRead = async (event) => {
		uni.uploadFile({
			url: `${BASE_URL}/common/upload`,
			filePath: event.file.url,
			name: 'file',
			success: (res) => {
				let data = JSON.parse(res.data);
				userDetails.value.avatar = data.data.url;
				update()
			},
		});
	}

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

	const userDetails = ref({});
	const getUserDetail = () => {
		userDetail().then(res => {
			userDetails.value = res;
			username.value = res.username;

		})
	}
	onShow(getUserDetail)

	const uFormRef = ref(null)
	const submit = () => {
		uFormRef.value.validate().then(res => {
			changePassword(model).then(res => {
				uni.navigateTo({
					url: "/pages/bootstrap/login"
				})
			})
		})
	}


	const logout = () => {
		uni.removeStorage({
			key: 'token',
			success: function(res) {
				showModal.value = false
				uni.navigateTo({
					url: "/pages/bootstrap/login"
				})
			}
		});
	}
</script>

<style>
	.header {
		height: 320rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		color: white;
		background: linear-gradient(to right, #314755 0%, #26a0da 51%, #314755 100%) no-repeat center/cover;
	}
</style>