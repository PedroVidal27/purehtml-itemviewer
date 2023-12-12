async function fetchData() {
	showLoadingModal();
	const response = await fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas");
	populateItemList(await response.json());
	hideLoadingModal();
}

function showLoadingModal() {
	const loadingModal = document.getElementById("loadingModal");
	loadingModal.style.display = "block";
}

function hideLoadingModal() {
	const loadingModal = document.getElementById("loadingModal");
	loadingModal.style.display = "none";
}

function populateItemList(data) {
	const itemListDiv = document.getElementById("item-list");
	data.map((item) => {
		itemListDiv.innerHTML += `<div class="item" onclick="showItemInfo(${item.codigo})">${item.nome}</div>`;
	});
}

function getRandomValueFromArray(array) {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

async function showItemInfo(itemId) {
	try {
		showLoadingModal();
		const responseModelos = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${itemId}/modelos`);
		const modelos = await responseModelos.json();
		const modeloId = getRandomValueFromArray(modelos.modelos).codigo;
		const responseAno = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${itemId}/modelos/${modeloId}/anos`);
		const anos = await responseAno.json();
		const anoId = getRandomValueFromArray(anos).codigo;
		const responseItem = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${itemId}/modelos/${modeloId}/anos/${anoId}`);
		const item = await responseItem.json();
		hideLoadingModal();

		const detailsDiv = document.getElementById("item-details");
		detailsDiv.innerHTML = `<div class="item-info">
        <img src="assets/placeholder.png" alt="Item Image">
        <div class="text-content">
          <h2>${item.Modelo}</h2>
          <p>${item.Valor}</p>
        </div>
      </div>`;
	} catch (error) {
		console.error("Error fetching item details:", error);
	}
}

window.addEventListener("load", fetchData);
window.addEventListener("DOMContentLoaded", () => {
	const itemListDiv = document.getElementById("item-list");
	const scrollContainer = document.querySelector(".scroll-container");
	const leftArrow = document.querySelector(".scroll-arrow.left");
	const rightArrow = document.querySelector(".scroll-arrow.right");

	leftArrow.addEventListener("click", () => {
		scrollContainer.scrollBy({
			left: -200,
			behavior: "smooth"
		});
	});

	rightArrow.addEventListener("click", () => {
		scrollContainer.scrollBy({
			left: 200,
			behavior: "smooth"
		});
	});

	scrollContainer.addEventListener("scroll", () => {
		leftArrow.style.display = scrollContainer.scrollLeft > 0 ? "block" : "none";
		rightArrow.style.display = scrollContainer.scrollLeft < itemListDiv.scrollWidth - itemListDiv.clientWidth ? "block" : "none";
	});
});
