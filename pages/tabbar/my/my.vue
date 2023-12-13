<template>
	<view>
		<my-card>
			<view class="flex items-center">
				头像：
				<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="file">
					<up-avatar :src="userDetails.avatar"></up-avatar>
				</u-upload>
			</view>

			<view class="mt-20 flex">
				<text> 昵称:</text>
				<up-text @click="isTextUsername = true" :text="userDetails.username">
				</up-text>
			</view>
		</my-card>


		<u-cell-group>
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

const fileList1 = ref([]);
const username = ref('');
	// 删除图片
	const deletePic = (event) => {
		fileList1.value.splice(event.index, 1);
	};

	const update = () => {
		userUpdate({
			...userDetails.value,
			username:username.value
		}).then(res => {
			getUserDetail()
			if(isTextUsername.value){
				isTextUsername.value = false
			}
		})
	}

	const afterRead = async (event) => {
		let a = uni.uploadFile({
			url: `${BASE_URL}/common/upload`, // 仅为示例，非真实的接口地址
			filePath: event.url,
			name: 'file',
			success: (res) => {
				let data = JSON.parse(res.data);
				userDetails.value.avatar = data.data.url
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
			username.value = res.username
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

</style>