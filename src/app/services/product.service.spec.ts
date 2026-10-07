import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('posts multipart product updates so the backend can apply the method override', () => {
    const formData = new FormData();
    formData.append('name', 'Updated Jeans');
    formData.append('_method', 'PUT');

    service.updateProduct(2, formData).subscribe();

    const request = httpTestingController.expectOne(request => request.url.endsWith('/products/2'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(formData);
    request.flush({ message: 'Product updated successfully' });
  });

  it('keeps JSON product updates as PUT requests', () => {
    service.updateProduct(2, { name: 'Updated Jeans' }).subscribe();

    const request = httpTestingController.expectOne(request => request.url.endsWith('/products/2'));
    expect(request.request.method).toBe('PUT');
    request.flush({ message: 'Product updated successfully' });
  });
});
