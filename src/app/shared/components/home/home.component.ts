import { Component } from '@angular/core';
import { CoreModule } from '../../../core/core.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
