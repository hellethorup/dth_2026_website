// here we state global variables

const articles = Array.from(document.getElementsByClassName("carouselArt"));
const btnLeft = document.getElementById("carouselBtnLeft");
const btnRight = document.getElementById("carouselBtnRight");

let artInFocus;

articles.forEach((art) => {
  if (!art.classList.contains("outOfFocusArt")) {
    return (artInFocus = art.dataset.artid);
  }
});

const featureArt = (i) => {
  articles.forEach((art) => {
    if (art.dataset.artid == i) {
      art.classList.remove("outOfFocusArt");
      art.classList.add("inFocusArt")
    } else {
      art.classList.add("outOfFocusArt");
      art.classList.remove("inFocusArt")
    }
  });
};

const moveCarousel = (e, direction) => {
  console.log(typeof artInFocus);
  console.log(artInFocus);
  switch (parseInt(artInFocus)) {
    case 1:
      if (direction == "next") {
        artInFocus = parseInt(artInFocus) + 1;
        console.log(typeof artInFocus);
        console.log(artInFocus);
        artInFocus = artInFocus.toString();
        featureArt(artInFocus);
        btnLeft.classList.remove("btnDisabled");
        btnLeft.removeAttribute("disabled");
      }
      break;
    case 2:
      if (direction == "prev") {
        artInFocus = parseInt(artInFocus) - 1;
        console.log(typeof artInFocus);
        console.log(artInFocus);
        artInFocus = artInFocus.toString();
        e.srcElement.setAttribute("disabled", "");
        e.srcElement.classList.add("btnDisabled");
        featureArt(artInFocus);
      } else if (direction == "next") {
        artInFocus = parseInt(artInFocus) + 1;
        console.log(typeof artInFocus);
        console.log(artInFocus);
        artInFocus = artInFocus.toString();
        e.srcElement.setAttribute("disabled", "");
        e.srcElement.classList.add("btnDisabled");
        featureArt(artInFocus);
      }
      break;
    case 3:
      if (direction == "prev") {
        artInFocus = parseInt(artInFocus) - 1;
        console.log(typeof artInFocus);
        console.log(artInFocus);
        artInFocus = artInFocus.toString();
        featureArt(artInFocus);
        btnRight.classList.remove("btnDisabled");
        btnRight.removeAttribute("disabled");
      }
      break;
  }
};

// only pages that have a carousel get the buttons wired up
if (btnLeft && btnRight) {
  btnLeft.addEventListener("click", (e) => moveCarousel(e, "prev"));
  btnRight.addEventListener("click", (e) => moveCarousel(e, "next"));
}
