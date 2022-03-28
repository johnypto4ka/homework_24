class Todo {
	storage = localStorage.getItem('data')
	parsedStorage = this.storage ? JSON.parse(this.storage) : []
	data = this.parsedStorage
	formCreateElement: any = document.querySelector('#formCreate')
	listElement: HTMLElement = document.querySelector('#list')
	listItem: HTMLElement = document.querySelector('.list_item')

	inputSearchTitleElement: HTMLElement = document.querySelector('#searchTitle')
	selectSortElement: HTMLElement = document.querySelector('#sort')
	isEdit:boolean = false
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

	handleSubmitFormCreate(event: any) {
		event.preventDefault()
		const date: any = new Date()
		const day: number = this.transformData(date.getDate())
		const month: number = this.transformData(date.getMonth() + 1)
		const year: number = date.getFullYear()

		interface todoInterface {
			id: number,
			createdAt: number,
			isChecked?: boolean,
			dateFormCreate: string
		}
		const todo: todoInterface = {
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

	handleInputSearchTitle(event: any) {
		const {
			target
		} = event
		const queryString = target.value

		const matches = this.data.filter((item: any) => {
			if (item.title.includes(queryString)) {
				return true
			}
		})

		this.render(matches)
	}

	handleChangeSort (event: any) {
		const { target } = event
		const { value } = target
	
		let sortedData = []
	
		if (value) {
			sortedData = this.data.sort((a: number , b: number) => b[value] - a[value])
		} else {
		sortedData = this.data
		}
		console.log('Hello')
		this.render(sortedData)
	}


	handleSubmitFormEdit(event: any) {
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

		this.data.forEach((item: any) => {
			if (item.id == id) {
				item.title = value
			}
		})

		const parentElement = target.closest('.island__item')
		parentElement.classList.remove('island__item_edit')

		this.isEdit = false
		this.render(this.data)
	}

	transformData(date: any) {
		return date < 10 ? `0${date}` : date
	}

	calcStars(stars: any) {
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

	handleChangeTodo(event: any) {
		const {
			target
		} = event
		const {
			id
		} = target.dataset

		if (target.type != 'checkbox') return

		this.data.forEach((item: any) => {
			if (item.id == id) {
				item.isChecked = target.checked
			}
		})
		const parentElement = target.closest('.list_item')
		parentElement.classList.toggle('list_item_active')
	}

	handleRemoveTodo(event: any) {
		const {
			target
		} = event
		if (target.dataset.role != 'remove') return

		const {
			id
		} = target.dataset

		this.data.forEach((item: any, index: number) => {
			if (item.id == id) {
				this.data.splice(index, 1)
			}
		})
		this.render(this.data)
	}

	handleEditTodo(event: any) {
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

	render(todoList: any) {
		let result = ''
		todoList.forEach((todo: any) => {
			const template = this.createTemplate(todo)
			result = result + template
		})
		this.listElement.innerHTML = result
	}
}

const app = new Todo()
