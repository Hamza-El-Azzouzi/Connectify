export function feedPage(){
    var link  = document.querySelector('link[rel="stylesheet"]');
    link.href = '/static/css/feed.css';
    const app = document.getElementById("main-content");
    const container = document.createElement('div');
    container.className = 'container';
    container.id = 'container';
    const postForm = document.createElement('div');
    postForm.className = "form-container";
    const postFormContent =`
        <div class="form-header">
            <input type="text" placeholder="Title" name="title">
        </div>
        <form id="postForm">
            <div class="form-group">
                <textarea id="postContent" name="content" placeholder="Enter text here..."></textarea>
            </div>
            <div class="form-group">
             <fieldset>
                <label class="control" for="technology">
                <input type="checkbox" name="topics" id="technology">
                <span class="control__content">
                    <svg aria-hidden="true" focusable="false" width="30" height="30" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="15" fill="#1E1B1D"></circle><path d="M10.78 21h1.73l.73-3.2h2.24l-.74 3.2h1.76l.72-3.2h3.3v-1.6H17.6l.54-2.4H21v-1.6h-2.5l.72-3.2h-1.73l-.73 3.2h-2.24l.74-3.2H13.5l-.73 3.2H9.5v1.6h2.93l-.56 2.4H9v1.6h2.52l-.74 3.2zm2.83-4.8l.54-2.4h2.24l-.54 2.4H13.6z" fill="#fff"></path></svg>
                    Technology
                </span>
                </label>
                <label class="control" for="health">
                <input type="checkbox" name="topics" id="health">
                <span class="control__content">
                    <svg aria-hidden="true" focusable="false" width="30" height="30" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="15" fill="#1E1B1D"></circle><path d="M10.78 21h1.73l.73-3.2h2.24l-.74 3.2h1.76l.72-3.2h3.3v-1.6H17.6l.54-2.4H21v-1.6h-2.5l.72-3.2h-1.73l-.73 3.2h-2.24l.74-3.2H13.5l-.73 3.2H9.5v1.6h2.93l-.56 2.4H9v1.6h2.52l-.74 3.2zm2.83-4.8l.54-2.4h2.24l-.54 2.4H13.6z" fill="#fff"></path></svg>
                    Health
                </span>
                </label>
                <label class="control" name="science">
                <input type="checkbox" name="topics" id="science">
                <span class="control__content">
                    <svg aria-hidden="true" focusable="false" width="30" height="30" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="15" fill="#1E1B1D"></circle><path d="M10.78 21h1.73l.73-3.2h2.24l-.74 3.2h1.76l.72-3.2h3.3v-1.6H17.6l.54-2.4H21v-1.6h-2.5l.72-3.2h-1.73l-.73 3.2h-2.24l.74-3.2H13.5l-.73 3.2H9.5v1.6h2.93l-.56 2.4H9v1.6h2.52l-.74 3.2zm2.83-4.8l.54-2.4h2.24l-.54 2.4H13.6z" fill="#fff"></path></svg>
                    Science
                </span>
                </label>
            </fieldset>
            </div>
            <div class="form-footer">
                <div class="icons">
                    
                </div>
                <button type="submit">Post</button>
            </div>
        </form>
    `
    postForm.innerHTML = postFormContent;
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
}

