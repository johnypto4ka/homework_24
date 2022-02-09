/* const storage = localStorage.getItem('data')
const parsedStorage = storage ? JSON.parse(storage) : []
const data = parsedStorage
const formCreateElement = document.querySelector('#formCreate')
const listElement = document.querySelector('#list')
const listItem = document.querySelector('.list_item')

const inputSearchTitleElement = document.querySelector('#searchTitle')
const selectSortElement = document.querySelector('#sort')
let isEdit = false


formCreateElement.addEventListener('submit', handleSubmitFormCreate)
inputSearchTitleElement.addEventListener('input', handleInputSearchTitle)
selectSortElement.addEventListener('change', handleChangeSort)
listElement.addEventListener('change', handleChangeTodo)
listElement.addEventListener('click', handleRemoveTodo)
listElement.addEventListener('click', handleEditTodo)
listElement.addEventListener('submit', handleSubmitFormEdit)

window.addEventListener('beforeunload', () => {
	const string = JSON.stringify(data)
	localStorage.setItem('data', string)
})
document.addEventListener('DOMContentLoaded', () => {
	const string = JSON.stringify(data)
	render(data)
})


// ------------------

function handleSubmitFormCreate(event) {
	event.preventDefault()
	const date = new Date()
	const day = transformData(date.getDate())
	const month = transformData(date.getMonth() + 1)
	const year = date.getFullYear()

	const todo = {
		id: date.getTime(),
		createdAt: date,
		isChecked: false,
		dateFormCreate: `${day}.${month}.${year}`
	}

	const formData = new FormData(formCreateElement)

	for (let [name, value] of formData) {
		console.log(name, value)
		todo[name] = value
	}
	data.push(todo)
	formCreateElement.reset()
	render(data)
}

function handleInputSearchTitle(event) {
	const {
		target
	} = event
	const queryString = target.value

	const matches = data.filter(item => {
		if (item.title.includes(queryString)) {
			return true
		}
	})

	render(matches)
}

function handleChangeSort (event) {
	const { target } = event
	const { value } = target
  
	let sortedData = []
  
	if (value) {
		sortedData = data.sort((a, b) => b[value] - a[value])
	} else {
	  sortedData = data
	}
	console.log('Hello')
	render(sortedData)
  }


function handleSubmitFormEdit(event) {
	event.preventDefault()

	const {
		target
	} = event

	const inputElement = target.querySelector('input[name="title"]')
	const {
		value
	} = inputElement
	const {
		id
	} = target.dataset

	data.forEach((item) => {
		if (item.id == id) {
			item.title = value
		}
	})

	const parentElement = target.closest('.island__item')
	parentElement.classList.remove('island__item_edit')

	isEdit = false
	render(data)
}

function transformData(date) {
	return date < 10 ? `0${date}` : date
}

function calcStars(stars) {
	let sumOfStars = " "
	for (let i = 0; i < stars; i++) {
		sumOfStars = sumOfStars + '⭐'
	}
	stars = sumOfStars
	return stars
}

function createTemplate({
	id,
	title,
	isChecked,
	dateFormCreate,
	number,
	priority
}) {
	const idAttr = 'todo' + id
	const checkedAttr = isChecked ? 'checked' : ''
	const newNumber = number + 'ч'
	let stars = `${priority}`
	stars = calcStars(stars)

	return `
	<div class="island__item list_item ${isChecked ? 'list_item_active' : ''}">
	  <div class="form-check d-flex align-items-center">
		<input
		  class="form-check-input"
		  type="checkbox"
		  ${checkedAttr}
		  id="${idAttr}"
		  data-id="${id}">
		<label class="form-check-label ms-3" for="${idAttr}">
		  ${title}
		</label>
		<form class="form-edit ms-3" data-id="${id}">
          <input type="text" class="form-control" name="title" placeholder="Текст" value="${title}">
          <button
            class="btn btn-sm btn-primary ms-3"
            type="submit">
          Save
        </button>
        </form>
		<div class="stars">${stars}</div>
		<div class="number">${newNumber}</div>
		<div class="currentdate"> ${dateFormCreate}</div>
		<button
		  class="btn btn-sm btn-warning ms-auto pencil "
		  type="button"
		  data-role="edit"
		  data-id="${id}">
		  <i class="fas fa-pencil-alt pointer"></i>
		</button>
		<button
		  class="btn btn-sm btn-danger ms-auto"
		  type="button"
		  data-role="remove"
		  data-id="${id}">
		  <i class="fas fa-trash pointer"></i>
		</button>
	  </div>
	</div>
  `
}

function handleChangeTodo(event) {
	const {
		target
	} = event
	const {
		id
	} = target.dataset

	if (target.type != 'checkbox') return

	data.forEach((item) => {
		if (item.id == id) {
			item.isChecked = target.checked
		}
	})
	const parentElement = target.closest('.list_item')
	parentElement.classList.toggle('list_item_active')
}

function handleRemoveTodo(event) {
	const {
		target
	} = event
	if (target.dataset.role != 'remove') return

	const {
		id
	} = target.dataset

	data.forEach((item, index) => {
		if (item.id == id) {
			data.splice(index, 1)
		}
	})
	render(data)
}

function handleEditTodo(event) {
	const {
		target
	} = event
	if (target.dataset.role != 'edit') return
	if (isEdit) {
		return
	}
	const parentElement = target.closest('.island__item')
	parentElement.classList.add('island__item_edit')
	isEdit = true
}

function render(todoList) {
	let result = ''
	todoList.forEach((todo) => {
		const template = createTemplate(todo)
		result = result + template
	})
	listElement.innerHTML = result
} */


//----------------


class Todo {
	storage = localStorage.getItem('data')
	parsedStorage = this.storage ? JSON.parse(this.storage) : []
	data = this.parsedStorage
	formCreateElement = document.querySelector('#formCreate')
	listElement = document.querySelector('#list')
	listItem = document.querySelector('.list_item')

	inputSearchTitleElement = document.querySelector('#searchTitle')
	selectSortElement = document.querySelector('#sort')
	isEdit = false
	constructor () {
		this.init()
	}
	init() {
		this.formCreateElement.addEventListener('submit', this.handleSubmitFormCreate.bind(this))
		this.inputSearchTitleElement.addEventListener('input', this.handleInputSearchTitle.bind(this))
		this.selectSortElement.addEventListener('change', this.handleChangeSort.bind(this))
		this.listElement.addEventListener('change', this.handleChangeTodo.bind(this))
		this.listElement.addEventListener('click', this.handleRemoveTodo.bind(this))
		this.listElement.addEventListener('click', this.handleEditTodo.bind(this))
		this.listElement.addEventListener('submit', this.handleSubmitFormEdit.bind(this))

		window.addEventListener('beforeunload', () => {
			const string = JSON.stringify(this.data)
			localStorage.setItem('data', string)
		})
		document.addEventListener('DOMContentLoaded', () => {
			const string = JSON.stringify(this.data)
			this.render(this.data)
		})
	}

// ------------------

	handleSubmitFormCreate(event) {
		event.preventDefault()
		const date = new Date()
		const day = this.transformData(date.getDate())
		const month = this.transformData(date.getMonth() + 1)
		const year = date.getFullYear()

		const todo = {
			id: date.getTime(),
			createdAt: date,
			isChecked: false,
			dateFormCreate: `${day}.${month}.${year}`
		}

		const formData = new FormData(this.formCreateElement)

		for (let [name, value] of formData) {
			console.log(name, value)
			todo[name] = value
		}
		this.data.push(todo)
		this.formCreateElement.reset()
		this.render(this.data)
	}

	handleInputSearchTitle(event) {
		const {
			target
		} = event
		const queryString = target.value

		const matches = this.data.filter(item => {
			if (item.title.includes(queryString)) {
				return true
			}
		})

		this.render(matches)
	}

	handleChangeSort (event) {
		const { target } = event
		const { value } = target
	
		let sortedData = []
	
		if (value) {
			sortedData = this.data.sort((a, b) => b[value] - a[value])
		} else {
		sortedData = data
		}
		console.log('Hello')
		this.render(sortedData)
	}


	handleSubmitFormEdit(event) {
		event.preventDefault()

		const {
			target
		} = event

		const inputElement = target.querySelector('input[name="title"]')
		const {
			value
		} = inputElement
		const {
			id
		} = target.dataset

		this.data.forEach((item) => {
			if (item.id == id) {
				item.title = value
			}
		})

		const parentElement = target.closest('.island__item')
		parentElement.classList.remove('island__item_edit')

		this.isEdit = false
		this.render(this.data)
	}

	transformData(date) {
		return date < 10 ? `0${date}` : date
	}

	calcStars(stars) {
		let sumOfStars = " "
		for (let i = 0; i < stars; i++) {
			sumOfStars = sumOfStars + '⭐'
		}
		stars = sumOfStars
		return stars
	}

	createTemplate({
		id,
		title,
		isChecked,
		dateFormCreate,
		number,
		priority
	}) {
		const idAttr = 'todo' + id
		const checkedAttr = isChecked ? 'checked' : ''
		const newNumber = number + 'ч'
		let stars = `${priority}`
		stars = this.calcStars(stars)

		return `
		<div class="island__item list_item ${isChecked ? 'list_item_active' : ''}">
		<div class="form-check d-flex align-items-center">
			<input
			class="form-check-input"
			type="checkbox"
			${checkedAttr}
			id="${idAttr}"
			data-id="${id}">
			<label class="form-check-label ms-3" for="${idAttr}">
			${title}
			</label>
			<form class="form-edit ms-3" data-id="${id}">
			<input type="text" class="form-control" name="title" placeholder="Текст" value="${title}">
			<button
				class="btn btn-sm btn-primary ms-3"
				type="submit">
			Save
			</button>
			</form>
			<div class="stars">${stars}</div>
			<div class="number">${newNumber}</div>
			<div class="currentdate"> ${dateFormCreate}</div>
			<button
			class="btn btn-sm btn-warning ms-auto pencil "
			type="button"
			data-role="edit"
			data-id="${id}">
			<i class="fas fa-pencil-alt pointer"></i>
			</button>
			<button
			class="btn btn-sm btn-danger ms-auto"
			type="button"
			data-role="remove"
			data-id="${id}">
			<i class="fas fa-trash pointer"></i>
			</button>
		</div>
		</div>
	`
	}

	handleChangeTodo(event) {
		const {
			target
		} = event
		const {
			id
		} = target.dataset

		if (target.type != 'checkbox') return

		this.data.forEach((item) => {
			if (item.id == id) {
				item.isChecked = target.checked
			}
		})
		const parentElement = target.closest('.list_item')
		parentElement.classList.toggle('list_item_active')
	}

	handleRemoveTodo(event) {
		const {
			target
		} = event
		if (target.dataset.role != 'remove') return

		const {
			id
		} = target.dataset

		this.data.forEach((item, index) => {
			if (item.id == id) {
				this.data.splice(index, 1)
			}
		})
		this.render(this.data)
	}

	handleEditTodo(event) {
		const {
			target
		} = event
		if (target.dataset.role != 'edit') return
		if (this.isEdit) {
			return
		}
		const parentElement = target.closest('.island__item')
		parentElement.classList.add('island__item_edit')
		this.isEdit = true
	}

	render(todoList) {
		let result = ''
		todoList.forEach((todo) => {
			const template = this.createTemplate(todo)
			result = result + template
		})
		this.listElement.innerHTML = result
	}
}

const app = new Todo()
