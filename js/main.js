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
			{
				label: 'Final',
				url: 'final/index.html',
			},
		],
	},
];

// Keep a list of weeks we didn't do notes
const weeksToSkip = [ 6 ];
const weeksWithoutNotes = [ 11, 12, 13 ];
const weeksWithoutReport = [];

// Add a set of links for each week's notes
for (let i = 1; i <= 12; i++) {
	if (weeksToSkip.includes(i)) {
		continue;
	}

	const weekInfo = {
		label: `Week ${i}`,
		subItems: [],
	};

	if (weeksWithoutNotes.includes(i) === false) {
		weekInfo.subItems.push({
			label: 'Notes',
			url  : `week${i.toString().padStart(2, '0')}/notes.html`,
		});
	}

	if (weeksWithoutReport.includes(i) === false) {
		weekInfo.subItems.push({
			label: 'Weekly Report',
			url  : `week${i.toString().padStart(2, '0')}/report.html`,
		});
	}

	linkInfo.push(weekInfo);
}


const elPortfolio = document.querySelector('#portfolio');

loadLinks(elPortfolio, linkInfo);

