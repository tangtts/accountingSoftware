<template>
	<view class="container">
		<!-- <header class="flex justify-end gap-20 mb-20">
			<u-icon name="rmb" label="收益" color="red" size="20px"></u-icon>
			<u-icon name="grid-fill" label="图表" color="orange" size="20px"></u-icon>
		</header> -->

		<my-card class="header">
			<view class="flex items-center">
				<text class="month"> {{dayjs().month() + 1}}</text> 月 . 支出
				<view class="ml-20 justify-end">
					<up-text color="white" mode="price" :block="false" :text="timeRangeIncomeCost.month.cost" />
				</view>
			</view>

			<view class="flex">
				预算：
				<up-text color="white" :text="budget ? budget : '点此设置'" @click="openSettingDialog" />

				<text class="mr-20">本月净收入:</text>
				<up-text color="white" mode="price" :block="false"
					:text="timeRangeIncomeCost.month.income - timeRangeIncomeCost.month.cost" />

			</view>
		</my-card>
		<view>

			<u-cell-group border>

				<u-cell icon="/static/icon/day.png" :iconStyle="{
							marginRight:'10rpx'
						}" title="今天" :label="calcCurrentDay" isLink>

					<template #value>
						<view class="flex flex-col">
							<view class="incomeText">
								{{
									timeRangeIncomeCost.day.income
								}}
							</view>
							<view class="payText">{{
									timeRangeIncomeCost.day.cost
								}}</view>
						</view>

					</template>
				</u-cell>

				<u-cell icon="/static/icon/month.png" :iconStyle="{
							marginRight:'10rpx'
						}" title="本周" :label="calcCurrentWeek" isLink>

					<template #value>
						<view class="flex flex-col">
							<view class="incomeText">
								{{timeRangeIncomeCost.week.income}}
							</view>
							<view class="payText">{{
								timeRangeIncomeCost.week.cost
							}}</view>
						</view>
					</template>
				</u-cell>

				<u-cell icon="/static/icon/month.png" :iconStyle="{
							marginRight:'10rpx'
						}" title="本月" :label="calcCurrentMonth" isLink>

					<template #value>
						<view class="flex flex-col">
							<view class="incomeText">
								{{timeRangeIncomeCost.month.income}}
							</view>
							<view class="payText">
								{{timeRangeIncomeCost.month.cost}}
							</view>
						</view>
					</template>
				</u-cell>

			</u-cell-group>

		</view>

		<u-popup mode="center" :show="showPopup" @close="showPopup = false">
			<my-card>
				<u--form>
					<u-form-item label="金额" prop="amount" borderBottom>
						<u--input type="number" v-model="model.budget"></u--input>
					</u-form-item>
					<u-form-item label="">
						<u-button text="确定" type="primary" @click="submit"></u-button>
					</u-form-item>
				</u--form>
			</my-card>
		</u-popup>

	</view>
</template>

<script setup>
	import dayjs from 'dayjs'

	import {
		budgetCreate,
		budgetDetail,
		getTimeRangeIncomeCost
	} from "../../../utils/api.js"

	import {
		computed,
		reactive,
		ref
	} from "vue"

	import {
		onShow
	} from "@dcloudio/uni-app"

	const expense = ref(0)
	const iconName = ref("eye-fill")

	const showPopup = ref(false);

	const model = reactive({
		type: 3,
		budget: ""
	});

	const submit = () => {
		budgetCreate(model).then(res => {
			uni.showToast({
				title: "操作成功!",
				icon: "none",
				success: getBudgetDetail
			})

		}).finally(() => {
			showPopup.value = false;
		})
	}

	const changeIcon = () => {
		if (iconName.value == "eye-fill") {
			iconName.value = "eye-off"
		} else {
			iconName.value = "eye-fill"
		}
	}

	const openSettingDialog = () => {
		showPopup.value = true;
		model.budget = budget.value
	}


	const timeRangeIncomeCost = reactive({
		day: {
			income: 0,
			cost: 0
		},
		week: {
			income: 0,
			cost: 0
		},
		month: {
			income: 0,
			cost: 0
		}
	})


	const budget = ref(0)

	const getBudgetDetail = () => {
		budgetDetail({
			type: "1"
		}).then(res => {
			budget.value = res.budget
		})
	}
	onShow(() => {
		getTimeRangeIncomeCost().then(res => {
			Object.assign(timeRangeIncomeCost, res)
		})
		getBudgetDetail()
	})

	const calcCurrentDay = computed(() => {
		const startDate = dayjs().startOf('date').format('YYYY-MM-DD')
		return `${startDate}`
	})

	const calcCurrentWeek = computed(() => {
		const startWeek = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')
		const endWeek = dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD')
		return `${startWeek} - ${endWeek}`
	})

	const calcCurrentMonth = computed(() => {
		const startMonth = dayjs().startOf('month').format('YYYY-MM-DD')
		const endMonth = dayjs().endOf('month').format('YYYY-MM-DD')
		return `${startMonth} - ${endMonth}`
	})
</script>

<style lang="scss" scoped>
	.header {
		height: 320rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		color: white;
		background: url("../../static/img/bg1.jpg") no-repeat center/cover;

		.month {
			font-size: 60rpx;
			display: inline-block;
			width: max-content;
			font-weight: bold;
		}
	}

	.incomeText {
		color: $successColor;
	}

	.payText {
		color: $warningColor;
	}
</style>