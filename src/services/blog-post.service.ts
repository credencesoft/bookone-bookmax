import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
  private readonly apiUrl = `https://cdn.contentful.com/spaces/${environment.spaceId}/entries`;
  private readonly headers = new HttpHeaders({
    Authorization: `Bearer ${environment.accessToken}`
  });

  constructor(private http: HttpClient) { }

  getAllEntries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?include=10`, { headers: this.headers }).pipe(
      map((response) => this.resolveLinkedAssets(response))
    );
  }

  private resolveLinkedAssets(response: any): any {
    const assetMap = new Map<string, any>();

    response?.includes?.Asset?.forEach((asset: any) => {
      if (asset?.sys?.id) {
        assetMap.set(asset.sys.id, asset);
      }
    });

    const items = (response?.items || []).map((entry: any) => {
      const cityImages = entry?.fields?.citiesimages;

      if (!Array.isArray(cityImages)) {
        return entry;
      }

      return {
        ...entry,
        fields: {
          ...entry.fields,
          citiesimages: cityImages
            .map((image: any) => {
              const assetId = image?.sys?.id;
              return assetId ? assetMap.get(assetId) || image : image;
            })
            .filter((image: any) => image?.fields?.file?.url)
        }
      };
    });

    return {
      ...response,
      items
    };
  }
}
