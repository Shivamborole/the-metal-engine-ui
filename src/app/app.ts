import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './Login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
