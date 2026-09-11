import Entries from "../content/09-2026/test.json" with { type: "json" };
import { readFile, writeFile } from "node:fs/promises";

const filePath = "index.html";
const content = Entries[0];

const BlogPost = {
  pubDate: content.published_at,
  title: content.title,
  desc: content["cover-description"],
};

const LatestBlogCard = `<article class="blogCard">
  <p>${BlogPost.pubDate}</p>
  <p>${BlogPost.title}</p>
  <p>${BlogPost.desc}</p>
  <a href="./blog/blog.html">Click Here to Read More...</a>
</article>`;

async function writeLatestPost() {
  try {
    const file = await readFile(filePath, "utf8");

    const updatedFile = file.replace(
      /<!-- BLOG_CARDS_START -->([\s\S]*?)<!-- BLOG_CARDS_END -->/,
      `<!-- BLOG_CARDS_START -->\n${LatestBlogCard}\n<!-- BLOG_CARDS_END -->`
    );

    if (updatedFile === file) {
      throw new Error("Could not find BLOG_CARDS_START / BLOG_CARDS_END markers");
    }

    await writeFile(filePath, updatedFile, "utf8");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

writeLatestPost();