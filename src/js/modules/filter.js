import data from '../data/goods.json';

export const filter = ($element) => {
	const $cardContainer = $('[data-container]');
	const $pagination = $('[data-pagination]');
	const $paginationItems = $('[data-pagination]').find('[data-pagination-link]');
	const $paginationInput = $('[data-pagination]').find('input');

	$pagination.on('click', '[data-pagination-link]', function (e) {
		e.preventDefault();
		const $this = $(this);
		const pageValue = $this.data('pagination-link');

		switch (pageValue) {
			case 'prev':
				if (+$paginationInput.val() !== 1) {
					$paginationInput.val(+$paginationInput.val() - 1).trigger('change');
				}
				break;
			case 'next':
				$paginationInput.val(+$paginationInput.val() + 1).trigger('change');
				break;
			case '5':
				$paginationInput.val(5).trigger('change');
				break;
			default:
				$paginationInput.val(+pageValue).trigger('change');
				break;
		}

		$paginationItems
			.attr('href', '#')
			.filter((_, item) => {
				return $(item).data('pagination-link') === +$paginationInput.val();
			})
			.removeAttr('href');
	});

	$element.on('change', function () {
		const formArray = $($(this)[0].form).serializeArray();
		const template = $($('[data-template]')[0].content.children);
		let newElements = '';

		const setFilterValue = (object, element, isset = false, int = false) => {
			if (isset && element['value'] === '') {
				if (element['name'] === 'price') {
					element['value'] = 0;
				} else {
					return false;
				}
			}

			const elmValue =
				element['name'] === 'price' || int ? +element['value'] : element['value'];

			if (object[element['name']] === undefined) {
				object[element['name']] = elmValue;
			} else {
				object[element['name']] = Array.isArray(object[element['name']])
					? object[element['name']]
					: [object[element['name']]];
				object[element['name']].push(elmValue);
			}
		};

		const setFilterObject = (object, array, isset, int) => {
			array.forEach((element) => {
				setFilterValue(object, element, isset, int);
			});

			return object;
		};

		const setStructure = (array) => {
			const object = {};
			let params = {};
			let pagination = {};

			array.forEach((element) => {
				setFilterValue(object, element);

				params = {
					brands:
						typeof object['brand'] === 'string'
							? [object['brand']]
							: object['brand'] === undefined
							? []
							: object['brand'],
					manufacturer: object['manufacturer'],
					model: object['model'],
					year: +object['year'],
					price: object['price']
				};

				pagination = {
					sort: object['sort'],
					perPage: +object['perPage'],
					page: +object['sort']
				};
			});

			const data = {
				pagination,
				params
			};

			console.log(data);
		};

		const setUrl = (array) => {
			const stateArrow = [
				'page',
				'year',
				'price',
				'model',
				'manufacturer',
				'brand',
				'sort',
				'perPage'
			];
			const object = setFilterObject({}, array);
			const newStateArrow = [];

			stateArrow.forEach((element) => {
				if (object[element] !== '' && object[element] !== undefined) {
					if (typeof object[element] === 'object') {
						object[element].forEach((item) => {
							newStateArrow.push({ name: element, value: item });
						});
					} else {
						newStateArrow.push({ name: element, value: object[element] });
					}
				}
			});

			history.pushState({}, '', $.param(newStateArrow));
		};

		const filterData = (array, filterParam) => {
			const objectParam = setFilterObject({}, filterParam, true, true);

			const sortData = (array, objectParam) => {
				const { sort, page, perPage } = objectParam;
				console.log(page);

				return array
					.sort((a, b) => {
						switch (sort) {
							case 1:
								return a.price.value > b.price.value ? 1 : -1;
							case 2:
								return a.price.value < b.price.value ? 1 : -1;
							case 3:
								return a.year < b.year ? -1 : 1;
							case 4:
								return a.year > b.year ? -1 : 1;
						}
					})
					.slice((page - 1) * perPage, perPage * page);
			};

			return sortData(array, objectParam).filter((item) => {
				let isFiltered = true;

				for (const key in objectParam) {
					const filterValue = objectParam[key];
					const itemValue = item[key]?.id || item[key]?.value || item[key];

					if (itemValue && filterValue) {
						if (key === 'price') {
							isFiltered =
								isFiltered &&
								filterValue[0] <= itemValue &&
								filterValue[1] >= itemValue;
						} else if (Array.isArray(filterValue)) {
							isFiltered = isFiltered && filterValue.includes(itemValue);
						} else {
							isFiltered = isFiltered && itemValue === filterValue;
						}
					}
				}

				if (isFiltered) {
					return item;
				}
			});
		};

		filterData(data, formArray).forEach((element) => {
			let newTemplate = template.clone();

			newTemplate.find('[data-year]').html(element.year);
			newTemplate.find('[data-brand]').html(element.brand.name);
			newTemplate.find('[data-model]').html(element.model.name);
			newTemplate
				.find('[data-price]')
				.html(`${element.price.currency.symbol} ${element.price.value}`);
			newTemplate.find('[data-manufacturer]').html(element.manufacturer.name);
			newTemplate
				.find('[data-image]')
				.attr('src', element.image.sizes['card-preview'])
				.attr('alt', element.image.alt);

			newElements += newTemplate.html();
		});

		$cardContainer.html(newElements);

		setUrl(formArray);
		setStructure(formArray);
	});
};
