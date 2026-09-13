import Entries from "../content/09-2026/test.json" with { type: "json" };

const BlogUL = document.querySelector('ul');
const ArticleSpace = document.getElementById('actArticle');

BlogUL.addEventListener("click", (event) => {
    const clickedCard = event.target.closest(".CardListItem");

    if(!clickedCard) return;

    const postID = clickedCard.dataset.postId;
    const post = Entries.find((entry) => entry.id === postID);

    if(!post) return;

    ArticleSpace.innerHTML = "";

    const article = document.createElement("article");
    const isMobile = window.matchMedia("(max-width: 840px)").matches;

    article.innerHTML = `
        <p>${post.published_at}</p>
        <h2>${post.title}</h2>
        <p>${post['cover-description']}</p>

        <div class="tagList">
            ${post.tags.map(tag => `<span>${tag}</span>`).join(" ")}
        </div>

        <p>${post.content}</p>
  `;

  if(isMobile){
    const closeButton = document.createElement("button");

    closeButton.className = "closeArticleBtn";
    closeButton.type = "button";
    closeButton.textContent = "X";
    closeButton.addEventListener("click", () => {
        ArticleSpace.classList.remove("articleOpen");
    });

    article.prepend(closeButton);
  }

  ArticleSpace.appendChild(article);

  if(isMobile){
    ArticleSpace.scrollTop = 0;
    ArticleSpace.classList.add("articleOpen");
  }
    
});
