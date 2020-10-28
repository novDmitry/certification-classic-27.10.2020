import data from '../data/goods.json';

export const filter = ($element) => {
	$element.on('change', function () {
		const formArray = $($(this)[0].form).serializeArray();
		const cardContainer = $($('[data-container]'));

		formArray.push({ name: 'page', value: '1' });

		const setObject = (object, element) => {
			const elmValue =
				element['name'] === 'price' ? +element['value'] : element['value'];

			if (!object[element['name']]) {
				object[element['name']] = elmValue;
			} else {
				object[element['name']] =
					typeof object[element['name']] !== 'object'
						? [object[element['name']]]
						: object[element['name']];
				object[element['name']].push(elmValue);
			}
		};

		const setStructure = (array) => {
			const object = {};
			let params = {};
			let pagination = {};

			array.forEach((element) => {
				setObject(object, element);

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
			const object = {};
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
			const newStateArrow = [];

			array.forEach((element) => {
				setObject(object, element);
			});

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

		const filterData = (array, param) => {
			const object = {};

			param.forEach((element) => {
				setObject(object, element);
			});
	
			console.log(object);

			array.filter((item) => {
				console.log(item)
				// if () {
					
				// }
			});
		};

		const template = $($('[data-template]')[0].content.children);
		let newElements = '';

		filterData(data, formArray);

		data.forEach((element) => {
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

		cardContainer.html(newElements);

		// setUrl(formArray);
		// setStructure(formArray);
	});
};
