<template>
	<view>
		<u-button type="primary" plain @click="isTimeRangeActionSheetShow = true">
			时间: {{timeRangeActionType.name}}
			<u-icon name="arrow-up" color="#2979ff"></u-icon>
		</u-button>

		<my-card>
			<view class="">
				{{
			dayjs(time.startTime).format("YYYY年MM月DD")
			}}~{{dayjs(time.endTime).format("YYYY年MM月DD")}}
			</view>

			<view class="mt-20">
				<text style="font-size: 40rpx;">支出总预算</text>
				<view class="">
					0.0.0
				</view>
			</view>

			<view class="flex mt-20">
				<view>
					已用：0.0.0
				</view>
				<view class="ml-10">
					可用：0.00
				</view>
			</view>
		</my-card>


		<u-cell-group>
			<u-cell v-for="(category,index) in categories" size="large" :title="category.name"
				icon="/static/icon/category.png">
				<template #value>

					<up-input v-if="category.isClick" placeholder="请输入内容" border="surround" v-model="category.budget"></up-input>

					<text v-else>{{ category.budget }}</text>

					<u-button v-if="category.isClick" size="mini" style="width: 60rpx;"
						@click="clickChangeBudget(category)">确定</u-button>

					<u-button v-else type="primary" size="mini" style="width: 60rpx;"
						@click="changeBudget(category)">修改</u-button>

				</template>
			</u-cell>
		</u-cell-group>
		<u-button 
		class="mt-20"
		type="primary" @click="submit">提交</u-button>

		<u-action-sheet @close="isTimeRangeActionSheetShow = false" cancelText="取消" safeAreaInsetBottom
			:actions="timeRangeActionSheetActions" @select="selectActionSheetClick" title="区间类型"
			:show="isTimeRangeActionSheetShow">
		</u-action-sheet>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		watch
	} from "vue"
	import dayjs from "dayjs";
	import {
		changeRangeType,
		timeMap
	} from "../../../utils/time.js"

	import {
		findCategory,
		getTimeRangeBudget,
		updateTimeRange,
		createTimeRange
	} from "../../../utils/api.js"


	const categories = ref([])

const submit = ()=>{
	// createTimeRange({
	// 	startTime:time.startTime,
	// 	endTime:time.endTime,
	// 	budgetList:categories.value.map(item=>({name:item.name,budget:Number(item.budget),startTime:item.startTime,endTime:item.endTime}))
	// }).then(res=>{
		
	// });
	// return
	updateTimeRange({
		startTime:time.startTime,
		endTime:time.endTime,
		budgetList:categories.value.map(item=>({name:item.name,budget:Number(item.budget),startTime:item.startTime,endTime:item.endTime}))
	}).then(res=>{
		
	})
}

	const getCategory = (startTime, endTime) => {
		getTimeRangeBudget({
			startTime,
			endTime
		}).then(res => {
			categories.value = res.map(item => {
				return {
					...item,
					isClick: false
				}
			});
		})
	}

	const changeBudget = (category) => {
		category.isClick = true;
	}
	const clickChangeBudget = (category) => {
		console.log(category)
		category.isClick = false;
	}

	const timeRangeActionSheetActions = [{
			id: "0",
			name: "今天"
		}, {
			id: "1",
			name: "本周"
		},
		{
			id: "2",
			name: "本月"
		},
	]

	const timeRangeActionType = ref(timeRangeActionSheetActions[0])
	const [startTime, endTime] = changeRangeType(timeRangeActionType.value.name);
	getCategory(startTime, endTime)

	watch(timeRangeActionType, (newval) => {
		if (newval) {
			const [startTime, endTime] = changeRangeType(newval.name);
			getCategory(startTime, endTime)
		}
	})
	const time = reactive({
		startTime: "",
		endTime: ""
	})

	watch(timeRangeActionType, (type) => {
		const [startTime, endTime] = changeRangeType(type.name);
		time.startTime = startTime;
		time.endTime = endTime
	}, {
		immediate: true
	})

	const selectActionSheetClick = (type) => {
		timeRangeActionType.value = type;
	}

	const isTimeRangeActionSheetShow = ref(false)
</script>

<style>

</style>