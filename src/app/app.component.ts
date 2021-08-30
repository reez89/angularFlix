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
import { concatAll, concatMap, first, map , tap} from 'rxjs/operators';

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
  upcoming: Movies;
  topRated: Movies;
  popular: Movies;
  nowPlaying: Movies;
  latest: Movies;
  upcomingVideo: MoviesVideo;
  popularVideo: MoviesVideo;
  topRatedVideo: MoviesVideo;
  nowPlayingVideo: MoviesVideo;
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

  ngOnInit() {
    // UPCOMING
    this.subs.push(
      this.movie.getUpcoming().pipe(tap((data)  => {
        this.upcoming = data;
        this.headerBGUrl = 'https://image.tmdb.org/t/p/original' + this.upcoming.results[0].backdrop_path;
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
        console.log(this.nowPlaying);

      }))
    );

    forkJoin(this.subs).subscribe( data => {
      const upcoming = [];
      const popular = [];
      const topRated = [];
      const nowPlaying = [];
      upcoming.push(data[0]);
      popular.push(data[1]);
      topRated.push(data[2]);
      nowPlaying.push(data[4]);

      upcoming.forEach(el => {
        el.results.forEach(id => {
          this.subsVideo.push(this.movie.getMovieVideos(id.id).pipe(
            tap((videoTranding: MoviesVideo) => {
              this.upcomingVideo = videoTranding;
              console.log('UPCOMING', this.upcomingVideo);
            })
          ));
        });
      }); // 20
      popular.forEach(el => {
        el.results.forEach(id => {
          this.subsVideo.push(this.movie.getMovieVideos(id.id).pipe(
            tap((videoPopular: MoviesVideo) => {
              this.popularVideo = videoPopular;
              console.log('POPULAR', this.popularVideo);
            })
          ));
        });
      }); // 20
      topRated.forEach(el => {
        el.results.forEach(id => {
          this.subsVideo.push(this.movie.getMovieVideos(id.id).pipe(
            tap((videoTopRated: MoviesVideo) => {
              this.topRatedVideo = videoTopRated;
              console.log('TOP', this.topRatedVideo);
            })
          ));
        });
      }); // 20
      nowPlaying.forEach(el => {
        el.results.forEach(id => {
          this.subsVideo.push(this.movie.getMovieVideos(id.id).pipe(
            tap((videoNowPlaying: MoviesVideo) => {
              this.nowPlayingVideo = videoNowPlaying;
              console.log('PALYING', this.nowPlayingVideo);
            })
          ));
        });
      }); // 20

      forkJoin([...this.subsVideo]).subscribe();
    });

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


