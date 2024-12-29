export function feedPage() {
    getPosts(0);
    var link = document.querySelector('link[rel="stylesheet"]');
    link.href = '/static/css/feed.css';
    const app = document.getElementById("main-content");
    const container = document.createElement('div');
    container.className = 'container';
    container.id = 'container';
    const postForm = document.createElement('div');
    postForm.className = "form-container";
    const postFormContent = `
        <div class="form-header" id="formHeader">
            <input type="text" placeholder="Title" name="title" class="form-input">
            <p class="err" id="title-error"></p>
        </div>
        <form id="postForm" class="collapsed" method="post">
            <div class="form-group">
                <textarea id="postContent" name="content" placeholder="Enter text here..."></textarea>
                <p class="err" id="textarea-error"></p>
            </div>
            <div class="form-group" id="category-list">
                <fieldset></fieldset>
                <p class="err" id="category-error"></p>
            </div>
            <button type="submit" class="post-button">Post</button>
        </form>
    `
    postForm.innerHTML = postFormContent;
    getCategories();
    const postsFeed = document.createElement('div');
    postsFeed.className = "feed";
    container.appendChild(postForm);
    container.appendChild(postsFeed);
    app.appendChild(container);

    const formContainer = document.querySelector('.form-container');
    const formInput = document.querySelector('.form-input');
    const postFormElement = document.getElementById('postForm');
    formInput.addEventListener('focus', () => {
        formContainer.classList.add('expanded');
        postFormElement.classList.add('active');
    });

    formContainer.addEventListener('focusout', (event) => {
        setTimeout(() => {
            if (!formContainer.contains(document.activeElement)) {
                formContainer.classList.remove('expanded');
                postFormElement.classList.remove('active');
            }
        }, 100);
    });
    postFormElement.addEventListener("submit", (event) => {
        event.preventDefault();
        let isValid = true;

        document.getElementById('title-error').textContent = '';
        document.getElementById('category-error').textContent = '';
        document.getElementById('textarea-error').textContent = '';


        const title = document.querySelector('.form-input').value;
        const content = document.getElementById('postContent').value;
        const checkboxes = document.querySelectorAll('#category-list input[type="checkbox"]');
        const selectedCategories = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.id);

        if (title.length > 250) {
            document.getElementById('title-error').textContent = 'Maximum 255 characters.';
            isValid = false;
        }
        if (!title.trim()) {
            document.getElementById('title-error').textContent = 'Title is required.';
            isValid = false;
        }

        if (selectedCategories.length === 0) {
            document.getElementById('category-error').textContent = 'Please select at least one category.';
            isValid = false;
        }

        if (content.length > 10000) {
            document.getElementById('textarea-error').textContent = "Maximum 10000 characters.";
            isValid = false;
        }
        if (!content.trim()) {
            document.getElementById('textarea-error').textContent = 'content is required.';
            isValid = false;
        }
        if (isValid) {
            const data = {
                title,
                content,
                categories: selectedCategories
            };
            document.querySelector('.form-input').value = "";
            document.getElementById('postContent').value = "";
            document.querySelectorAll('#category-list input[type="checkbox"]').forEach(el => el.checked = false);
            fetch("/api/createpost", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data)
            }).then(response => response.json())
                .then(reply => {
                    if (reply.REplyMssg == "Done") {
                        getPosts(0);
                    }
                })
        }
    })
}

function getPosts(offset) {
    fetch(`/Posts/${offset}`)
        .then((response) => response.json())
        .then((data) => {
            populatePosts(data.posts);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function populatePosts(posts) {
    const feed = document.querySelector(".feed");
    if (posts && posts.length > 0) {
        posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.className = "post";
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="user-info">
                        <h4>${post.Username}</h4>
                    </div>
                    <span class="timestamp">Posted on: ${post.FormattedDate}</span>
                </div>
                <div class="post-title">${post.Title}</div>
                <div class="post-categories">Categories: ${post.CategoryName}</div>
                <div class="post-content">
                    ${post.Content}
                </div>
                <div class="post-footer">
                    <div class="actions">
                        <button>${post.LikeCount} Like</button>
                        <button>${post.DisLikeCount} Dislike</button>
                        <button>${post.CommentCount} Comment</button>
                    </div>
                </div>
            `;
            feed.appendChild(postElement);
        })
    }
}

function getCategories() {
    fetch(`/Posts/1`)
        .then((response) => response.json())
        .then((data) => {
            populateCategories(data.categories);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function populateCategories(categories) {
    const categoryList = document.querySelector("fieldset");
    categoryList.innerHTML = categories
        .map(
            (category) => `
                <label class="control" for="${category.ID}">
                    <input type="checkbox" name="category" id="${category.ID}">
                    <span class="control__content">
                        <svg aria-hidden="true" focusable="false" width="30" height="30" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="15" fill="#1E1B1D"></circle><path d="M10.78 21h1.73l.73-3.2h2.24l-.74 3.2h1.76l.72-3.2h3.3v-1.6H17.6l.54-2.4H21v-1.6h-2.5l.72-3.2h-1.73l-.73 3.2h-2.24l.74-3.2H13.5l-.73 3.2H9.5v1.6h2.93l-.56 2.4H9v1.6h2.52l-.74 3.2zm2.83-4.8l.54-2.4h2.24l-.54 2.4H13.6z" fill="#fff"></path></svg>
                        ${category.Name}
                    </span>
                </label>
            `
        )
        .join("");
}

window.addEventListener("scrollend", () => {
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
        let posts = document.querySelectorAll(".post");
        getPosts(posts.length);
    }
})