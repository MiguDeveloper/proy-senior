import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  exports: [
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class MaterialModule { }
