import { Component, Input, OnInit } from '@angular/core';
import { Movies, MoviesVideo } from 'src/app/models/movies';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() sliderConfig;
  @Input() movies: Movies;
  @Input() title: string;
  @Input() trailer: MoviesVideo[] = [];
  @Input() videoUrl: string;

  hoverIndex: any;

  constructor() { }

  ngOnInit() {
  }

  enter(i) {
    this.hoverIndex = i;
    console.log(i)
  }
  
  leave(i) {
    this.hoverIndex = null;
  }

}
