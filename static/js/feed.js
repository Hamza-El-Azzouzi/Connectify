export function feedPage() {
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

    const postsFeedContent = `
        <div class="post">
            <div class="post-header">
                <h4>John Doe</h4>
            </div>
            <div class="post-content">
                This is an example post content. Sharing some exciting news today!
            </div>
            <div class="post-footer">
                <div class="actions">
                    <button>Like</button>
                    <button>Dislike</button>
                    <button>Comment</button>
                </div>
            </div>
        </div>
        <div class="post">
            <div class="post-header">
                <h4>Jane Smith</h4>
            </div>
            <div class="post-content">
                Had a wonderful day at the park! Nature is truly amazing.
            </div>
            <div class="post-footer">
                <div class="actions">
                    <button>Like</button>
                    <button>Dislike</button>
                    <button>Comment</button>
                </div>
            </div>
        </div>
        <div class="post">
            <div class="post-header">
                <h4>Alex Johnson</h4>
            </div>
            <div class="post-content">
                Excited to announce my new blog post is live. Check it out on my website!
            </div>
            <div class="post-footer">
                <div class="actions">
                    <button>Like</button>
                    <button>Dislike</button>
                    <button>Comment</button>
                </div>
            </div>
        </div>
    `
    postsFeed.innerHTML = postsFeedContent;

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
    validatePost();
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
                    <input type="checkbox" name="topics" id="${category.ID}">
                    <span class="control__content">
                        <svg aria-hidden="true" focusable="false" width="30" height="30" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="15" fill="#1E1B1D"></circle><path d="M10.78 21h1.73l.73-3.2h2.24l-.74 3.2h1.76l.72-3.2h3.3v-1.6H17.6l.54-2.4H21v-1.6h-2.5l.72-3.2h-1.73l-.73 3.2h-2.24l.74-3.2H13.5l-.73 3.2H9.5v1.6h2.93l-.56 2.4H9v1.6h2.52l-.74 3.2zm2.83-4.8l.54-2.4h2.24l-.54 2.4H13.6z" fill="#fff"></path></svg>
                        ${category.Name}
                    </span>
                </label>
            `
        )
        .join("");
}

function validatePost(){
    document.getElementById('postForm').addEventListener('submit', function (event) {
        let isValid = true;
    
        document.getElementById('title-error').textContent = '';
        document.getElementById('category-error').textContent = '';
        document.getElementById('textarea-error').textContent = '';
    
    
        const titleInput = document.querySelector('input[name="title"]');
        if (titleInput.value.length > 250) {
            document.getElementById('title-error').textContent = 'Maximum 255 characters.';
            isValid = false;
        }
        if (!titleInput.value.trim()) {
            document.getElementById('title-error').textContent = 'Title is required.';
            isValid = false;
        }
    
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
        if (categoryCheckboxes.length === 0) {
            document.getElementById('category-error').textContent = 'Please select at least one category.';
            isValid = false;
        }
    
        const textareaInput = document.querySelector('textarea[name="textarea"]');
        if (textareaInput.value.length > 10000) {
            document.getElementById('textarea-error').textContent = "Maximum 10000 characters.";
            isValid = false;
        }
        if (!textareaInput.value.trim()) {
            document.getElementById('textarea-error').textContent = 'Description is required.';
            isValid = false;
        }
        if (!isValid) {
            event.preventDefault();
        }
    });
}