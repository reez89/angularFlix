import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Movies, MoviesVideo } from './models/movies';
import { MovieService } from './services/movie.service';
import { HttpClient } from '@angular/common/http';
import { concatMap, first, map , mergeMap, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  @Input() search: string;

  sticky = false;
  subs: Array<Observable<any>> = [];
  subsVideo: Array<Observable<any>> = [];

/* MOVIE VARIABLES */
  tranding: Movies;
  topRated: Movies;
  popular: Movies;
  originals: Movies;
  nowPlaying: Movies;
  latest: Movies;
  originalsVideo: MoviesVideo;
/* SLIDER CONFIG */
  sliderConfing = {
    slidesToShow: 9,
    slidesToScroll: 2,
    arrows: true,
    autoplay: false,
  };

  @ViewChild ('stickHeader') header: ElementRef;
  headerBGUrl: string;

  constructor(private movie: MovieService, private http: HttpClient){}

  ngOnInit(): void {
    this.subs.push(
      this.movie.getTranding().pipe(tap((data)  => {
        this.tranding = data;
        this.headerBGUrl = 'https://image.tmdb.org/t/p/original' + this.tranding.results[0].backdrop_path;
      }))
    );
    // POPULAR
    this.subs.push(this.movie.getPopular().pipe(
      tap((data: Movies) => {
        this.popular = data;
     }))
    );
    // TOP RATED
    this.subs.push(this.movie.getTopRated().pipe(
      tap((data: Movies) => {
        this.topRated = data;
      }))
    );
    // LATEST
    this.subs.push(this.movie.getLatestMovie().pipe(
      tap((data: Movies) => {
        this.latest = data;
      }))
    );
    // NOW PLAYING
    this.subs.push(this.movie.getNowPlaying().pipe(
      tap((data: Movies) => {
        this.nowPlaying = data;
      }))
    );
    // ORIGINALS
    this.subs.push(this.movie.getOriginals().pipe(
      tap((data: Movies) => {
        this.originals = data;
      }))
    );

    forkJoin(this.subs).pipe(
      first(),
      concatMap((allMovies: Movies[]) => {
        const movies = this.originals.results;
        console.log('ARRAY ORIGINAL', allMovies);
        movies.forEach(trailer => {
            this.subsVideo.push(this.movie.getMovieVideos(trailer.id).pipe(
              tap((data: MoviesVideo) => {
                console.log(data);
                this.originalsVideo = data;
              })
            ));
        });
        console.log('ORIGINAL SUBS', this.subsVideo);
        console.log('ORIGINAL VIDEOS', this.originalsVideo);
        return forkJoin([...this.subsVideo]);
      })
    ).subscribe();


  }





  ngOnDestroy(){}

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.header.nativeElement.offsetHeight){
      this.sticky = true;
    }else{
      this.sticky = false;
    }
  }


}


