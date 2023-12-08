<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.onTabBarMidButtonTap(function() {
				 uni.navigateTo({
				 	url:"/pages/tabbar/createOrder/createOrder"
				 })
			})

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-plus/index.scss";
	@import 'uview-plus/theme.scss';
	@import "common.scss"
	
</style>
