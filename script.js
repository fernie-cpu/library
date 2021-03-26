//call HTML elements
const signBtn = document.querySelector('.signIn');
const signOutBtn = document.querySelector('.signOut');
const userPic = document.querySelector('.user-pic');
const userNameEl = document.querySelector('.user-name');
const modalBtn = document.querySelector('.addBtn');
const modal = document.querySelector('.modal');
const modalForm = document.querySelector('.modal-content');
const closeModal = document.querySelector('.closeModal');
const titleInput = document.querySelector('.title');
const authorInput = document.querySelector('.author');
const pagesInput = document.querySelector('.pages');
const readInput = document.querySelector('.readBtn');
const addBook = document.querySelector('.submitBtn');
const library = document.querySelector('.shelf');

//event listeners
modalBtn.addEventListener('click', () => modal.classList.add('modal-active'));

closeModal.addEventListener('click', () =>
  modal.classList.remove('modal-active')
);
// addBook.addEventListener('click', addBookToLibrary);
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('modal-active');
  }
});

//firebase

//listen for auth status change
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('logged in', user);
  } else {
    console.log('logged out');
  }
});

const signIn = () => {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(googleProvider);
};

const signOut = () => {
  auth.signOut();
};

const getProfilePicUrl = () => {
  return auth.currentUser.photoURL || './img/profile_placeholder.png';
};

const getUserName = () => {
  return auth.currentUser.displayName;
};

const isUserSignedIn = () => {
  return !!auth.currentUser;
};

const initFirebaseAuth = () => {
  auth.onAuthStateChanged(authStateObserver);
};

const authStateObserver = (user) => {
  if (user) {
    let profilePicUrl = getProfilePicUrl();
    let userName = getUserName();

    userPic.style.backgroundImage =
      'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameEl.textContent = userName;

    userNameEl.removeAttribute('hidden');
    userPic.removeAttribute('hidden');
    signOutBtn.removeAttribute('hidden');

    signBtn.setAttribute('hidden', 'true');
  } else {
    userNameEl.setAttribute('hidden', 'true');
    userPic.setAttribute('hidden', 'true');
    signOutBtn.setAttribute('hidden', 'true');

    signBtn.removeAttribute('hidden');
  }
};

const addSizeToGoogleProfilePic = (url) => {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
};

initFirebaseAuth();

signBtn.addEventListener('click', signIn);
signOutBtn.addEventListener('click', signOut);

//create book and stored them in an empty array
let myLibrary = [];
let newBook;

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read.checked;
  }
}

// function addBookToLibrary(e) {
//   e.preventDefault();
//   let title = titleInput.value;
//   let author = authorInput.value;
//   let pages = pagesInput.value;
//   let read = readInput.value;
//   newBook = new Book(title, author, pages, read);
//   myLibrary.push(newBook);

//   // pushLocalStorage();
//   render();
//   modal.style.display = 'none';
// }

//display book
function render(book) {
  const library = document.querySelector('.shelf');
  const books = document.querySelectorAll('.book');
  books.forEach((book) => library.removeChild(book));
  for (let i = 0; i < myLibrary.length; i++) {
    bookElements(myLibrary[i]);
  }

  const li = document.createElement('li');
  const title = document.createElement('span');
  const author = document.createElement('span');
  const pages = document.createElement('span');
  const read = document.createElement('span');
  const del = document.createElement('div');

  li.setAttribute('data-id', book.id);
  li.classList.add('list-test');
  title.textContent = 'Title: ' + book.data().title;
  author.textContent = 'Author: ' + book.data().author;
  pages.textContent = 'Pages: ' + book.data().pages;
  read.textContent = 'Status: ' + book.data().read;
  del.textContent = 'X';

  li.appendChild(title);
  li.appendChild(author);
  li.appendChild(pages);
  li.appendChild(read);
  li.appendChild(del);

  library.appendChild(li);

  //delete data
  del.addEventListener('click', (e) => {
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('library').doc(id).delete();
  });
}

//getting data
// db.collection('library')
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((book) => {
//       render(book);
//     });
//   });

// saving data
modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('library').add({
    title: modalForm.title.value,
    author: modalForm.author.value,
    pages: modalForm.pages.value,
  });

  modal.classList.remove('modal-active');
});

//update UI in real-time
db.collection('library').onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    if (change.type === 'added') {
      render(change.doc);
    } else if (change.type === 'removed') {
      let li = library.querySelector('[data-id=' + change.doc.id + ']');
      library.removeChild(li);
    }
  });
});

//create html elements to display
function bookElements(book) {
  // const library = document.querySelector('.shelf');
  const bookDiv = document.createElement('div');
  const titleBook = document.createElement('div');
  const authorBook = document.createElement('div');
  const pagesBook = document.createElement('div');
  const readBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  bookDiv.classList.add('book');
  bookDiv.setAttribute('id', myLibrary.indexOf(book));
  if (book.read === true) {
    readBtn.textContent = "I've read";
    readBtn.classList.add('yes');
  } else {
    readBtn.textContent = "Nope, haven't read it yet";
    readBtn.classList.add('no');
  }

  titleBook.textContent = 'Title: ' + book.title;
  titleBook.classList.add('titleBook');

  authorBook.textContent = 'Author: ' + book.author;
  authorBook.classList.add('authorBook');

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
  readBtn.addEventListener('click', () => {
    book.read = !book.read;
    // pushLocalStorage();
    render();
  });

  //button to delete book
  deleteBtn.addEventListener('click', () => {
    myLibrary.splice(myLibrary.indexOf(book), 1);
    // pushLocalStorage();
    render();
  });
}

//stored library in local storage
// function pushLocalStorage() {
//   localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
// }

//pull library from local storage when page is refreshed
// function pullLocalStorage() {
//   if (!localStorage.myLibrary) {
//     render();
//   } else {
//     let setLibrary = localStorage.getItem('myLibrary');
//     setLibrary = JSON.parse(setLibrary);
//     myLibrary = setLibrary;
//     render();
//   }
// }

// pullLocalStorage();
