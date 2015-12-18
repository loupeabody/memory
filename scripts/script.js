'use strict';

// Set up state variables:
// value, stores the value of selected card
// pick, stores whether current selection is a pick or guess
// field, stores the DOM Node of the playing field
// cardBacks. stores the DOM Nodes of the cards in play
// values, stores an array of all the possible card values
var value = null,
		target = 0,
		pick = false,
		field = document.getElementsByClassName('field')[0],
		cardBacks = document.getElementsByClassName('card-back'),
		values = ['star','cross','hoop','hex','pent','tri']

// Assign values to the cards such that a pair
// of each value exists on the field
function assignValues(v,c) {
	var theseValues = v.concat(v),
			theseCards = Array.prototype.slice.call(c,0),
			counter = 1

	shuffle(theseValues)

	theseCards.map(function(i) {
		i.dataset.value = theseValues.pop()
		i.dataset.no = counter++
		shuffle(theseValues)
	})
}

// Return all unmatched cards and state
// vars to their original state
function normalizeField() {
	pick = false
	value = null
	target = 0
	Array.prototype.map.call(cardBacks, function(i) {
		i.style.backgroundColor = null
		i.parentNode.classList.remove('flip')
	})
}

// http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
	var m = array.length, t, i;

	// While there remain elements to shuffle...
	while (m) {

		// Pick a remaining element...
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}

// Make the flip anumation a priority
// Check the values and reset the field in a callback
// executed when the cards flip

function flipCards(e) {
	var card = e.target.parentNode.querySelector('.card-back')
	card.parentNode.classList.add('flip')

	setTimeout(checkMatch,500,card)
}
function checkMatch(card) {
	if (pick === true) {

		if (value === card.dataset.value && card.dataset.no !== target) {

			console.log('it\'s a match!')

			// remove matches
			// Can/should we pull this into another function?
			var matches = field.querySelectorAll('[data-value=' + card.dataset.value + ']')
			Array.prototype.map.call(matches, function(i){
				var o = i.parentNode
				o.style.backgroundColor = null
				o.style.opacity = 0.1
				o.style.pointerEvents = 'none'
			})

			normalizeField()

		} else { normalizeField() }
	} else {
		pick = true
		target = card.dataset.no
		value = card.dataset.value
		console.log(card.dataset.value)
	}
}

// Throttle click events on cards
var handleClick = _.throttle(flipCards,300,{trailing: false});

field.addEventListener('click', handleClick)
assignValues(values,cardBacks)