<template>
	<view class="card">
		<slot/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.card{
	border-radius: 10rpx;
	padding: 20rpx;
	border: 2rpx solid #ccc;
	overflow: hidden;
}
</style>
