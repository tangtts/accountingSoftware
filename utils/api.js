export const BASE_URL = `http://47.97.110.222:3005/api/v1`;
const http = {
	
	config: {
		url: "",
		data: {},
		BASE_URL,
		method: "GET",
		header: {
			"Content-Type": "application/json"
		}
	},

	base(config) {
		const fullPath = this.config.BASE_URL + config.url;

		return new Promise((resolve, reject) => {
			uni.request({
				method: config.method || this.config.method,
				url: fullPath,
				header: {
					...this.config.header,
					authorization: `Bearer ${uni.getStorageSync('token')}` || ''
				},
				data: config.data
			}).then(res => {
				if (![200, 201].includes(res.statusCode)) {
					console.log(res.data)
					handleErrorCode(res.statusCode, res.data.message)
					reject(res.data)
				}
				if (res.data.data) {
					resolve(res.data.data)
				}
				resolve(res.data)
			}, err => {
				console.log(err, "err")
				if (err.errMsg) {
					uni.showToast({
						title: err.errMsg,
						icon: "none"
					})
				}
				reject(err)
			})
		})
	},

	get(url, data = {}) {
		return this.base({
			url,
			data,
			method: 'GET'
		})
	},
	post(url, data = {}) {
		return this.base({
			url,
			data,
			method: 'POST'
		})
	}
};

function handleErrorCode(code, messages) {
	switch (code) {
		case 401:
			uni.showToast({
				title: '没有权限',
				icon: "none",
				success() {
					uni.navigateTo({
						url: "/pages/bootstrap/login"
					})
				}
			})
			break;
		case 400:
			let errors = ''
			if (Array.isArray(messages)) {
				errors = messages.join('\n')
			} else {
				errors = messages.error
			}
			console.log(messages,"error",errors)
			uni.showToast({
				title: errors,
				icon: "none"
			})
	}
};


export const register = (body) => http.post('/user/register', body)
export const login = (body) => http.post('/user/login', body)
export const incomeCreate = (body) => http.post('/incomeOrExpenses/create', body)
export const incomeAll = (body) => http.post('/incomeOrExpenses/all', body)

export const getIncomeDetail = (params) => http.get('/incomeOrExpenses/detail', params)
export const updateIncome = (body) => http.post('/incomeOrExpenses/update', body)

export const getTimeRangeIncomeCost = () => http.get('/incomeOrExpenses/getTimeRangeIncomeCost')

export const budgetCreate = (body) => http.post('/budget/create', body)

export const budgetDetail = (params) => http.get('/budget/detailByType', params)

export const getTimeRangeBudget = (params) => http.get('/budget/timeRangeBudgetList', params)
export const changePassword = (body) => http.post('/user/changePassword', body)

export const updateTimeRange = (body) => http.post('/budget/updateTimeRange', body)
export const createTimeRange = (body) => http.post('/budget/createTimeRange', body)

export const userDetail = (params) => http.get('/user/detail', params)
export const userUpdate = (body) => http.post('/user/update', body)

export const getCapcha = () => http.get('/user/capcha');

export const getCategories = () => http.get('/category/getCategories');
export const createCategory = (body) => http.post('/category/createCategory',body);
export const delCategory = (body) => http.post('/category/delCategory',body);
export const updateCategory = (body) => http.post('/category/updateCategory',body);


