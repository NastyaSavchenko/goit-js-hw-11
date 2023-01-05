import './css/styles.css';
import Notiflix from 'notiflix';
import { Api } from './js/on-search';
import gallery from './templates/gallery.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  lodeMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.input-form'),
};

const api = new Api();
let simpleLightBox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);
refs.lodeMore.addEventListener('click', onLodeMoreClick);

async function onFormSubmit(e) {
  e.preventDefault();
  api.page = 1;

  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  api.query = searchQuery;

  if (searchQuery.length === 0) {
    refs.lodeMore.classList.add('js_is-hidden');
    return;
  }

  try {
    const { data } = await api.onSearch();

    if (data.totalHits === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    refs.gallery.innerHTML = '';

    Notiflix.Notify.success('Hooray! We found' + `${data.total}` + 'images.');

    refs.gallery.insertAdjacentHTML('beforeend', gallery(data.hits));
    refs.lodeMore.classList.remove('js_is-hidden');
    simpleLightBox.refresh();
  } catch (error) {
    console.warn(error);
  }
}

async function onLodeMoreClick() {
  api.page += 1;

  try {
    const { data } = await api.onSearch();

    refs.gallery.insertAdjacentHTML('beforeend', gallery(data.hits));
    simpleLightBox.refresh();
    scroll();
  } catch (error) {
    refs.lodeMore.classList.add('js_is-hidden');

    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function scroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
