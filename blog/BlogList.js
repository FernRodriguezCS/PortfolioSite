import { writeFile, readFile } from "node:fs/promises";
import Entries from "../content/09-2026/test.json" with { type: "json" };

//console.log(Entries);
const filePath = "blog.html";

async function writeNextListItem(){
    try{
        const file = await readFile(filePath, "utf8");

        // if found `<!--NEXT_LIST_ITEM_HERE-->` then next iteration begins after that
        // if not then simply place as first card item
        const updatedFile = file.replace(
             /<!--NEXT_LIST_ITEM_HERE-->|(?=\s*<!--BLOG_LIST_END-->)/,
            `${BlogCard}\n`
        );

        if(updatedFile === file){
            throw new Error("Could not identify appropriate marker");
        }

        await writeFile(filePath, updatedFile, "utf8");
    }catch(err){
        console.error("Error writing to file:", err)
    }
}

let BlogCard = ``;
let content = ``;

for(let i = 1; i < Entries.length - 1; i++){
    content = Entries[i];

    BlogCard = `<li class="CardListItem" data-post-id="${content.id}">
        <p>${content.published_at}</p>
        <p>${content.title}</p>
        <p>${content["cover-description"]}</p>
    </li>
    <!--NEXT_LIST_ITEM_HERE-->`;

    //console.log(BlogCard);

    await writeNextListItem();
}



