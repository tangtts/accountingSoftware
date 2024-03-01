<template>
	<view class="container">
		<u-button :type="timeRangeActionType.type" icon="bell" plain @click="isTimeRangeActionSheetShow = true">
			时间: {{timeRangeActionType.name}}
		</u-button>

		<my-card style="margin-block: 20rpx;">
			<u-tag icon="calendar" :text='formatDate' :type="timeRangeActionType.type">
			</u-tag>

			<view class="mt-20">
				<text style="font-size: 30rpx;margin-right: 20rpx;">支出总预算</text>

				<text class="bold-700 font-60 text-red" @click="openSettingDialog">
					{{budget}}
				</text>
			</view>

			<view class="flex mt-40">
				<view style="flex">
					已用: <text class="text-orange"> {{incomeCost.expenses}} </text>
				</view>
				<view class="ml-10">
					可用 : <text class="text-green"> {{tempBudget - incomeCost.expenses}} </text>
				</view>
			</view>
		</my-card>

		<u-cell-group>
			<u-cell v-for="(category,index) in categories" size="large" :title="category.name"
				icon="/static/icon/category.png">
				<template #value>

					<up-input 
					type="number"
					v-if="category.isClick" placeholder="请输入内容"
					 border="surround" v-model="category.budget"></up-input>

					<text v-else>{{ category.budget }}</text>

					<u-button v-if="category.isClick" size="mini" class="ml-10" style="width: 60rpx;" type="success"
						@click="changeBudgetStatus(category,'close')">确定</u-button>

					<u-button v-else plain :type="timeRangeActionType.type" class="ml-10" size="mini" style="width: 60rpx;"
						@click="changeBudgetStatus(category,'open')">修改</u-button>

				</template>
			</u-cell>
		</u-cell-group>
		<u-button class="mt-20" 
		:type="timeRangeActionType.type" @click="submit">提交</u-button>

		<u-action-sheet @close="isTimeRangeActionSheetShow = false" cancelText="取消" safeAreaInsetBottom
			:actions="timeRangeActionSheetActions" @select="selectActionSheetClick" title="区间类型"
			:show="isTimeRangeActionSheetShow">
		</u-action-sheet>

		<u-popup mode="center" :show="showPopup" @close="showPopup = false">
			<my-card>
				<u--form>
					<u-form-item label="金额" prop="amount" borderBottom>
						<u--input type="number" v-model="model"></u--input>
					</u-form-item>
					<u-form-item label="">
						<u-button text="确定" type="primary" @click="confirmToChangeBudget"></u-button>
					</u-form-item>
				</u--form>
			</my-card>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		watch,
		computed
	} from "vue"
	import dayjs from "dayjs";
	import {
		changeRangeType,
		timeMap
	} from "../../../utils/time.js"
	import {
		onShow
	} from "@dcloudio/uni-app"
	import {
		getTimeRangeBudget,
		updateTimeRange,
		createTimeRange,
		budgetCreate,
		budgetDetail,
		getTimeRangeIncomeCost
	} from "../../../utils/api.js"

	const Type = Object.freeze({
		DAY: 1,
		WEEK: 2,
		MONTH: 3
	})


	const categories = ref([])
	const budget = ref(0)
	const tempBudget = ref('')
	const year = new Date().getFullYear()
	const month = new Date().getMonth()
	const isTimeRangeActionSheetShow = ref(false)

	const showPopup = ref(false)
	const model = ref('')

	const openSettingDialog = () => {
		showPopup.value = true;
		model.value = budget.value
	}

	let incomeCost = ref({
		income: 0,
		expenses: 0
	})

	const timeRangeActionSheetActions = [{
			id: Type.DAY,
			name: "今天",
			type: "primary"
		}, {
			id: Type.WEEK,
			name: "本周",
			type: "warning"
		},
		{
			id: Type.MONTH,
			name: "本月",
			type: "success"
		},
	]
	// 时间类型
	const timeRangeActionType = ref(timeRangeActionSheetActions[0]);

	// 根据时间类型获取时间
	const [startTime, endTime] = changeRangeType(timeRangeActionType.value.name);


	// 时间预算表 id
	let id = "";
	/**
	 * 修改预算 
	 */
	const confirmToChangeBudget = () => {
		budgetCreate({
			createBudgetTimeType: timeRangeActionType.value.id,
			budgetAmount: model.value
		}).then(res => {
			uni.showToast({
				icon: "none",
				title: "操作成功",
				success: getBudgetDetail,
				complete: () => {
					showPopup.value = false
				}
			})
		})
	}


	/**
	 *  获取收入支出
	 */
	function getIncomeCost() {
		getTimeRangeIncomeCost().then(res => {
			let id = timeRangeActionType.value.id;
			if (id == Type.DAY) {
				incomeCost.value = res.day
			} else if (id == Type.WEEK) {
				incomeCost.value = res.week
			} else {
				incomeCost.value = res.month
			}
		})
	}


	/**
	 * 获取预算
	 * 
	 */
	const getBudgetDetail = () => {
		budgetDetail({
			type: timeRangeActionType.value.id
		}).then(res => {
			budget.value = res.budgetAmount;
			tempBudget.value = res.budgetAmount;
		})
	}


	/**
	 * 修改预算时间列表
	 */
	const submit = () => {
		// 校验item
	let isPass = categories.value.every(category=>{
			 return  !isNaN(category.budget) && !String(category.budget).startsWith('0')
		 })
		 if(!isPass){
			 return uni.showToast({
			 	icon:"error",
				title:"请检查格式！"
			 })
		 }
		updateTimeRange({
			id,
			type: timeRangeActionType.value.id,
			budgetList: categories.value
		}).then(res => {
			uni.showToast({
				icon: "none",
				title: "操作成功"
			})
		})
	}

	/**
	 *  获取预算时间列表
	 **/
	const getCategory = () => {
		getTimeRangeBudget({
			type: timeRangeActionType.value.id,
		}).then(res => {
			id = res.id;
			categories.value = res.data.map(item => {
				return {
					...item,
					isClick: false
				}
			});
		})
	}

	const changeBudgetStatus = (category, status) => {
		categories.value.forEach(category => {
			category.isClick = false;
		})
		if (status == 'close') {
			let s = '' + category.budget;
			if (/^0\d+$/.test(s)) {
				return uni.showToast({
					icon: "none",
					title: "格式不正确"
				})
			}
		}
		category.isClick = status == 'open' ? true : false;
	}


	const time = reactive({
		startTime: "",
		endTime: ""
	})

	const formatDate = computed(() => {
		if (timeRangeActionType.value.id == Type.DAY) {
			return dayjs(time.startTime).format("YYYY年MM月DD")
		} else {
			return dayjs(time.startTime).format("YYYY年MM月DD") +
				" ~ " + dayjs(time.endTime).format("YYYY年MM月DD")
		}
	})


	// 切换 时间 sheet
	watch(timeRangeActionType, (type) => {
		const [startTime, endTime] = changeRangeType(type.name);
		time.startTime = startTime;
		time.endTime = endTime;
		init()
	}, {
		immediate: true
	})

	function init() {
		getCategory(startTime, endTime)
		// 获取收获支出
		getIncomeCost()
		// 获取预算详情
		getBudgetDetail()
	}
	onShow(init)

	const selectActionSheetClick = (type) => {
		timeRangeActionType.value = type;
	}
</script>