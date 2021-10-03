package com.tfg.inmobiliaria.web.rest;

import com.tfg.inmobiliaria.domain.FotoHabitacion;
import com.tfg.inmobiliaria.repository.FotoHabitacionRepository;
import com.tfg.inmobiliaria.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.tfg.inmobiliaria.domain.FotoHabitacion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FotoHabitacionResource {

    private final Logger log = LoggerFactory.getLogger(FotoHabitacionResource.class);

    private static final String ENTITY_NAME = "fotoHabitacion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FotoHabitacionRepository fotoHabitacionRepository;

    public FotoHabitacionResource(FotoHabitacionRepository fotoHabitacionRepository) {
        this.fotoHabitacionRepository = fotoHabitacionRepository;
    }

    /**
     * {@code POST  /foto-habitacions} : Create a new fotoHabitacion.
     *
     * @param fotoHabitacion the fotoHabitacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fotoHabitacion, or with status {@code 400 (Bad Request)} if the fotoHabitacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/foto-habitacions")
    public ResponseEntity<FotoHabitacion> createFotoHabitacion(@RequestBody FotoHabitacion fotoHabitacion) throws URISyntaxException {
        log.debug("REST request to save FotoHabitacion : {}", fotoHabitacion);
        if (fotoHabitacion.getId() != null) {
            throw new BadRequestAlertException("A new fotoHabitacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FotoHabitacion result = fotoHabitacionRepository.save(fotoHabitacion);
        return ResponseEntity
            .created(new URI("/api/foto-habitacions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /foto-habitacions/:id} : Updates an existing fotoHabitacion.
     *
     * @param id the id of the fotoHabitacion to save.
     * @param fotoHabitacion the fotoHabitacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fotoHabitacion,
     * or with status {@code 400 (Bad Request)} if the fotoHabitacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fotoHabitacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/foto-habitacions/{id}")
    public ResponseEntity<FotoHabitacion> updateFotoHabitacion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FotoHabitacion fotoHabitacion
    ) throws URISyntaxException {
        log.debug("REST request to update FotoHabitacion : {}, {}", id, fotoHabitacion);
        if (fotoHabitacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fotoHabitacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fotoHabitacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FotoHabitacion result = fotoHabitacionRepository.save(fotoHabitacion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fotoHabitacion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /foto-habitacions/:id} : Partial updates given fields of an existing fotoHabitacion, field will ignore if it is null
     *
     * @param id the id of the fotoHabitacion to save.
     * @param fotoHabitacion the fotoHabitacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fotoHabitacion,
     * or with status {@code 400 (Bad Request)} if the fotoHabitacion is not valid,
     * or with status {@code 404 (Not Found)} if the fotoHabitacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the fotoHabitacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/foto-habitacions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FotoHabitacion> partialUpdateFotoHabitacion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FotoHabitacion fotoHabitacion
    ) throws URISyntaxException {
        log.debug("REST request to partial update FotoHabitacion partially : {}, {}", id, fotoHabitacion);
        if (fotoHabitacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fotoHabitacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fotoHabitacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FotoHabitacion> result = fotoHabitacionRepository
            .findById(fotoHabitacion.getId())
            .map(
                existingFotoHabitacion -> {
                    if (fotoHabitacion.getUrl() != null) {
                        existingFotoHabitacion.setUrl(fotoHabitacion.getUrl());
                    }

                    return existingFotoHabitacion;
                }
            )
            .map(fotoHabitacionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fotoHabitacion.getId().toString())
        );
    }

    /**
     * {@code GET  /foto-habitacions} : get all the fotoHabitacions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fotoHabitacions in body.
     */
    @GetMapping("/foto-habitacions")
    public List<FotoHabitacion> getAllFotoHabitacions() {
        log.debug("REST request to get all FotoHabitacions");
        return fotoHabitacionRepository.findAll();
    }

    /**
     * {@code GET  /foto-habitacions/:id} : get the "id" fotoHabitacion.
     *
     * @param id the id of the fotoHabitacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fotoHabitacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/foto-habitacions/{id}")
    public ResponseEntity<FotoHabitacion> getFotoHabitacion(@PathVariable Long id) {
        log.debug("REST request to get FotoHabitacion : {}", id);
        Optional<FotoHabitacion> fotoHabitacion = fotoHabitacionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fotoHabitacion);
    }

    /**
     * {@code DELETE  /foto-habitacions/:id} : delete the "id" fotoHabitacion.
     *
     * @param id the id of the fotoHabitacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/foto-habitacions/{id}")
    public ResponseEntity<Void> deleteFotoHabitacion(@PathVariable Long id) {
        log.debug("REST request to delete FotoHabitacion : {}", id);
        fotoHabitacionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
