document.addEventListener('DOMContentLoaded', ready)
//===============================================================

// add book image for each added book at div
const addBookImage = function (book, newDiv) {
  //create a new image 
  const img = document.createElement('img');
  const imageUrl = `${book.book_image}`;
  console.log(imageUrl)
  img.setAttribute("src", imageUrl);
  img.width = '120'
  //add the image to the newly created div
  newDiv.appendChild(img);
}

// add book title for each added book at div
const addBookTitle = function (book, newDiv) {
  const bookTitle = document.createElement('span')
  bookTitle.innerText = book.title;
  bookTitle.classList.add('book-title');
  newDiv.appendChild(bookTitle);
}

// store the book information at local storage
function store(key, book) { //stores items in the localStorage
  window.localStorage.setItem(key, JSON.stringify(book));

  // Show the stored information in a new window by retrieving the info
  let records = window.localStorage.getItem(key);
  const openNewWindow = (records) => {
    newWindow = window.open('store.html', 'Local Storage', records);
    let paragraph = newWindow.document.createElement("p")
    let infoText = newWindow.document.createTextNode(records);
    paragraph.appendChild(infoText);
  };
}

// mark the book information as favorite at local storage
function isFav(key) {
  let records = window.localStorage.getItem(key);
  if (records != null)
    return true;
  else
    return false;
}

function removeItem(key) {  //deletes item from localStorage
  localStorage.removeItem(key)
  let records = window.localStorage.getItem(key);
  // Show the stored information in a new window by retrieving the info
  const openNewWindow = (records) => {
    newWindow = window.open('store.html', 'Local Storage', records);
    let paragraph = newWindow.document.createElement("p")
    let infoText = newWindow.document.createTextNode(records);
    paragraph.appendChild(infoText);
  };
}

function showStorage() {
  let paragraph = document.createElement("p")
  for (let i = 0; i < localStorage.length; i++) {
    let records = window.localStorage.getItem(localStorage.key(i));
    let infoText = document.createTextNode(records);
    paragraph.appendChild(infoText);
  }
}

//clears the entire localStorage
function clearStorage() {
  localStorage.clear()
  console.log("clear records");
}

class FavoriteBook {
  constructor(book) {
    this.title = book.title;
    this.author = book.author;
    this.description = book.description;
    this.isbn = book.primary_isbn13;
  }
}

function display_ct5() {
  let x = new Date()
  let ampm = x.getHours() >= 12 ? ' PM' : ' AM';

  let x1 = x.getMonth() + 1 + "/" + x.getDate() + "/" + x.getFullYear();
  x1 = x1 + " - " + x.getHours() + ":" + x.getMinutes() + ":" + x.getSeconds() + ":" + ampm;
  document.getElementById('ct5').innerHTML = x1;
  display_c5();
}
function display_c5() {
  var refresh = 1000; // Refresh rate in milli seconds
  mytime = setTimeout('display_ct5()', refresh)
}

function ready() {

  const formEl = document.getElementById('best-books-form');
  display_c5()

  const getTheUserDate = formEl.addEventListener('submit', function (e) {
    e.preventDefault();

    const dateEl = document.getElementById("date")
    let dateEntered = new Date();
    let input = dateEl.value;
    dateEntered = new Date(input);
    console.log(input); //e.g. 2015-11-13
    console.log(dateEntered); //e.g. Fri Nov 13 2015 00:00:00 GMT+0000 (GMT Standard Time)

    let formatDate = (dateEntered).toISOString().split('T')[0];
    //let formattedDate = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`;

    //let list = `hardcover-fiction`
    let type = document.getElementById('type');
    let list_id = document.getElementById('type').value;
    let list = type.options[type.selectedIndex].text;

    const BASE_URL = `https://api.nytimes.com/svc/books/v3/lists/`

    const API_KEY = `GlddTXRM6F5TlrCalMB8mTHUQYciQEyF`

    const url = `${BASE_URL}${formatDate}/${list}.json?api-key=${API_KEY}`;

    console.log(url)


    fetch(url)
      .then(function (data) {
        return data.json();
      })
      .then((responseJson) => {
        let bookContainer = document.getElementById('books-container');
        bookContainer.innerHTML = '';
        console.log(responseJson)
        let number_of_books = responseJson.results.books.length;
        let rowDiv = createRowDiv();
        for (let index = 0; index < number_of_books; index++) {
          let book = responseJson.results.books[index];
          let newDiv = createBookDiv(book)
          rowDiv.appendChild(newDiv);
          if ((index + 1) % 4 == 0) {
            bookContainer.appendChild(rowDiv);
            rowDiv = createRowDiv();
          }
        }
      });
  });

  const retrieveAllFavButton = document.getElementById("retrieveAllFavButton")
  retrieveAllFavButton.addEventListener("click", function () {
    showStorage();
  })
  const clearButton = document.getElementById("clearButton")
  clearButton.addEventListener("click", function () {
    clearStorage();
  })
}

// Create new row of Div
function createRowDiv() {
  const newDiv = document.createElement("div");
  newDiv.classList.add('row')
  return newDiv;
}


// for each book, create a new div, add it to the div
// when a user hover the mouse on a particular book div,
// then show book detail info in a new detail div.

// user can store the favorite book to local storage

//user can also remove the book, isbn-13 is key.

function createBookDiv(book) {
  const newDiv = document.createElement("div");
  newDiv.classList.add('col-md-3')
  if (isFav(book.primary_isbn13)) {
    newDiv.classList.add('favorite')
  }

  // add book image to individual div
  addBookImage(book, newDiv);

  addBookTitle(book, newDiv);
  newDiv.appendChild(document.createElement('br'))
  // creating button element to store favorites
  let storeButton = document.createElement('BUTTON');
  let stext = document.createTextNode("Add");
  storeButton.appendChild(stext);
  newDiv.appendChild(storeButton);;
  storeButton.addEventListener("click", function (e) {
    const favBook = new FavoriteBook(book);
    let key = book.primary_isbn13;
    store(key, favBook)
    console.log(favBook);
    e.target.parentElement.classList.add('favorite')
  });

  // creating button element to remove favorites
  let removeButton = document.createElement('BUTTON');
  let rtext = document.createTextNode("Remove");
  removeButton.appendChild(rtext);
  newDiv.appendChild(removeButton);;
  removeButton.addEventListener("click", function (e) {
    let key = book.primary_isbn13;
    removeItem(key);
    e.target.parentElement.classList.remove('favorite')
  });

  //on hover, to show info about each book, in a different div
  const descriptionDiv = document.getElementById('description-container');
  newDiv.addEventListener('mouseover', function handleMouseOver() {
    descriptionDiv.innerHTML = `<b>Book Title:</b> ${book.title} <br><b>Author:</b> ${book.author} <br><b>Description:</b> ${book.description}`

    // 👇️ if you used visibility property to hide div
    descriptionDiv.style.visibility = 'visible';
  });

  // //  (optionally) Hide DIV on mouse out
  newDiv.addEventListener('mouseout', function handleMouseOut() {
    descriptionDiv.innerHTML = "";
    // 👇️ if you used visibility property to hide div
    descriptionDiv.style.visibility = 'hidden';
  });

  return newDiv;
}