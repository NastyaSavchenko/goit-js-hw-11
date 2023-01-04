import axios from 'axios';


export class Api{
    #URL = `https://pixabay.com/api/`;
    #API_KEY = '32589447-ffbdd7a8f0a573b29764024b7';
  
    page = 1;
    query = null;

  onSearch() {
    return axios.get(`${this.#URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
  }
}
    
