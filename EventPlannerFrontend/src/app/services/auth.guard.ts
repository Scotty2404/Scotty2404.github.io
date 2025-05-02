import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if user is logged in by verifying if token exists in localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // User is logged in, allow navigation
      return true;
    } else {
      // User is not logged in, redirect to login page
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }
}