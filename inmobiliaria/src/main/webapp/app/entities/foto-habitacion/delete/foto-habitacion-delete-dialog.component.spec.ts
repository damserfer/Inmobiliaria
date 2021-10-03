jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FotoHabitacionService } from '../service/foto-habitacion.service';

import { FotoHabitacionDeleteDialogComponent } from './foto-habitacion-delete-dialog.component';

describe('Component Tests', () => {
  describe('FotoHabitacion Management Delete Component', () => {
    let comp: FotoHabitacionDeleteDialogComponent;
    let fixture: ComponentFixture<FotoHabitacionDeleteDialogComponent>;
    let service: FotoHabitacionService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FotoHabitacionDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(FotoHabitacionDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FotoHabitacionDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FotoHabitacionService);
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
