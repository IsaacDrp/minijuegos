
import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Gato } from './components/gato/gato';
import { Nim } from './components/nim/nim';
import { Quince } from './components/quince/quince';
import { Documentation } from './components/documentation/documentation';
import { Credits } from './components/credits/credits';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'gato', component: Gato },
  { path: 'nim', component: Nim },
  { path: 'quince', component: Quince },
  { path: 'documentacion', component: Documentation },
  { path: 'creditos', component: Credits },
];
