//call HTML elements
const modalBtn = document.querySelector('.addBtn');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.closeModal');
const titleInput = document.querySelector('.title');
const authorInput = document.querySelector('.author');
const pagesInput = document.querySelector('.pages');
const readInput = document.querySelector('.readBtn')
const addBook = document.querySelector('.submitBtn');
const library = document.querySelector('.shelf');

//event listeners
modalBtn.addEventListener('click', () => modal.classList.add('modal-active'));
closeModal.addEventListener('click', () => modal.classList.remove('modal-active'));
addBook.addEventListener('click', addBookToLibrary);
window.addEventListener("click", (event) => {
    if(event.target === modal) {
        modal.classList.remove('modal-active');
    }
});

//create book and stored them in an empty array
let myLibrary = [];
let newBook;

class Book {
    constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    }
}

function addBookToLibrary() {
    let title = titleInput.value;
    let author = authorInput.value;
    let pages = pagesInput.value;
    let read = readInput.value;
    newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    pushLocalStorage();
    render();
    modal.style.display = 'none';
}

//display book
function render() {
    const library = document.querySelector(".shelf");
    const books = document.querySelectorAll(".book");
    books.forEach((book) => library.removeChild(book));
    for (let i = 0; i < myLibrary.length; i++) {
      bookElements(myLibrary[i]);
    }
  }

//create html elements to display
function bookElements(book) {
    const library = document.querySelector('.shelf');
    const bookDiv = document.createElement('div');
    const titleBook = document.createElement('div');
    const authorBook = document.createElement('div');
    const pagesBook = document.createElement('div');
    const readBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    bookDiv.classList.add('book');
    bookDiv.setAttribute('id', myLibrary.indexOf(book));
    if (book.read === 'yes') {
        readBtn.textContent = 'I\'ve read';
        readBtn.classList.add('yes');
    } else {
        readBtn.textContent = 'Nope, haven\'t read it yet';
        readBtn.classList.add('no');
    }

    titleBook.textContent = 'Title: ' + book.title;
    titleBook.classList.add('titleBook');

    authorBook.textContent = 'Author: ' + book.author;
    authorBook.classList.add('authorBook')
    
    pagesBook.textContent = book.pages + ' pages';
    pagesBook.classList.add('pagesBook');
    
    deleteBtn.textContent = 'Delete';

    bookDiv.appendChild(titleBook);
    bookDiv.appendChild(authorBook);
    bookDiv.appendChild(pagesBook);
    bookDiv.appendChild(readBtn);
    bookDiv.appendChild(deleteBtn);
    library.appendChild(bookDiv);

    //button to let user change book status to read
    readBtn.addEventListener('click', (e) => {
        if (e.target.className === 'yes') {
            e.target.className = 'no';
            book.read = 'mo';
        } else {
            e.target.className = 'yes';
            book.read = 'yes'
        }
        pushLocalStorage();
        render();
    });

    //button to delete book
    deleteBtn.addEventListener('click', () => {
        myLibrary.splice(myLibrary.indexOf(book), 1);
        pushLocalStorage();
        render();
    });
}

//stored library in local storage
function pushLocalStorage() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

//pull library from local storage when page is refreshed
function pullLocalStorage() {
    if (!localStorage.myLibrary) {
        render();
    } else {
        let setLibrary = localStorage.getItem('myLibrary');
        setLibrary = JSON.parse(setLibrary);
        myLibrary = setLibrary;
        render();
    }
}
pullLocalStorage();