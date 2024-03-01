import axios from 'axios';
import Notiflix from 'notiflix'; 
import _throttle from 'lodash.throttle';

const APIKEY = '42616833-896f8cea99ad334a7f66558d0';
const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');
const moreLoad = document.querySelector('.load-more');
const btn = document.querySelector('.btn');

let pageNow = 1;
let currentSearchName = '';
let lastPage = 1;
let searchQuery = '';
let autoScroll = false;

const fetchPhotos = async (name, page) => {
    try {
    const response = await axios(`https://pixabay.com/api/?key=${APIKEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    const photos = await response.data;
    checkResults(photos);
} catch (error) {
    Notiflix.Notify.failure(error.message);
}
};

const checkResults = (photos) => {
    if (photos.hits.length === 0) { 
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');   
        } else {    
            if (pageNow === 1) {
                Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
                const searchQuery = searchForm.searchQuery.value.trim();
                currentSearchName = searchQuery;
                lastPage = Math.ceil(photos.totalHits / 40);
                if (lastPage > 1 && autoScroll === false) {
                moreLoad.classList.add('is-visible')
            };
            }
            renderPhotos(photos);
            if(pageNow > 1) {
            renderScroll();
            }
            if (pageNow === lastPage) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results."); 
            moreLoad.classList.remove("is-visible");
            }
        }   
};

const renderPhotos = (photos) => {
    const markup = photos.hits
    .map((photo) => {
    return `
        <div class="photo-card">
            <a href="${photo.largeImageURL}">
            <img src="${photo.webformatURL}" alt="${photo.tags}" 
            data-source="${photo.largeImageURL}" 
            loading="lazy" width="250" height="300"/>
            <div class="info">
            <p class="info-item"><span><b>Likes</b></span><span>${photo.likes}</span></p>
            <p class="info-item"><span><b>Views</b></span><span>${photo.views}</span></p>
            <p class="info-item"><span><b>Comments</b></span><span>${photo.comments}</span></p>
            <p class="info-item"><span><b>Downloads</b></span><span>${photo.downloads}</span></p>
            </div>
        </a>
        </div>`})
    .join('');
    gallery.innerHTML += markup;
};

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchQuery = searchForm.searchQuery.value.trim();
    if(!searchQuery) {
    Notiflix.Notify.info('Please enter a search query.');
    gallery.innerHTML = '';
    pageNow = 1;
    }else if(searchQuery.length < 3) {
    Notiflix.Notify.info('Please enter a search query with at least 3 letters.');
} else {
pageNow = 1;
gallery.innerHTML = '';
currentSearchName = searchQuery;
fetchPhotos(searchQuery, pageNow);
}
});

btn.addEventListener('click', () => {
if (autoScroll === false) {
    autoScroll = true;
    window.addEventListener('scroll', infinityScroll);
    Notiflix.Notify.info('Loading method has been changed to auto.');
} else {
    autoScroll = false;
    window.removeEventListener('scroll', infinityScroll);
    Notiflix.Notify.info('Loading method has been changed to manual.');    
}  
btn.classList.toggle('is-active');
if (pageNow !== lastPage){
    moreLoad.classList.toggle('is-visible');
} 
})

moreLoad.addEventListener('click', () => {
pageNow++;
fetchPhotos(currentSearchName, pageNow); 
if(pageNow === lastPage) {
    Notiflix.Notify.info('Sorry, but you have reached the end of the search results.'); 
    moreLoad.classList.remove('is-visible');
}  
})

const infinityScroll = _throttle(() => {
if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
    if (actualPage < lastPage) {
        actualPage++;
        fetchPhotos(currentSearchName, actualPage);     
        if (actualPage === lastPage) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results."); 
        btnMore.classList.remove("is-visible");
        }  
    } 
}
}, 300);