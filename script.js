let posts = [];
let editingPostId = null;

const form = document.querySelector("#postForm");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const errorMessage = document.querySelector("#formError");
const postsContainer = document.querySelector("#postsContainer");

function generateId() {
  return Date.now().toString();
}

function saveToLocalStorage() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function loadFromLocalStorage() {
  const storedPosts = localStorage.getItem("posts");
  if (storedPosts) {
    posts = JSON.parse(storedPosts);
  }
}

function renderPosts() {
  postsContainer.innerHTML = "";

  posts.forEach(post => {
    const postEl = document.createElement("article");
    postEl.classList.add("post");

    postEl.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>${new Date(post.timestamp).toLocaleString()}</small>
      <br/>
      <button data-id="${post.id}" class="edit-btn">Edit</button>
      <button data-id="${post.id}" class="delete-btn">Delete</button>
    `;

    postsContainer.appendChild(postEl);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    errorMessage.textContent = "Title and content are required.";
    return;
  }

  errorMessage.textContent = "";

  if (editingPostId) {
    posts = posts.map(post => {
      if (post.id === editingPostId) {
        return {
          ...post,
          title,
          content
        };
      }
      return post;
    });

    editingPostId = null;
  } else {
    const newPost = {
      id: generateId(),
      title,
      content,
      timestamp: Date.now()
    };

    posts.push(newPost);
  }

  form.reset();
});

postsContainer.addEventListener("click", function (e) {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    // Delete post
    posts = posts.filter(post => post.id !== id);  }

  if (e.target.classList.contains("edit-btn")) {
    // Edit post
    const post = posts.find(p => p.id === id);

    titleInput.value = post.title;
    contentInput.value = post.content;

    editingPostId = id;
  }
});
