import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Donation } from '../models/donation.model';

interface DonationsResponse {
  data: Donation[];
}

@Injectable({
  providedIn: 'root'
})
export class DonationsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createPublicDonation(donation: Omit<Donation, 'id' | 'created_at' | 'updated_at' | 'category'>): Observable<Donation> {
    return this.http.post<Donation>(`${this.baseUrl}/donations`, donation);
  }

  getDonations(): Observable<Donation[]> {
    return this.http.get<DonationsResponse>(`${this.baseUrl}/donations`).pipe(
      map(response => response.data)
    );
  }

  getDonation(id: number): Observable<Donation> {
    return this.http.get<Donation>(`${this.baseUrl}/donations/${id}`);
  }

  updateDonation(id: number, donation: Partial<Donation>): Observable<Donation> {
    return this.http.put<Donation>(`${this.baseUrl}/donations/${id}`, donation);
  }

  deleteDonation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/donations/${id}`);
  }
}
