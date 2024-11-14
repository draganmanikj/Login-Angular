import { afterNextRender, Component, DestroyRef, viewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime, subscribeOn } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component-template-driven.html',
  imports: [FormsModule],
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild<NgForm>('form')
  private destroyRef = inject(DestroyRef)
  constructor() {
    afterNextRender(() => { //da se save-ne toa sto stavil userot vo localstorage na vrowser ako se reloadne
      const savedForm = window.localStorage.getItem('saved-login-form')

      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedEmail = loadedFormData.email;
        setTimeout(() => {
          this.form()?.controls['email'].setValue(savedEmail);
        }, 1);
      }

      const subscription = this.form()?.valueChanges?.pipe(debounceTime(500)).subscribe({
        next: (value) =>
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          ),
      });
      this.destroyRef.onDestroy( () => subscription?.unsubscribe()) 
    })

    
  }

  onSubmit(formData: NgForm) {
    console.log('form', formData);

    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;

    formData.form.reset();
  }

}
