// Script for navigation bar

const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
	bar.addEventListener('click', () => {
		nav.classList.add('active');
	})
}

if (close) {
	close.addEventListener('click', () => {
		nav.classList.remove('active');
	})
}

/* Pics slider */

var mainImg = document.getElementById("mainImg");
var sammalImg = document.querySelectorAll(".small-img");

sammalImg.forEach(function (e) {
	e.addEventListener('click', function () {
		mainImg.src = this.src
	});
});


/* Cart claculator */



function updadeONChange() {

	var prices = document.getElementsByClassName("price");
	var inputs = document.querySelectorAll(".in-price");
	var sprices = document.getElementsByClassName("sprice");


	var csts = document.querySelector('.cst');
	var sfees = document.querySelector('.sfee').textContent;
	sfees = Number(sfees)
	var totals = document.querySelector('.total');
	var sum = 0;

	console.log(sfees)

	for (var i = 0; i < prices.length; i++) {
		var price = prices[i].textContent;
		var input = inputs[i].value
		var sprice = price * input

		sprices[i].textContent = sprice
		sum += sprice;
	}
	csts.textContent = sum.toFixed(2);
	totals.textContent = sum += + sfees
}
updadeONChange()