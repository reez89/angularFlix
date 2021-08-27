import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Movies, MoviesVideo } from './models/movies';
import { MovieService } from './services/movie.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first, map , switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'angularFlix';
  sticky = false;

  subs: Array<Observable<any>> = [];
  subs_: Subscription[] = [];

/* MOVIE VARIABLES */
  tranding: Movies;
  topRated: Movies;
  popular: Movies;
  originals: Movies;
  nowPlaying: Movies;
  latest: Movies;
  prova;
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
    this.subs.push(this.movie.getPopular().pipe(
      tap((data: Movies) => {
        this.popular = data;
    })));

    this.subs.push(this.movie.getTopRated().pipe(
      tap((data: Movies) => {
        this.topRated = data;
        })
      )
    );

    this.subs.push(this.movie.getLatestMovie().pipe(
      tap((data: Movies) => {
        this.latest = data;
    })));

    this.subs.push(this.movie.getNowPlaying().pipe(
      tap((data: Movies) => {
        this.nowPlaying = data;
    })));

    this.subs.push(this.movie.getOriginals().pipe(
      tap((data: Movies) => {
        this.originals = data;
    })));


    forkJoin([...this.subs]).pipe(first()).subscribe(([popular, topRated, latest, nowPlaying, originals]) => {
      const data = popular.results;
      const newDataArray: Array<Number>[] = [];
      if(!!popular.results){
        data.forEach((id) => {
         newDataArray.push(id.id);
        })
        console.log(newDataArray);
      }
      console.log(popular.results.forEach((id) => {id} ));
    });
  }

  ngOnDestroy(){
   /*  this.subs.map(s => s.unsubscribe()) */
  }

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


