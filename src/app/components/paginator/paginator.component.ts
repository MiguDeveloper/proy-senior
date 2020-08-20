import { Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() lstPages: number[] = [];
  @Input() currentPage: number;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Input() totalPages: number;
  desde: number;
  hasta: number;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngOnChanges() {    
    this.desde = Math.min(Math.max(1, this.currentPage - 4), this.totalPages - 5);
    this.hasta = Math.max(Math.min(this.totalPages, this.currentPage + 4), 6);

    if (this.totalPages > 5) {
      this.lstPages = new Array(this.hasta - this.desde + 1)
        .fill(0)
        .map((valor, indice) => indice + this.desde);
    }
  }

  siguiente() {
    if (!this.isLast) {
      this.router.navigate(['/clientes/page', this.currentPage + 1]);
    }
  }

  anterior() {
    if (!this.isFirst) {
      this.router.navigate(['/clientes/page', this.currentPage - 1]);
    }
  }

  goFirst() {
    this.router.navigate(['/clientes/page', 0]);
  }

  goLast() {
    this.router.navigate(['/clientes/page', this.totalPages - 1]);
  }
}
