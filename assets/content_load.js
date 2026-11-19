do not need to change this file.
// It reads the page name from the address (index.html?page=page_two),
// loads pages/page_two.md, shows it on the page, and counts its characters.
// It also adds up the characters of all the pages in the navigation and shows the total in the header.
// A references section is never counted: that is a headline called "References"
// (or "Bibliography", "Works cited", "Referencer", "Litteraturliste") and everything under it.

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

    charCount.textContent = countCharacters(withoutReferences(content)) + " characters on this page (references not counted)";
  })
  .catch((error) => {
    content.textContent = "Could not load " + file + ": " + error.message;
  });

// Counts the characters a reader sees, including spaces, but not the markdown symbols.
function countCharacters(text) {
  return text.replace(/\s+/g, " ").trim().length;
}

// Returns the text of an element without its references section.
// It works on a copy, so the references are still shown on the page.
function withoutReferences(element) {
  const copy = element.cloneNode(true);
  const referenceNames = ["references", "reference list", "bibliography", "works cited", "referencer", "litteraturliste"];

  copy.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
    if (!referenceNames.includes(heading.textContent.trim().toLowerCase())) {
      return;
    }
    // remove everything under the headline, until the next headline of the same or a higher level
    const level = parseInt(heading.tagName[1]);
    let next = heading.nextElementSibling;
    while (next && !(/^H[1-6]$/.test(next.tagName) && parseInt(next.tagName[1]) <= level)) {
      const afterNext = next.nextElementSibling;
      next.remove();
      next = afterNext;
    }
    heading.remove();
  });

  return copy.textContent;
}

// Counts one markdown text the same way as the page count above:
// the banner heading (the first #) and the references are left out.
function countMarkdown(markdown) {
  const holder = document.createElement("div");
  holder.innerHTML = marked.parse(markdown);
  const heading = holder.querySelector("h1");
  if (heading) {
    heading.remove();
  }
  return countCharacters(withoutReferences(holder));
}

// The total: every page that has a link in the navigation is loaded and counted.
const totalCount = document.getElementById("totalCount");
const allPages = Array.from(document.querySelectorAll(".navLink"))
  .map((link) => new URL(link.href).searchParams.get("page"))
  .filter((name, i, names) => name && names.indexOf(name) === i);

if (totalCount) {
  Promise.all(
    allPages.map((name) =>
      fetch("./pages/" + name + ".md").then((response) => {
        if (!response.ok) {
          throw new Error("pages/" + name + ".md does not exist");
        }
        return response.text();
      })
    )
  )
    .then((markdowns) => {
      const total = markdowns.reduce((sum, markdown) => sum + countMarkdown(markdown), 0);
      totalCount.textContent = "Total: " + total + " characters";
      totalCount.title = "All " + allPages.length + " pages added together. References are not counted.";
    })
    .catch((error) => {
      totalCount.textContent = "Could not count: " + error.message;
    });
}

