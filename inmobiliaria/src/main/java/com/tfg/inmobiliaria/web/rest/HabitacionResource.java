package com.tfg.inmobiliaria.web.rest;

import com.tfg.inmobiliaria.domain.Habitacion;
import com.tfg.inmobiliaria.repository.HabitacionRepository;
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
 * REST controller for managing {@link com.tfg.inmobiliaria.domain.Habitacion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HabitacionResource {

    private final Logger log = LoggerFactory.getLogger(HabitacionResource.class);

    private static final String ENTITY_NAME = "habitacion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HabitacionRepository habitacionRepository;

    public HabitacionResource(HabitacionRepository habitacionRepository) {
        this.habitacionRepository = habitacionRepository;
    }

    /**
     * {@code POST  /habitacions} : Create a new habitacion.
     *
     * @param habitacion the habitacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new habitacion, or with status {@code 400 (Bad Request)} if the habitacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/habitacions")
    public ResponseEntity<Habitacion> createHabitacion(@RequestBody Habitacion habitacion) throws URISyntaxException {
        log.debug("REST request to save Habitacion : {}", habitacion);
        if (habitacion.getId() != null) {
            throw new BadRequestAlertException("A new habitacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Habitacion result = habitacionRepository.save(habitacion);
        return ResponseEntity
            .created(new URI("/api/habitacions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /habitacions/:id} : Updates an existing habitacion.
     *
     * @param id the id of the habitacion to save.
     * @param habitacion the habitacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habitacion,
     * or with status {@code 400 (Bad Request)} if the habitacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the habitacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/habitacions/{id}")
    public ResponseEntity<Habitacion> updateHabitacion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Habitacion habitacion
    ) throws URISyntaxException {
        log.debug("REST request to update Habitacion : {}, {}", id, habitacion);
        if (habitacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habitacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Habitacion result = habitacionRepository.save(habitacion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, habitacion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /habitacions/:id} : Partial updates given fields of an existing habitacion, field will ignore if it is null
     *
     * @param id the id of the habitacion to save.
     * @param habitacion the habitacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated habitacion,
     * or with status {@code 400 (Bad Request)} if the habitacion is not valid,
     * or with status {@code 404 (Not Found)} if the habitacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the habitacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/habitacions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Habitacion> partialUpdateHabitacion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Habitacion habitacion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Habitacion partially : {}, {}", id, habitacion);
        if (habitacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, habitacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!habitacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Habitacion> result = habitacionRepository
            .findById(habitacion.getId())
            .map(
                existingHabitacion -> {
                    if (habitacion.getPrecio() != null) {
                        existingHabitacion.setPrecio(habitacion.getPrecio());
                    }
                    if (habitacion.getDescripcion() != null) {
                        existingHabitacion.setDescripcion(habitacion.getDescripcion());
                    }

                    return existingHabitacion;
                }
            )
            .map(habitacionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, habitacion.getId().toString())
        );
    }

    /**
     * {@code GET  /habitacions} : get all the habitacions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of habitacions in body.
     */
    @GetMapping("/habitacions")
    public List<Habitacion> getAllHabitacions() {
        log.debug("REST request to get all Habitacions");
        return habitacionRepository.findAll();
    }

    /**
     * {@code GET  /habitacions/:id} : get the "id" habitacion.
     *
     * @param id the id of the habitacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the habitacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/habitacions/{id}")
    public ResponseEntity<Habitacion> getHabitacion(@PathVariable Long id) {
        log.debug("REST request to get Habitacion : {}", id);
        Optional<Habitacion> habitacion = habitacionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(habitacion);
    }

    /**
     * {@code DELETE  /habitacions/:id} : delete the "id" habitacion.
     *
     * @param id the id of the habitacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/habitacions/{id}")
    public ResponseEntity<Void> deleteHabitacion(@PathVariable Long id) {
        log.debug("REST request to delete Habitacion : {}", id);
        habitacionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
