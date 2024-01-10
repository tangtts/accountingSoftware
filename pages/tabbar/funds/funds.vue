<template>
	<view class="container">

		<view class="flex gap-40">
			<u-button :type="accountActionType.type" plain icon="order" @click="isAccountActionSheetShow = true">
				{{accountActionType.name}}
			</u-button>

			<u-button :type="timeRangeActionType.type" icon="calendar" 
			 plain
			 @click="isTimeRangeActionSheetShow = true">
				<text> {{timeRangeActionType.name}}</text>
			</u-button>
		</view>

		<view v-if="list.length">
			<u-list @scrolltolower="scrolltolower">
				<u-list-item v-for="(item, index) in list" :key="index">
					<u-cell isLink @click="goToDetail(item)" size="large" :icon="item.formatIcon" :value="item.formatPayTime"
						:title="item.formatAmount">
						<template #title>
							<up-text mode="price" :type="item.formatType" :text="item.formatAmount"></up-text>
						</template>
					</u-cell>
				</u-list-item>
			</u-list>
		</view>

		<u-empty v-else mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
		</u-empty>

		<u-action-sheet @close="isAccountActionSheetShow = false" cancelText="取消" safeAreaInsetBottom
			:actions="accountActionSheetActions" @select="(type)=>selectActionSheetClick('收支',type)" title="收支类型"
			:show="isAccountActionSheetShow">
		</u-action-sheet>

		<u-action-sheet @close="isTimeRangeActionSheetShow = false" cancelText="取消" safeAreaInsetBottom
			:actions="timeRangeActionSheetActions" @select="(type)=>selectActionSheetClick('时间',type)" title="时间区间"
			:show="isTimeRangeActionSheetShow">
		</u-action-sheet>
		<up-back-top :scroll-top="scrollTop"></up-back-top>
	</view>
</template>

<script setup>
	import {
		computed,
		ref
	} from "vue"
	import dayjs from "dayjs"
	import {
		incomeAll
	} from "../../../utils/api.js";

	import {
		onLoad,
		onShow,
		onPageScroll,
	} from "@dcloudio/uni-app";

	const isAccountActionSheetShow = ref(false)
	const isTimeRangeActionSheetShow = ref(false)

	const list = ref([])

	const accountActionSheetActions = [{
			id: "",
			name: "全部",
			type: "primary",
		},
		{
			id: "0",
			name: "收入",
			type: "success",
		},
		{
			id: "1",
			name: "支出",
			type: "error",
		},
	]

	const timeRangeActionSheetActions = [{
			id: "0",
			name: "今天",
			type: "primary",
		}, {
			id: "1",
			name: "本周",
			type: "error",
		},
		{
			id: "2",
			name: "本月",
			type: "success",
		},
	]
	const accountActionType = ref(accountActionSheetActions[0])

	const timeRangeActionType = ref(timeRangeActionSheetActions[0])
	const scrolltolower = () => {

	};

	const timeRange = computed(() => {
		let n = timeRangeActionType.value.name
		let map = new Map([

			['今天', [
				dayjs().startOf('date').format('YYYY-MM-DD HH:mm:ss'),
				dayjs().endOf('date').format('YYYY-MM-DD HH:mm:ss')
			]],
			['本周', [
				dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
				dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
			]],
			['本月', [
				dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
				dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
			]],
		])
		return map.get(n)
	})

	const goToDetail = (item) => {
		uni.navigateTo({
			url: `/pages/tabbar/createOrder/createOrder?detailId=${item.id}`,
		})
	}

	const getAll = () => {
		incomeAll({
			type: accountActionType.value.id,
			startTime: timeRange.value[0],
			endTime: timeRange.value[1]
		}).then(res => {
			list.value = res.map(item => {
				return {
					id: item.id,
					formatType: item.type == 1 ? 'primary' : 'error',
					formatIcon: item.type == 0 ? `cut` : `fingerprint`,
					formatPayTime: dayjs(item.payTime).format('YYYY-MM-DD HH:MM'),
					formatAmount: item.amount
				}
			})
		})
	}
	onShow(getAll)

	const selectActionSheetClick = (type, actionSheetType) => {
		switch (type) {
			case "收支":
				accountActionType.value = actionSheetType
				break;
			case "时间":
				timeRangeActionType.value = actionSheetType
				break;
			default:
				break;
		}
		getAll()
	}

	const scrollTop = ref(0)
	onPageScroll(() => {
		scrollTop.value = 0
	})
</script>

<style>

</style>