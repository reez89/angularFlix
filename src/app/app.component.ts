import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { forkJoin, Observable, pipe, Subscription } from 'rxjs';
import { Movies, MoviesVideo } from './models/movies';
import { MovieService } from './services/movie.service';
import { HttpClient } from '@angular/common/http';
import { exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
} )
export class AppComponent implements OnInit, OnDestroy {

  @Input() search: string;
  hoverIndex: any;
  sticky = false;
  subs: Array<Observable<any>> = [];
  subsVideo: Array<Observable<any>> = [];
  videoUrl: string = "https://www.youtube.com/embed/";
  /* MOVIE VARIABLES */
  upcoming: Movies;
  topRated: Movies;
  popular: any;
  nowPlaying: Movies;
  latest: Movies;
  /* SLIDER CONFIG */
  sliderConfing = {
    slidesToShow: 9,
    slidesToScroll: 2,
    arrows: true,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  @ViewChild( 'stickHeader' ) header: ElementRef;
  headerBGUrl: string;

  constructor(
    private movie: MovieService,
    private http: HttpClient,
    private hostElement: ElementRef,
    private domSanitizer: DomSanitizer ) {}

  ngOnInit() {

    // UPCOMING
    this.subs.push(
      this.movie.getUpcoming().pipe( tap( ( data ) => {
        this.upcoming = data;
        this.headerBGUrl = 'https://image.tmdb.org/t/p/original' + this.upcoming.results[ 0 ].backdrop_path;
      } ) )
    );
    // POPULAR
    this.subs.push( this.movie.getPopular().pipe(
      tap( ( data: Movies ) => {
        this.popular = data;
      } ) )
    );
    // TOP RATED
    this.subs.push( this.movie.getTopRated().pipe(
      tap( ( data: Movies ) => {
        this.topRated = data;
      } ) )
    );
    // LATEST
    this.subs.push( this.movie.getLatestMovie().pipe(
      tap( ( data: Movies ) => {
        this.latest = data;
      } ) )
    );
    // NOW PLAYING
    this.subs.push( this.movie.getNowPlaying().pipe(
      switchMap( ( data: Movies ) => {
        return data.results;
      } ),
      map( ( data: any ) => {
        this.nowPlaying = data;
        this.subsVideo.push(
          this.movie.getMovieTrailer( data.id ).pipe(
            map( ( trailers: MoviesVideo ) => {
              return this.nowPlaying = {
                ...data,
                trailers
              };
            } )
          ) );
      } ),
    )
    );


    forkJoin( this.subs ).subscribe( () => {
      // Without trailers
      console.log( this.nowPlaying );
      // With trailers
      forkJoin( this.subsVideo ).subscribe( () => {
        console.log( this.nowPlaying );
      } );
    } );

  }

  ngOnDestroy() {}

  @HostListener( 'window:scroll', [ '$event' ] )
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if ( windowScroll >= this.header.nativeElement.offsetHeight ) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }


}


