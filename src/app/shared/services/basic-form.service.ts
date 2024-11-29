import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BasicFormService {

  protected formBuilder = inject(FormBuilder);

  createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    }, { updateOn: 'submit' });
  }
}
