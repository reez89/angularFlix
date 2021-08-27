import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movies, MoviesVideo } from '../models/movies';


const enum endpoint {
  latest = '/movie/latest',
  now_playing = '/movie/now_playing',
  popular = '/movie/popular',
  top_rated = '/movie/top_rated',
  upcoming = '/movie/upcoming',
  tranding = '/trending/all/week',
  orginals = '/discover/tv',
  id = '/movie/'
}
@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private URL = 'https://api.themoviedb.org/3';
  private youtubeURL = 'https://www.youtube.com/watch?v=';
  private api_key = environment.apiKey;

  constructor(private http: HttpClient) { }

  getLatestMovie(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.latest}`, {params: {api_key: this.api_key}});
  }
  getNowPlaying(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.now_playing}`, {params: {api_key: this.api_key}});
  }
  getOriginals(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.orginals}`, {params: {api_key: this.api_key}});
  }
  getPopular(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.popular}`, {params: {api_key: this.api_key}});
  }
  getTopRated(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.top_rated}`, {params: {api_key: this.api_key}});
  }
  getTranding(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.tranding}`, {params: {api_key: this.api_key}});
  }

  getMovieVideos(movieId): Observable<MoviesVideo>{
    return this.http.get<MoviesVideo>(`${this.URL}${endpoint.id}${movieId}/videos?`, {params: {api_key: this.api_key}});
  }


  /*
  https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=<<api_key>>&language=en-US

  RISULTATO DELLA CHIAMATA TRAMITE ID DEL FILM, PER OTTENERE LA KEY DEL VIDEO
  {
    "id": 423108,
    "results": [
        {
          "id": "608177732da846006e382e45",
          "iso_639_1": "en",
          "iso_3166_1": "US",
          "key": "qc6jN1BcJi0",
          "name": "Official Trailer – Warner Bros. UK & Ireland",
          "site": "YouTube",
          "size": 1080,
          "type": "Trailer"
        }
  */
}
