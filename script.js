const listingTemplate = document.querySelector('template#listing-template');
const filteredTagTemplate = document.querySelector('template#filtered-tag');
const listingsElement = document.querySelector('.listings');
const filterBox = document.querySelector('.filter');
const tagsContainer = document.querySelector('.tags-container');

const filterTagsArr = [];

fetch('data.json')
	.then((response) => response.json())
	.then((data) => {
		data.forEach((listingObj) => {
			listingsElement.appendChild(cloneListingTemplate(listingObj));
		});
	})
	.catch((error) => console.log(error));

document.querySelector('.clear-btn').addEventListener('click', () => {
	clearFilterTagsArr();
	renderFilterBox();
	renderListing();
});

function cloneListingTemplate(listingObj) {
	const clone = listingTemplate.content.cloneNode(true);

	clone.querySelector('.company-logo').style.backgroundImage = `url(${listingObj.logo})`;
	clone.querySelector('.company-name').innerText = listingObj.company;
	clone.querySelector('.position').innerText = listingObj.position;
	clone.querySelector('.extra').innerText = [listingObj.postedAt, listingObj.contract, listingObj.location].join(' • ');

	if (!listingObj.new) {
		clone.querySelector('.new').style.display = 'none';
	}

	if (!listingObj.featured) {
		clone.querySelector('.featured').style.display = 'none';
		clone.querySelector('.listing').style.border = 'none';
	}

	const tags = [listingObj.role, listingObj.level, ...listingObj.languages, ...listingObj.tools];

	tags.forEach((tag) => {
		clone.querySelector('.tags').innerHTML += `
			<div class='tag text-bold'>${tag}</div>
		`;
	});

	const tagElements = clone.querySelectorAll('.tag');

	tagElements.forEach((tag) => {
		tag.addEventListener('click', () => {
			const tagName = tag.innerText;
			updateFilterTagsArr(tagName);
			renderFilterBox();
			renderListing();
		});
	});

	return clone;
}

function cloneFilteredTagTemplate(tagName) {
	const clone = filteredTagTemplate.content.cloneNode(true);

	clone.querySelector('.tag-name').innerText = tagName;

	clone.querySelector('.remove-btn').addEventListener('click', () => {
		updateFilterTagsArr(tagName);
		renderFilterBox();
		renderListing();
	});

	return clone;
}

function updateFilterTagsArr(tagName) {
	const tagIndex = filterTagsArr.indexOf(tagName);

	if (tagIndex >= 0) {
		filterTagsArr.splice(tagIndex, 1);
	} else {
		filterTagsArr.push(tagName);
	}
}

function clearFilterTagsArr() {
	while (filterTagsArr.length > 0) {
		filterTagsArr.pop();
	}
}

function renderFilterBox() {
	if (filterTagsArr.length === 0) {
		filterBox.style.visibility = 'hidden';
	} else {
		filterBox.style.visibility = 'visible';
	}

	tagsContainer.innerHTML = null;

	filterTagsArr.forEach((tagName) => {
		tagsContainer.appendChild(cloneFilteredTagTemplate(tagName));
	});
}

function renderListing() {
	const listings = document.querySelectorAll('.listing');

	listings.forEach((listing) => {
		const tags = [...listing.querySelectorAll('.tag')];
		const tagsArr = tags.map((tag) => tag.innerText);
		const isFiltered = filterTagsArr.every((tag) => tagsArr.includes(tag));

		if (isFiltered) {
			listing.classList.remove('hidden');
		} else {
			listing.classList.add('hidden');
		}
	});
}
