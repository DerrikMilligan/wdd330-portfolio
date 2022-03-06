const createListItemLink = (label, url) => {
	const li = document.createElement('li');

	if (url) {
		const a = document.createElement('a');

		a.innerText = label;
		a.href = url;

		li.appendChild(a);
	} else {
		li.innerText = label;
	}

	return li;
}

const loadLinks = (list, links) => {
	// Wipe out the current list
	list.innerHTML = '';

	// Loop over each
	links.forEach((info) => {
		const link = createListItemLink(info.label, info.url);

		list.appendChild(link);

		if (info.subItems !== undefined && Array.isArray(info.subItems)) {
			const subList = document.createElement('ul');

			subList.classList.add('ml-4');

			info.subItems.forEach((info) => {
				const subLink = createListItemLink(info.label, info.url);
				subList.appendChild(subLink);
			});

			list.appendChild(subList);
		}
	});
}

const linkInfo = [
	{
		label: 'Projects',
		subItems:  [
			{
				label: 'Todo App',
				url: 'todos/index.html',
			},
		],
	},
	{
		label: 'Week 1',
		// url: 'week1/index.html',
		subItems:  [
			{
				label: 'Notes',
				url: 'week1/notes.html',
			},
			{
				label: 'Weekly Report',
				url: 'week1/report.html',
			},
		],
	},
	{
		label: 'Week 2',
		// url: 'week1/index.html',
		subItems:  [
			{
				label: 'Notes',
				url: 'week2/notes.html',
			},
			{
				label: 'Weekly Report',
				url: 'week2/report.html',
			},
		],
	},
	{
		label: 'Week 3',
		subItems:  [
			{
				label: 'Notes',
				url: 'week3/notes.html',
			},
			{
				label: 'Weekly Report',
				url: 'week3/report.html',
			},
		],
	},
	{
		label: 'Week 4',
		subItems:  [
			{
				label: 'Notes',
				url: 'week4/notes.html',
			},
			{
				label: 'Weekly Report',
				url: 'week4/report.html',
			},
		],
	},
	{
		label: 'Week 5',
		subItems:  [
			{
				label: 'Notes',
				url: 'week5/notes.html',
			},
			{
				label: 'Weekly Report',
				url: 'week5/report.html',
			},
		],
	},
	{
		label: 'Week 7',
		subItems:  [
			{
				label: 'Notes',
				url: 'week7/notes.html',
			},
			{
				label: 'Weekly Report',
				url: 'week7/report.html',
			},
		],
	},
	{
		label: 'Week 8',
		subItems:  [
			{
				label: 'Notes',
				url: 'week8/notes.html',
			},
			{
				label: 'Weekly Report',
				url: 'week8/report.html',
			},
		],
	},
	{
		label: 'Week 9',
		subItems:  [
			{
				label: 'Notes',
				url: 'week9/notes.html',
			},
			{
				label: 'Weekly Report',
				url: 'week9/report.html',
			},
		],
	},
];

const elPortfolio = document.querySelector('#portfolio');

loadLinks(elPortfolio, linkInfo);

