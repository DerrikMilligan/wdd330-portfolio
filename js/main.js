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
];

const elPortfolio = document.querySelector('#portfolio');

loadLinks(elPortfolio, linkInfo);

