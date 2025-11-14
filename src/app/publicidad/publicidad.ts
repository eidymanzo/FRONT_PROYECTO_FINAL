import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-publicidad',
  imports: [],
  templateUrl: './publicidad.html',
  styleUrl: './publicidad.css',
})
export class Publicidad {

  private
  constructor(private http: HttpClient){
    
    
  }
  
    
      http.post<{ message: string }>('http://localhost:8080/api/publicidad', {  })
     
}
