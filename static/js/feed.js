let isLoading = false;
let stopLoading = false;

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
    postForm.tabIndex = "0";
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
    let posts = document.querySelectorAll(".post");
    if (posts.length === 0) {
        postsFeed.innerHTML = `<div class="no-results">No Results Found.</div>`
    }
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
            if (!formContainer.contains(event.relatedTarget)) {
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
            formContainer.classList.remove('expanded');
            postFormElement.classList.remove('active');
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
                        const feed = document.querySelector(".feed");
                        feed.innerHTML = "";
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
            if (!data.posts) {
                stopLoading = true;
            } else {
                stopLoading = false;
                populatePosts(data.posts);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}
function populatePosts(posts) {
    const feed = document.querySelector(".feed");
    feed.innerHTML = "";
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
                    <pre>${post.Content}</pre>
                </div>
                <div class="post-footer">
                    <div class="actions">
                        <button>${post.LikeCount} Like</button>
                        <button>${post.DisLikeCount} Dislike</button>
                        <button class="toggle-comment" id=${post.PostID}>${post.CommentCount} Comment</button>
                    </div>
                </div>
                <div class="comment-section" style="display: none;">
                    <div class="comments"></div>
                    <button class="loadMore">Load More ...</button>
                    <div class="comment-form">
                        <textarea placeholder="Add a comment..."></textarea>
                        <p id="err"></p>
                        <button class="submit-comment">Submit</button>
                    </div>
                </div>`;
            feed.appendChild(postElement);

            const toggleCommentButton = postElement.querySelector('.toggle-comment');
            const commentSection = postElement.querySelector('.comment-section');
            const loadMoreButton = postElement.querySelector('.loadMore');

            toggleCommentButton.addEventListener('click', () => {
                if (commentSection.style.display === 'none') {
                    commentSection.style.display = 'block';
                    if (!commentSection.dataset.loaded) {
                        loadComments(post.PostID, commentSection.querySelector('.comments'), 0, loadMoreButton);
                        commentSection.dataset.loaded = true;
                    }
                } else {
                    commentSection.style.display = 'none';
                }
            });

        
            loadMoreButton.addEventListener('click', () => {
                const currentOffset = parseInt(loadMoreButton.dataset.offset) || 0;
                const nextOffset = currentOffset + 5;
                loadComments(post.PostID, commentSection.querySelector('.comments'), nextOffset, loadMoreButton);
                loadMoreButton.dataset.offset = nextOffset;
            });

            const submitCommentButton = postElement.querySelector('.submit-comment');
            const commentTextarea = postElement.querySelector('.comment-form textarea');

            submitCommentButton.addEventListener('click', () => {
                const errParagraph = document.getElementById("err");
                errParagraph.textContent = "";
                const comment = commentTextarea.value.trim();
                if (comment) {
                    submitComment(post.PostID, comment, commentSection.querySelector('.comments'));
                    commentTextarea.value = '';
                } else {
                    errParagraph.textContent = "Invalid Comment";
                }
            });
        });
    }
}

function loadComments(postId, commentsContainer, offset = 0, loadMoreButton) {
    fetch(`/api/comment/${postId}/${offset}`)
        .then(response => response.json())
        .then(comments => {
            if (!comments || comments.length === 0) {
                if (offset === 0) {
                    commentsContainer.innerHTML = '<p class="no-comment">No comments yet.</p>';
                }
                loadMoreButton.style.display = 'none';
            } else {
                if (offset === 0) {
                    commentsContainer.innerHTML = comments.map(comment => `
                        <div class="comment">
                            <div class="comment-header">
                                <div class="user-info">
                                    <h4>${comment.Username}</h4>
                                </div>
                                <span class="timestamp">Commented on: ${comment.FormattedDate}</span>
                            </div>
                            <div class="comment-content"><pre>${comment.Content}</pre></div>
                        </div>
                    `).join('');
                } else {
                    comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.className = 'comment';
                        commentElement.innerHTML = `
                            <div class="comment-header">
                                <div class="user-info">
                                    <h4>${comment.Username}</h4>
                                </div>
                                <span class="timestamp">Commented on: ${comment.FormattedDate}</span>
                            </div>
                            <div class="comment-content"><pre>${comment.Content}</pre></div>
                        `;
                        commentsContainer.appendChild(commentElement);
                    });
                }
                if (comments.length < 5 || comments[0].TotalCount <= offset+5) {
                    loadMoreButton.style.display = 'none';
                } else if(comments[0].TotalCount > offset) {
                    loadMoreButton.style.display = 'block';
                }
            }
        })
        .catch(error => {
            console.error('Error loading comments:', error);
        });
}

function submitComment(postId, comment, commentsContainer) {
    const commentCountButton = document.getElementById(postId);
    fetch(`/api/sendcomment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment, postId: postId }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(newComment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <div class="user-info">
                        <h4>${newComment.Username}</h4>
                    </div>
                    <span class="timestamp">Commented on: ${newComment.FormattedDate}</span>
                </div>
                <div class="comment-content"><pre>${newComment.Content}</pre></div>
            `;
            commentsContainer.insertBefore(commentElement, commentsContainer.firstChild); // Add new comment at the top
            const noComment=  commentsContainer.querySelector('.no-comment');
            if (noComment)commentsContainer.removeChild(noComment);
            const totalCount = newComment.TotalCount;
            commentCountButton.textContent = `${totalCount} Comment${totalCount !== 1 ? 's' : ''}`;
        })
        .catch(error => {
            console.error('Error submitting comment:', error);
        });
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
    if (isLoading) return;

    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight && !stopLoading) {
        isLoading = true;

        const feed = document.querySelector('.feed');
        const placeholder = document.createElement('div');
        placeholder.className = 'post-placeholder';
        placeholder.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <h4 style="background: #e0e0e0; height: 20px; width: 100px; border-radius: 4px;"></h4>
                </div>
                <span class="timestamp" style="background: #e0e0e0; height: 16px; width: 120px; border-radius: 4px; display: inline-block;"></span>
            </div>
            <div class="post-title" style="background: #e0e0e0; height: 18px; width: 70%; margin: 10px 0; border-radius: 4px;"></div>
            <div class="post-categories" style="background: #e0e0e0; height: 14px; width: 50%; margin: 5px 0; border-radius: 4px;"></div>
            <div class="post-content" style="background: #e0e0e0; height: 40px; width: 100%; margin: 10px 0; border-radius: 4px;"></div>
            <div class="post-footer">
                <div class="actions">
                    <button style="background: #e0e0e0; height: 16px; width: 60px; border-radius: 4px; border: none; margin-right: 10px;"></button>
                    <button style="background: #e0e0e0; height: 16px; width: 60px; border-radius: 4px; border: none; margin-right: 10px;"></button>
                    <button style="background: #e0e0e0; height: 16px; width: 80px; border-radius: 4px; border: none;"></button>
                </div>
            </div>
        `;
        feed.appendChild(placeholder);
        window.scrollTo(0, document.body.scrollHeight);
        let posts = document.querySelectorAll(".post");

        setTimeout(() => {
            try {
                getPosts(posts.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                feed.removeChild(placeholder);
                isLoading = false;
            }
        }, 5000);
    }
})