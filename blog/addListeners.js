import Entries from "../content/09-2026/sept.json" with { type: "json" };

const BlogUL = document.querySelector('#scrollContainer ul');
const BlogHeader = document.getElementById("blogHeader");
const ScrollContainer = document.getElementById("scrollContainer");
const ArticleSpace = document.getElementById('actArticle');
let articleIsOpen = false;
let selectedPostCard = null;
let closeButtonHasFocus = false;

BlogUL.setAttribute("tabindex", "-1");
ArticleSpace.addEventListener("focusin", (event) => {
    closeButtonHasFocus = event.target.matches(".closeArticleBtn");
});

function syncArticleViewport() {
    const isMobile = window.matchMedia("(max-width: 840px)").matches;
    const articleIsModal = isMobile && articleIsOpen;
    const closeButton = ArticleSpace.querySelector(".closeArticleBtn");
    const closeButtonWasFocused = closeButtonHasFocus;
    ArticleSpace.classList.toggle("articleOpen", isMobile && articleIsOpen);
    const articleIsHidden = isMobile && !articleIsOpen;
    ArticleSpace.toggleAttribute("inert", articleIsHidden);
    ArticleSpace.setAttribute("aria-hidden", String(articleIsHidden));
    ArticleSpace.setAttribute("role", articleIsModal ? "dialog" : "region");
    if (articleIsModal) {
        ArticleSpace.setAttribute("aria-modal", "true");
    } else {
        ArticleSpace.removeAttribute("aria-modal");
    }

    for (const background of [BlogHeader, ScrollContainer]) {
        background.toggleAttribute("inert", articleIsModal);
        background.setAttribute("aria-hidden", String(articleIsModal));
    }

    if (closeButton) closeButton.disabled = articleIsHidden;
    if (articleIsModal && !ArticleSpace.contains(document.activeElement)) {
        closeButton?.focus({ preventScroll: true });
    } else if (!isMobile && closeButtonWasFocused) {
        closeButtonHasFocus = false;
        const focusTarget = selectedPostCard?.querySelector("a, button") || selectedPostCard || BlogUL;
        focusTarget.focus({ preventScroll: true });
    }
}

function openPost(postID) {
    const availablePosts = Entries.filter((entry) => entry.id && entry.title);
    const post = availablePosts.find((entry) => String(entry.id) === String(postID)) || availablePosts[0];

    if (!post) {
        ArticleSpace.innerHTML = "<p>No blog posts are available yet.</p>";
        ArticleSpace.removeAttribute("aria-labelledby");
        return;
    }

    selectedPostCard = [...BlogUL.querySelectorAll(".CardListItem")]
        .find((card) => card.dataset.postId === String(post.id)) || null;
    BlogUL.querySelectorAll(".CardListLink").forEach((link) => {
        if (link.closest(".CardListItem") === selectedPostCard) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    ArticleSpace.innerHTML = "";

    const article = document.createElement("article");

    article.innerHTML = `
        <p>${post.published_at}</p>
        <h2 id="currentPostTitle">${post.title}</h2>
        <p>${post['cover-description']}</p>

        <div class="tagList">
            ${post.tags.map(tag => `<span>${tag}</span>`).join(" ")}
        </div>

        <p>${post.content}</p>
  `;

    const closeButton = document.createElement("button");

    closeButton.className = "closeArticleBtn";
    closeButton.type = "button";
    closeButton.textContent = "Close";
    closeButton.setAttribute("aria-label", "Close article and return to the post list");
    closeButton.addEventListener("click", () => {
        articleIsOpen = false;
        closeButtonHasFocus = false;
        syncArticleViewport();
        const focusTarget = selectedPostCard?.querySelector("a, button") || selectedPostCard || BlogUL;
        focusTarget.focus({ preventScroll: true });
    });

    article.prepend(closeButton);

    ArticleSpace.appendChild(article);
    ArticleSpace.setAttribute("aria-labelledby", "currentPostTitle");

    articleIsOpen = true;
    syncArticleViewport();
    if (window.matchMedia("(max-width: 840px)").matches) {
        ArticleSpace.scrollTop = 0;
    }

  const url = new URL(window.location.href);
  url.searchParams.set("post", String(post.id));
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

window.addEventListener("resize", syncArticleViewport);

BlogUL.addEventListener("click", (event) => {
    const clickedLink = event.target.closest(".CardListItem a");

    if (!clickedLink || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    openPost(clickedLink.closest(".CardListItem").dataset.postId);
});

ArticleSpace.addEventListener("keydown", (event) => {
    if (!window.matchMedia("(max-width: 840px)").matches || !articleIsOpen) return;

    if (event.key === "Escape") {
        event.preventDefault();
        ArticleSpace.querySelector(".closeArticleBtn")?.click();
        return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = [...ArticleSpace.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => element.getClientRects().length > 0);

    if (focusableElements.length === 0) {
        event.preventDefault();
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && (document.activeElement === firstElement || !ArticleSpace.contains(document.activeElement))) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
});

const requestedPost = new URLSearchParams(window.location.search).get("post");
openPost(requestedPost);
