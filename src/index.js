const queryString = 'photo'

const preparedQueryString = queryString.split(' ').join('+')

fetch('https://pixabay.com/api/?key=42616833-896f8cea99ad334a7f66558d0&orientation=horizontal&safesearch=true&per_page=12&page=1')
.then((response) => response.json())
.then(({ hits }) => {
    const markupArray = hits.flatMap(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
    <div class="photo-card">
<img src="${webformatURL}" alt="" loading="lazy" />
<div class="info">
    <p class="info-item">
    <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
    <b>Views: ${views}</b>
    </p>
    <p class="info-item">
    <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
    <b>Downloads: ${downloads}</b>
    </p>
</div>
</div>`);

return markupArray;

})
.then((markupArray) => {
    const gallery = document.querySelector(".gallery");
    gallery.innerHtml = markupArray.join("");
})