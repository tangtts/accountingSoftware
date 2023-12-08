<template>
	<view class="container">
		<u-tabs :list="list" :current="form.type" @click="clickTab"></u-tabs>

		<!-- <swiper style="height: 100vh;" :current-item-id="tabIndex" :autoplay="false"
		 @change="swiperChange">
			<swiper-item item-id="0"> -->

		<view>
			<view class="border-bottom border-red-200  flex justify-end">

				<view class="flex-1 flex margin-top-auto">
					<up-input type="number" clearable placeholder="请输入金额" border="none" v-model="form.amount"></up-input>
				</view>

				<view>
					<u-upload :fileList="form.picUrls" @delete="deletePic" @afterRead="afterRead" max-count="5" name="1"
						uploadIcon="camera-fill" uploadIconColor="#b15426">
					</u-upload>
				</view>
			</view>

			<u-cell-group>
				<u-cell size="large" title="分类" icon="/static/icon/category.png" @click="isCategoryActionSheetShow = true">
					<template #value>
						<text>{{ categoryType.name }}</text>
					</template>
				</u-cell>

				<u-cell size="large" title="账户" icon="/static/icon/account.png" @click="isAccountActionSheetShow = true">
					<template #value>
						<text>{{ accountType.name }}</text>
					</template>
				</u-cell>

				<u-cell size="large" title="时间" icon="/static/icon/time.png" @click="isDatetimePickerShow = true">
					<template #value>
						<text>{{ dateFormat }}</text>
					</template>
				</u-cell>

				<u-cell size="large" title="备注" icon="/static/icon/remark.png">
					<template #value>

						<up-input placeholder="请输入备注内容" border="surround" v-model="form.remark"></up-input>
					</template>
				</u-cell>

			</u-cell-group>
			<u-button rounded @click="submit" type="primary">提交</u-button>
		</view>
		<!-- </swiper-item> -->
		<!-- <swiper-item item-id="1"> -->
		<!-- <view><text class="swiper-item-Text">收入</text></view> -->
		<!-- </swiper-item> -->
		<!-- </swiper> -->

		<u-action-sheet @close="isCategoryActionSheetShow = false" cancelText="取消" safeAreaInsetBottom
			:actions="categoryActionSheetActions" @select="(type)=>selectActionSheetClick('分类',type)" title="分类"
			:show="isCategoryActionSheetShow">
		</u-action-sheet>

		<u-action-sheet @close="isAccountActionSheetShow = false" cancelText="取消" safeAreaInsetBottom
			:actions="accountActionSheetActions" @select="(type)=>selectActionSheetClick('账户',type)" title="账户"
			:show="isAccountActionSheetShow">
		</u-action-sheet>

		<u-datetime-picker @cancel="isDatetimePickerShow = false" @close="isDatetimePickerShow = false" closeOnClickOverlay
			:minDate="minDate" :maxDate="maxDate" @confirm="confirmDatetimePicker" :show="isDatetimePickerShow"
			v-model="datetimePicker" mode="date"></u-datetime-picker>

	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		reactive
	} from "vue";

	import dayjs from "dayjs";
	import {
		incomeCreate,
		BASE_URL,
		findCategory,
		getIncomeDetail,
		updateIncome
	} from "../../../utils/api.js"
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";

	const minDate = dayjs().startOf('year').valueOf();
	const maxDate = dayjs().endOf('year').valueOf();


	const tabIndex = ref("0");
	const isCategoryActionSheetShow = ref(false);
	const isAccountActionSheetShow = ref(false);
	const isDatetimePickerShow = ref(false);
	const now = Date.now()
	const datetimePicker = ref(now)
	const categoryActionSheetActions = ref([])
	const categoryType = ref({})

	const accountActionSheetActions = ref([{
			name: '现金',
			id: 1
		},
		{
			name: '支付宝',
			id: 1
		},
		{
			name: '微信',
			id: 2
		}, {
			name: '其他',
			id: 2
		}
	])
	const accountType = ref(accountActionSheetActions.value[0])
	const dateFormat = computed(() => {
		return dayjs(datetimePicker.value).format('YYYY-MM-DD HH:mm')
	})

	const fileList = ref([])
	const form = reactive({
		type: 0,
		categoryType: '',
		amount: '',
		payType: accountType.value.id,
		payTime: dateFormat.value,
		remark: "",
		picUrls: []
	})

	const isAdd = ref(true)

	onLoad(({
		detailId
	}) => {
		if (detailId) {
			getDetail(detailId)
			isAdd.value = false
		} else {
			isAdd.value = true
		}
	})

	const getDetail = (detailId) => {
		getIncomeDetail({
			detailId
		}).then(res => {
			if (res.picUrls) {
				res.picUrls = res.picUrls.map(item => {
					return {
						url: item
					}
				})
			} else {
				res.picUrls = []
			}

			Object.assign(form, res)
		})
	}


	const submit = () => {
		form.categoryType = categoryType.value.value
		form.payTime = dateFormat.value;
		let picUrls = form.picUrls.map(item => item.url)
		if (isAdd.value) {
			incomeCreate({
				...form,
				picUrls
			}).then(res => {
				uni.showToast({
					icon: "none",
					title: "新增成功!",
					success() {
						uni.switchTab({
							url: "/pages/tabbar/funds/funds"
						})
					}
				})
			})
		} else {
			updateIncome({
				...form,
				picUrls
			}).then(res => {
				uni.showToast({
					icon: "none",
					title: "修改成功",
					success() {
						uni.switchTab({
							url: "/pages/tabbar/funds/funds"
						})
					}
				})
			})
		}
	}


	const deletePic = (event) => {
		form.picUrls.splice(event.index, 1);
	};

	// 新增图片
	const afterRead = async (event) => {
		const url = await uploadFilePromise(event.file.url);
		form.picUrls.push({
			url
		})
	};

	const uploadFilePromise = (url) => {
		return new Promise((resolve, reject) => {
			let a = uni.uploadFile({
				url: `${BASE_URL}/common/upload`, // 仅为示例，非真实的接口地址
				filePath: url,
				name: 'file',
				success: (res) => {
					resolve(JSON.parse(res.data).data.url)
				},
			});
		});
	};

	const selectActionSheetClick = (type, actionSheetType) => {
		switch (type) {
			case "分类":
				categoryType.value = actionSheetType
				break;
			case "账户":
				accountType.value = actionSheetType
				break;
			default:
				break;
		}
	}

	const confirmDatetimePicker = ({
		value
	}) => {
		datetimePicker.value = value

		isDatetimePickerShow.value = false
	}

	const getCategory = () => {
		findCategory().then(res => {
			categoryActionSheetActions.value = res;
			categoryType.value = res[0]
		})
	}
	getCategory()


	const list = ref([{
		name: "支出",
	}, {
		name: "收入"
	}])

	const swiperChange = (item) => {
		tabIndex.value = item.detail.currentItemId
	}

	const clickTab = (item) => {
		// 因为是item.index 是 number 类型，
		// 但 swiper-item-id 需要字符串 
		// 需要转为 字符串
		form.type = '' + item.index
	}
</script>

<style>

</style>