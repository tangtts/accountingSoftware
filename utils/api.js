export const BASE_URL = `http://localhost:3000`
const http = {
	config: {
		url: "",
		data: {},
		BASE_URL,
		method: "GET",
		header: {
			"Content-Type": "application/json",
			authorization: `Bearer ${uni.getStorageSync('token')}` || ''
		}
	},

	base(config) {
		const fullPath = this.config.BASE_URL + config.url;
		
		return new Promise((resolve, reject) => {
			uni.request({
				method: config.method || this.config.method,
				url: fullPath,
				header: this.config.header,
				data: config.data
			}).then(res => {
				console.log(res, "res")
				if (![200, 201].includes(res.statusCode)) {
					handleErrorCode(res.statusCode, res.data.message)
					reject(res.data)
				}
				if (res.data.data) {
					resolve(res.data.data)
				}
				resolve(res.data)
			}, err => {
				console.log(err, "err")
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
				errors = messages
			}
			uni.showToast({
				title: errors,
				icon: "none"
			})
	}
};


export const register = (params) => http.post('/user/register', params)
export const login = (params) => http.post('/user/login', params)
export const incomeCreate = (params) => http.post('/income/create', params)
export const incomeAll = (params) => http.post('/income/all', params)
export const findCategory = () => http.get('/common/findCategory')
export const getIncomeDetail = (params) => http.get('/income/detail',params)
export const updateIncome = (params) => http.post('/income/update',params)

export const getTimeRangeIncomeCost = () => http.get('/income/getTimeRangeIncomeCost')
 
 export const budgetCreate = (params) => http.post('/budget/create', params)
 export const budgetDetail = (params) => http.get('/budget/detail', params)
 export const getTimeRangeBudget = (params) => http.get('/budget/timeRangeBudgetList', params)
 export const changePassword = (params) => http.post('/user/changePassword', params)
 
 export const updateTimeRange = (params) => http.post('/budget/updateTimeRange', params)
 export const createTimeRange = (params) => http.post('/budget/createTimeRange', params)
 


export const getCapcha = () => http.get('/user/capcha')