import Todo from './todo';

let card = Todo("title", "2025-12-01", "desc", "1", "abc", "note");

card.printCard();

console.log(card.timeLeft());

card.checklist.addEl('jestem czarny', true);

card.checklist.list[0].changeDone();

card.title = 'nothing';

card.printCard();