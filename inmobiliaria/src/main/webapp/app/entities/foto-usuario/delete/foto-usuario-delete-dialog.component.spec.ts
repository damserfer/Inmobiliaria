jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FotoUsuarioService } from '../service/foto-usuario.service';

import { FotoUsuarioDeleteDialogComponent } from './foto-usuario-delete-dialog.component';

describe('Component Tests', () => {
  describe('FotoUsuario Management Delete Component', () => {
    let comp: FotoUsuarioDeleteDialogComponent;
    let fixture: ComponentFixture<FotoUsuarioDeleteDialogComponent>;
    let service: FotoUsuarioService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FotoUsuarioDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(FotoUsuarioDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FotoUsuarioDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FotoUsuarioService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
