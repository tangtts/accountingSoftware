<template>
	<view class="u-page">
		<u-sticky offset-top="0">
			<u-button type="primary" text="新建" @click="show = true"></u-button>
		</u-sticky>

		<u-cell v-for="(item, index) in categories" :key="index">
			<template #title>
				<text @click="openDetailPop(item)"> {{item.categoryName}}</text>
			</template>
		</u-cell>

		<u-popup :round="10" :show="show" mode="center" @close="closePopup">
			<my-card>
				<u--form labelPosition="left" :model="model" :rules="rules" ref="uFormRef" labelWidth="70">
					<u-form-item label="分类名称" prop="categoryName" borderBottom ref="item1">
						<u--input v-model="model.categoryName"></u--input>
					</u-form-item>
					<u-form-item borderBottom>
						<u-button rounded @click="submit" type="primary">提交</u-button>
					</u-form-item>
				</u--form>
			</my-card>
		</u-popup>

		<u-popup :round="10" :show="detailShow" mode="center" @close="closePopup">
			<my-card>
				<u--form labelPosition="left" :model="detailInfo" :rules="rules" ref="uFormRef2" labelWidth="70">
					<u-form-item label="分类名称" prop="categoryName" borderBottom ref="item1">
						<u--input v-model="detailInfo.categoryName"></u--input>
					</u-form-item>
					<u-form-item borderBottom>
						<u-button size="small" rounded @click="del" type="error">删除</u-button>
						<u-button size="small" rounded @click="update" type="warning">修改</u-button>
						<u-button size="small" rounded @click="detailShow = false" type="primary">取消</u-button>
					</u-form-item>
				</u--form>
			</my-card>
		</u-popup>


	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue';

	import {
		getCategories,
		createCategory,
		delCategory,
		updateCategory
	} from "../../../utils/api.js"
	const show = ref(false);
	const closePopup = () => {
		show.value = false;
		model.categoryName = ''
	}

	const model = reactive({
		categoryName: ""
	})

	const rules = {
		categoryName: [{
			type: 'string',
			required: true,
			message: '请填写分类名称',
			trigger: ['blur', 'change']
		}, {
			min: 2,
			max: 8,
			message: '长度在2-8个字符之间'
		}]
	}

	const uFormRef = ref(null)
	const submit = () => {
		uFormRef.value.validate().then(res => {
			createCategory(model).then(res => {
				fetchCategories()
				show.value = false;
			})
		})
	}


	const detailInfo = reactive({})
	const detailShow = ref(false);

	const openDetailPop = (item) => {
		detailShow.value = true;
		Object.assign(detailInfo, item)
	}

	const del = () => {
		delCategory({
			id: detailInfo.id
		}).then(res => {
			detailShow.value = false;
			fetchCategories()
		})
	}

	const uFormRef2 = ref(null)
	const update = () => {
		uFormRef2.value.validate().then(res => {
			updateCategory(detailInfo).then(res => {
				detailShow.value = false;
				fetchCategories()
			})
		})
	}

	const categories = ref();
	const fetchCategories = () => {
		getCategories().then(res => {
			categories.value = res;
		})
	}
	fetchCategories()
</script>