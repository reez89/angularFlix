import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  generalMovie = '/movie/',
  video = '/videos'
}
@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private URL = 'https://api.themoviedb.org/3';
  private youtubeURL = 'https://www.youtube.com/watch?v=';
  private apiKey = environment.apiKey;
  private lan = environment.lan;

  constructor(private http: HttpClient) { }

  getLatestMovie(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.latest}`,
    {params: {api_key: this.apiKey, language: this.lan}});
  }
  getNowPlaying(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.now_playing}`,
    {params: {api_key: this.apiKey, language: this.lan}});
  }
  getOriginals(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.orginals}`,
    {params: {api_key: this.apiKey, language: this.lan}});
  }
  getPopular(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.popular}`,
    {params: {api_key: this.apiKey, language: this.lan}});
  }
  getTopRated(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.top_rated}`,
    {params: {api_key: this.apiKey, language: this.lan}});
  }
  getTranding(): Observable<Movies>{
    return this.http.get<Movies>(`${this.URL}${endpoint.tranding}`,
    {params: {api_key: this.apiKey, language: this.lan}});
  }

  getMovieVideos(movieId: number): Observable<MoviesVideo>{
    return this.http.get<MoviesVideo>
          (`${this.URL}${endpoint.generalMovie}${movieId}${endpoint.video}`,    {params: {api_key: this.apiKey, language: this.lan}}
          );
    // return this.http.get(`https://api.themoviedb.org/3/movie/1402/videos?api_key=63c44cc4459f95138303a72049a37548&language=en-US
    // `).pipe(
    //   tap(data => console.log(data))
    // )
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
