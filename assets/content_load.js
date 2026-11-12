// You do not need to change this file.
// It reads the page name from the address (index.html?page=page_two),
// loads pages/page_two.md, shows it on the page, and counts its characters.

const pageName = new URLSearchParams(window.location.search).get("page") || "page_one";
const file = "./pages/" + pageName + ".md";

// Give the page an id with its name, so style.css can style one page, e.g. #page_two h2 { ... }
document.body.id = pageName;

const content = document.getElementById("content");
const charCount = document.getElementById("charCount");

fetch(file)
  .then((response) => {
    if (!response.ok) {
      throw new Error("the file does not exist");
    }
    return response.text();
  })
  .then((markdown) => {
    content.innerHTML = marked.parse(markdown);

    // The first # heading in the markdown becomes the banner heading and the tab title.
    const heading = content.querySelector("h1");
    if (heading) {
      document.querySelector("header h1").textContent = heading.textContent;
      document.title = heading.textContent;
      heading.remove();
    }

   // I changed the charactercount so it wouldn't count my sources on the bottom
    
// Make a copy of the content so the sources remain visible
const countContent = content.cloneNode(true);

// Find the Sources paragraph
const sourceHeading = Array.from(countContent.querySelectorAll("p"))
  .find(p => p.textContent.trim() === "Sources:");

if (sourceHeading) {
  // Remove Sources and everything after it
  let element = sourceHeading;
  while (element) {
    const next = element.nextElementSibling;
    element.remove();
    element = next;
  }
}

// Count the remaining text
charCount.textContent = countCharacters(countContent.textContent) + " characters";

  })
  .catch((error) => {
    content.textContent = "Could not load " + file + ": " + error.message;
  });

// Counts the characters a reader sees, including spaces, but not the markdown symbols.
function countCharacters(text) {
  return text.replace(/\s+/g, " ").trim().length;
}
